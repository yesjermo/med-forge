import { useMemo, useRef, useState, type ReactNode } from "react";
import { AdvicePanel } from "@/components/AdvicePanel";
import { BlockCard } from "@/components/BlockCard";
import { EvidenceList } from "@/components/EvidenceList";
import { Icon } from "@/components/Icon";
import { IssueList } from "@/components/IssueList";
import { formatReferences, lintOptionsFor } from "@/engine/evidence";
import { PACKS, PACK_NAMES, type PackName } from "@/engine/prompts";
import type { ResearchEvent } from "@/engine/research/pipeline";
import type { Source } from "@/engine/research/types";
import type { RunEvent, Stage } from "@/engine/run";
import { lint } from "@/engine/validator";
import type { Advisor } from "@/components/useAdvisor";

const STAGE_LABEL: Record<Stage, string> = {
  planning: "Planning searches…",
  searching: "Searching for papers…",
  writing: "Writing blocks…",
  repairing: "Fixing format errors…",
};

export interface GenerateRequest {
  pack: PackName;
  input: string;
  lead: string;
  manualEvidence: string;
}

/** Runs one generation, reporting progress as RunEvents. The full app streams from its API; the web edition runs in the browser. */
export type GenerateRunner = (req: GenerateRequest, emit: (e: RunEvent) => void, signal: AbortSignal) => Promise<void>;

/**
 * The generator and "Check my blocks" screen, shared by the full app and the web edition.
 * Each version supplies only what differs: the writer control, the research-tool checkboxes,
 * how a run executes, and where a finished pack is shared.
 */
