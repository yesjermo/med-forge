import type { Writer } from "./llm/types";
import { SYSTEM_PROMPT, buildUserMessage, type PackName } from "./prompts";
import { lintOptionsFor } from "./evidence";
import { formatEvidence, gatherEvidence, planQueries, type ResearchEvent } from "./research/pipeline";
import type { ResearchProvider, Source } from "./research/types";
import { normalizeOutput } from "./normalize";
import { formatIssues, lint, type LintResult } from "./validator";


// ── Input checks (shared by the CLI, the API routes and the pipeline) ──
/** Inputs longer than this are rejected rather than silently truncated (~50k tokens). */
export const MAX_INPUT_CHARS = 200_000;

export class InputError extends Error {}

export const MAX_LEAD_CHARS = 2_000;

export function checkLead(lead: string | undefined): string | undefined {
  const t = lead?.trim();
  if (!t) return undefined;
  if (t.length > MAX_LEAD_CHARS) {
    throw new InputError(`The research lead is over ${MAX_LEAD_CHARS.toLocaleString()} characters. Keep it to your question or thesis.`);
  }
  return t;
}

/** Fewer words than this can't be source material; small models invent a whole topic from "hi". */
export const MIN_INPUT_WORDS = 5;

export function checkInput(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) throw new InputError("Input is empty. Paste a paper, lecture or spec first.");
  if (trimmed.split(/\s+/).length < MIN_INPUT_WORDS) {
    throw new InputError(
      `Input is too short to turn into study blocks (at least ${MIN_INPUT_WORDS} words). Paste the lecture, paper section or problem itself.`,
    );
  }
  if (trimmed.length > MAX_INPUT_CHARS) {
    throw new InputError(
      `Input is ${trimmed.length.toLocaleString()} characters; the limit is ${MAX_INPUT_CHARS.toLocaleString()}. Split it into sections and run each one.`,
    );
  }
  return trimmed;
}

export type Stage = "planning" | "searching" | "writing" | "repairing";

export type RunEvent =
  | { type: "stage"; stage: Stage }
  | { type: "queries"; queries: string[] }
  | { type: "research"; events: ResearchEvent[] }
  | { type: "sources"; sources: Source[] }
  | { type: "text"; delta: string }
  /** The writer is starting over (repair pass); clear the streamed text. */
  | { type: "reset" }
  /** Cleaned-up final text; replaces whatever was streamed. */
  | { type: "final"; text: string }
  | { type: "done"; result: RunSummary }
  | { type: "error"; message: string };

export interface RunSummary {
  model: string;
  writer: string;
  truncated: boolean;
  repaired: boolean;
  errorCount: number;
  warningCount: number;
}

export interface RunOptions {
  pack: PackName;
  input: string;
  writer: Writer;
  /** Research providers to query. Empty means no automatic search. */
  providers?: ResearchProvider[];
  /** Text pasted from Perplexity / Elicit / Consensus; DOIs and links are pulled out of it. */
  manualEvidence?: string;
  /** The student's question, thesis or angle; steers searches and writing. */
  lead?: string;
  /** Fix format errors with one extra writer pass. Default true. */
  repair?: boolean;
  emit?: (e: RunEvent) => void;
  signal?: AbortSignal;
  fetch?: typeof fetch;
}

export interface RunResult {
  text: string;
  lint: LintResult;
  sources: Source[];
  queries: string[];
  research: ResearchEvent[];
  summary: RunSummary;
}

function lintWith(text: string, sources: Source[], input: string, researched: boolean): LintResult {
  // Without research, [S#] tags can't be checked; with research, every tag must match a retrieved source.
  if (!researched) return lint(text);
  return lint(text, lintOptionsFor(sources, input));
}

/**
 * Full pipeline: plan search queries → research (providers + pasted evidence) →
 * write blocks citing [S#] sources → lint → optional repair pass.
 */
export async function runPack(opts: RunOptions): Promise<RunResult> {
  const input = checkInput(opts.input);
  const lead = checkLead(opts.lead);
  const emit = opts.emit ?? (() => {});
  const providers = opts.providers ?? [];
  const sig = opts.signal ? { signal: opts.signal } : {};

  let queries: string[] = [];
  let sources: Source[] = [];
  let research: ResearchEvent[] = [];
  const researched = providers.length > 0 || Boolean(opts.manualEvidence?.trim());

  if (researched) {
    if (providers.length > 0) {
      emit({ type: "stage", stage: "planning" });
      queries = await planQueries(input, opts.writer, opts.signal, lead);
      emit({ type: "queries", queries });
    }
    emit({ type: "stage", stage: "searching" });
    const gathered = await gatherEvidence({
      queries,
      providers,
      ...(opts.manualEvidence ? { manualText: opts.manualEvidence } : {}),
      ...sig,
      ...(opts.fetch ? { fetch: opts.fetch } : {}),
    });
    sources = gathered.sources;
    research = gathered.events;
    emit({ type: "research", events: research });
    emit({ type: "sources", sources });
  }

  const user = buildUserMessage(opts.pack, input, sources.length ? formatEvidence(sources) : undefined, lead);
  emit({ type: "stage", stage: "writing" });
  let out = await opts.writer.complete({
    system: SYSTEM_PROMPT,
    user,
    onText: (delta) => emit({ type: "text", delta }),
    ...sig,
  });
  out = { ...out, text: normalizeOutput(out.text) };
  let result = lintWith(out.text, sources, input, researched);
  let repaired = false;

  if ((opts.repair ?? true) && !result.ok && !out.truncated) {
    emit({ type: "stage", stage: "repairing" });
    emit({ type: "reset" });
    const fix = await opts.writer.complete({
      system: SYSTEM_PROMPT,
      user: `${user}

Your previous answer broke these format rules:
${formatIssues(result.issues.filter((i) => i.severity === "error"), "answer")}

Previous answer:
<<<
${out.text}
>>>

Return the complete corrected output only, following every rule.`,
      onText: (delta) => emit({ type: "text", delta }),
      ...sig,
    });
    const fixedText = normalizeOutput(fix.text);
    const fixedLint = lintWith(fixedText, sources, input, researched);
    if (fixedLint.blocks.length > 0 && fixedLint.errorCount < result.errorCount) {
      out = { ...fix, text: fixedText };
      result = fixedLint;
      repaired = true;
    } else {
      // The repair made things worse: show the first answer again.
      emit({ type: "reset" });
      emit({ type: "text", delta: out.text });
    }
  }

  emit({ type: "final", text: out.text });
  const summary: RunSummary = {
    model: out.model,
    writer: opts.writer.name,
    truncated: out.truncated,
    repaired,
    errorCount: result.errorCount,
    warningCount: result.warningCount,
  };
  emit({ type: "done", result: summary });
  return { text: out.text, lint: result, sources, queries, research, summary };
}
