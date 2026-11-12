import { sourceLine } from "../evidence";
import type { Writer } from "../llm/types";
import { manualSources } from "./manual";
import type { ProviderName, ResearchProvider, Source, SourceDraft } from "./types";

const STOPWORDS = new Set(
  "the a an and or of to in on for with by from at as is are was were be been this that these those it its into than then there their which who whom what when where how why can may might will would should could not no we you they he she i our your lecture notes week chapter section figure table example".split(
    " ",
  ),
);

/** Fallback when the writer can't plan queries: the title line plus the most frequent content words. */
export function heuristicQueries(input: string, max = 2, lead?: string): string[] {
  const lines = input.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = (lines[0] ?? "").replace(/^(lecture|week|chapter)\s*\d+\s*[—:–-]\s*/i, "").slice(0, 120);
  const counts = new Map<string, number>();
  for (const w of input.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []) {
    if (!STOPWORDS.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
  const queries = [lead?.trim().slice(0, 120) ?? "", title, top.join(" ")].filter((q) => q.length > 3);
  return [...new Set(queries)].slice(0, max);
}

const PLAN_SYSTEM = `You write literature search queries. Reply with JSON only: {"queries": ["...", "..."]}.
Give 2 or 3 short keyword queries (4-8 words each) that would find peer-reviewed papers supporting the key claims, methods or derivations in the material. No quotes, no boolean operators.`;

/** Ask the writer for 2–3 search queries; fall back to a heuristic on any failure. */
export async function planQueries(input: string, writer: Writer, signal?: AbortSignal, lead?: string): Promise<string[]> {
  try {
    const res = await writer.complete({
      system: PLAN_SYSTEM,
      user: lead ? `RESEARCH LEAD: ${lead}\n(Put queries that test this lead first.)\n\n${input.slice(0, 12000)}` : input.slice(0, 12000),
      json: true,
      maxTokens: 400,
      ...(signal ? { signal } : {}),
    });
    const match = /\{[\s\S]*\}/.exec(res.text);
    const parsed = match ? (JSON.parse(match[0]) as { queries?: unknown }) : {};
    const queries = Array.isArray(parsed.queries)
      ? parsed.queries.filter((q): q is string => typeof q === "string" && q.trim().length > 3).map((q) => q.trim())
      : [];
    if (queries.length) return queries.slice(0, 3);
  } catch (err) {
    if (signal?.aborted) throw err;
  }
  return heuristicQueries(input, 2, lead);
}

function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Merge drafts from several providers, de-duplicate by DOI then title, and number them S1..Sn. */
export function mergeSources(found: { provider: ProviderName; drafts: SourceDraft[] }[], max = 12): Source[] {
  const out: Source[] = [];
  const byKey = new Map<string, Source>();
  // Interleave providers so one provider can't fill the whole list.
  const longest = Math.max(0, ...found.map((f) => f.drafts.length));
  for (let i = 0; i < longest; i++) {
    for (const { provider, drafts } of found) {
      const d = drafts[i];
      if (!d) continue;
      const keys = [d.doi ? `doi:${d.doi}` : null, `t:${normTitle(d.title)}`, d.url ? `u:${d.url}` : null].filter(
        (k): k is string => k !== null,
      );
      const existing = keys.map((k) => byKey.get(k)).find(Boolean);
      if (existing) {
        if (!existing.foundBy.includes(provider)) existing.foundBy.push(provider);
        existing.snippet ??= d.snippet;
        existing.doi ??= d.doi;
        existing.studyInfo ??= d.studyInfo;
        continue;
      }
      if (out.length >= max) continue;
      const src: Source = { ...d, id: `S${out.length + 1}`, foundBy: [provider] };
      out.push(src);
      keys.forEach((k) => byKey.set(k, src));
    }
  }
  return out;
}

export interface ResearchEvent {
  provider: ProviderName;
  ok: boolean;
  count: number;
  error?: string;
}

/** Run every provider on every query (in parallel) plus pasted evidence, then merge. Failures are reported, not thrown. */
export async function gatherEvidence(opts: {
  queries: string[];
  providers: ResearchProvider[];
  manualText?: string;
  perQuery?: number;
  max?: number;
  signal?: AbortSignal;
  fetch?: typeof fetch;
}): Promise<{ sources: Source[]; events: ResearchEvent[] }> {
  const perQuery = opts.perQuery ?? 4;
  const base = { ...(opts.signal ? { signal: opts.signal } : {}), ...(opts.fetch ? { fetch: opts.fetch } : {}) };

  const jobs = opts.providers.map(async (p) => {
    const drafts: SourceDraft[] = [];
    try {
      for (const q of opts.queries) {
        drafts.push(...(await p.search(q, { limit: perQuery, ...base })));
      }
      return { provider: p.name, drafts, event: { provider: p.name, ok: true, count: drafts.length } };
    } catch (err) {
      if (opts.signal?.aborted) throw err;
      const error = err instanceof Error ? err.message : String(err);
      return { provider: p.name, drafts, event: { provider: p.name, ok: false, count: drafts.length, error } };
    }
  });
  const manual = opts.manualText?.trim()
    ? manualSources(opts.manualText, base).then((drafts) => ({
        provider: "manual" as const,
        drafts,
        event: { provider: "manual" as const, ok: true, count: drafts.length },
      }))
    : null;

  const results = await Promise.all(manual ? [manual, ...jobs] : jobs);
  return {
    sources: mergeSources(results, opts.max ?? 12),
    events: results.map((r) => r.event),
  };
}

/** Render sources as the EVIDENCE section of the writer prompt. */
export function formatEvidence(sources: Source[]): string {
  return sources
    .map((s) => {
      const head = `[${s.id}] | ${sourceLine(s)}`;
      const extra = [s.studyInfo ? `study: ${s.studyInfo}` : null, s.snippet ? `excerpt: ${s.snippet}` : null]
        .filter(Boolean)
        .join("\n    ");
      return extra ? `${head}\n    ${extra}` : head;
    })
    .join("\n");
}