export function GeneratorView({
  mode,
  onModeChange,
  intro,
  writerControl,
  providerControls,
  extraFields,
  footnote,
  run,
  advisor,
  share,
}: {
  mode: "generate" | "check";
  onModeChange: (mode: "generate" | "check") => void;
  intro: string;
  writerControl: ReactNode;
  providerControls: ReactNode;
  extraFields?: ReactNode;
  footnote?: ReactNode;
  run: GenerateRunner;
  advisor: Advisor;
  /** Label for the share button and the last empty-state step, plus what it does. */
  share: { label: string; where: string; onShare: (body: string, title: string, pack: PackName) => void };
}) {
  const [pack, setPack] = useState<PackName>("medicine");
  const [input, setInput] = useState("");
  const [lead, setLead] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState<Stage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [queries, setQueries] = useState<string[]>([]);
  const [research, setResearch] = useState<ResearchEvent[] | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // `research` is set only when the run searched (or used pasted evidence), so [S#] tags are checked only then.
  const result = useMemo(
    () =>
      mode === "generate" && research
        ? lint(output, lintOptionsFor(sources, `${input}\n${evidenceText}`))
        : lint(output),
    [output, sources, research, mode, input, evidenceText],
  );

  async function generate() {
    setError(null);
    setOutput("");
    setSources([]);
    setQueries([]);
    setResearch(null);
    setRunning(true);
    setStage(null);
    const controller = new AbortController();
    abortRef.current = controller;
    let text = "";
    const emit = (e: RunEvent) => {
      if (e.type === "stage") setStage(e.stage);
      else if (e.type === "queries") setQueries(e.queries);
      else if (e.type === "research") setResearch(e.events);
      else if (e.type === "sources") setSources(e.sources);
      else if (e.type === "text") setOutput((text += e.delta));
      else if (e.type === "reset") setOutput((text = ""));
      else if (e.type === "final") setOutput((text = e.text));
      else if (e.type === "error") throw new Error(e.message);
    };
    try {
      await run({ pack, input, lead, manualEvidence: evidenceText }, emit, controller.signal);
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
      setStage(null);
      abortRef.current = null;
    }
  }

  /** The blocks plus a References list, so [S#] tags still resolve after the pack leaves this page. */
  function withReferences(): string {
    const refs = mode === "generate" ? formatReferences(sources) : "";
    return refs && !/^references:\s*$/im.test(output) ? `${output.trim()}\n\n${refs}` : output;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(withReferences());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Couldn't copy. Select the text and copy it manually.");
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([withReferences() + "\n"], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.blocks[0]?.attrs.id ?? "study-forge-pack"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <h1>Generate study blocks</h1>
      <p className="lede">{intro}</p>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={mode === "generate"} onClick={() => onModeChange("generate")}>
          Generate a pack
        </button>
        <button role="tab" aria-selected={mode === "check"} onClick={() => onModeChange("check")}>
          Check my blocks
        </button>
      </div>

      <div className="layout">
        <section className="panel">
          {mode === "generate" ? (
            <>
              <div className="row">
                <label className="field">
                  <span>Pack</span>
                  <select value={pack} onChange={(e) => setPack(e.target.value as PackName)} disabled={running}>
                    {PACK_NAMES.map((p) => (
                      <option key={p} value={p}>
                        {PACKS[p].label}
                      </option>
                    ))}
                  </select>
                </label>
                {writerControl}
              </div>

              <label className="field">
                <span>Source material</span>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste lecture notes, a paper abstract, a clinical or veterinary case, a care plan…"
                  rows={12}
                  disabled={running}
                />
              </label>

              <label className="field lead-field">
                <span>Research lead (optional)</span>
                <textarea
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                  placeholder="Your question, thesis or angle, e.g. “Does early mobilisation reduce pressure injuries in ICU patients?”"
                  rows={2}
                  maxLength={2000}
                  disabled={running}
                />
                <small className="hint">Steers which papers are searched for and what the blocks focus on.</small>
              </label>

              <fieldset className="field providers" disabled={running}>
                <legend>Find papers with</legend>
                {providerControls}
              </fieldset>

              <details className="field">
                <summary>Paste results from Perplexity, Elicit or Consensus (optional)</summary>
                <textarea
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Search on perplexity.ai, elicit.com or consensus.app, then paste the answer, a list of links, or an exported CSV/BibTeX here. DOIs and links are picked out automatically."
                  rows={6}
                  disabled={running}
                />
              </details>

              {extraFields}

              <div className="actions">
                {running ? (
                  <button className="secondary" onClick={() => abortRef.current?.abort()}>
                    <Icon name="stop" /> Stop
                  </button>
                ) : (
                  <button onClick={generate} disabled={input.trim() === ""}>
                    <Icon name="spark" /> Generate
                  </button>
                )}
                <span className="hint">
                  {running && stage ? STAGE_LABEL[stage] : `${input.length.toLocaleString()} characters`}
                </span>
              </div>
              {footnote}
            </>
          ) : (
            <label className="field">
              <span>Your blocks</span>
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder={'::: proof id="MED-SEPSIS-0001" domain="MEDICINE" title="..."\n...\n:::'}
                rows={22}
                spellCheck={false}
                className="mono"
              />
            </label>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="panel">
          <div className="result-head">
            <h2>
              {result.blocks.length} block{result.blocks.length === 1 ? "" : "s"}
              {running && stage && <span className="pulse">{STAGE_LABEL[stage]}</span>}
            </h2>
            {output && !running && (
              <div className="actions">
                <button className="secondary" onClick={copy}>
                  <Icon name={copied ? "check" : "copy"} /> {copied ? "Copied" : "Copy"}
                </button>
                <button className="secondary" onClick={download}>
                  <Icon name="download" /> Download .md
                </button>
                <button
                  className="secondary"
                  disabled={advisor.running}
                  onClick={() => advisor.advise({ text: output, lead, sources })}
                >
                  <Icon name="message" /> Advise me
                </button>
                <button onClick={() => share.onShare(withReferences(), result.blocks[0]?.attrs.title ?? "", pack)}>
                  <Icon name="share" /> {share.label}
                </button>
              </div>
            )}
          </div>

          {advisor.open && (
            <AdvicePanel
              checks={advisor.checks}
              text={advisor.text}
              running={advisor.running}
              error={advisor.error}
              knownIds={advisor.knownIds}
              onUseSearch={mode === "generate" ? setLead : undefined}
            />
          )}

          {mode === "generate" && (queries.length > 0 || research || sources.length > 0) && (
            <EvidenceList queries={queries} research={research ?? []} sources={sources} />
          )}

          {output && !running && (
            <details className="lint" open={!result.ok}>
              <summary>
                Format check: {result.errorCount} error(s), {result.warningCount} warning(s)
              </summary>
              <IssueList issues={result.issues} />
            </details>
          )}

          {result.blocks.map((b) => (
            <BlockCard
              key={b.startLine}
              block={b}
              issues={result.issues.filter((i) => i.line >= b.startLine && i.line <= b.endLine)}
            />
          ))}

          {result.openQuestions.length > 0 && (
            <div className="open-questions">
              <h3>Open questions</h3>
              <ul>
                {result.openQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {!output && !running && mode === "generate" && (
            <ol className="steps">
              {[
                ["Plan.", "The writer picks 2–3 search queries from your material (and your lead)."],
                ["Search.", "Crossref, and any tool you have a key for, finds real papers, numbered [S1], [S2]…"],
                ["Write.", "Proof, idea and exchange blocks appear here, citing only those sources."],
                ["Check & share.", `The format check flags problems; ask for advice, then share the pack to ${share.where}.`],
              ].map(([step, what]) => (
                <li key={step}>
                  <span>
                    <strong>{step}</strong> {what}
                  </span>
                </li>
              ))}
            </ol>
          )}
          {!output && mode === "check" && <p className="empty">Paste blocks on the left to check them.</p>}
          {running && !output && stage === "writing" && <p className="empty">Waiting for the first words…</p>}
        </section>
      </div>
    </main>
  );
}
