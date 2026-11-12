import { Fragment, useState, type ComponentType } from "react";
import { fetchCitationData, formatAMA, formatAPA, type CitationData } from "../research/cite";
import { PICO_ELEMENTS, STUDY_TYPES, buildPubmedQuery, framePicoQuestion, pubmedUrl, splitSynonyms, type PicoElement, type StudyType } from "../research/pico";
import { diagnostic, treatment, type Interval } from "../research/stats";
import { Crumbs, Tabs } from "../ui";
import "../research/research.css";

type Tab = "pico" | "calc" | "evidence" | "cite";
const TABS: [Tab, string][] = [
  ["pico", "PICO & search"],
  ["calc", "2×2 calculator"],
  ["evidence", "Evidence & appraisal"],
  ["cite", "Cite a DOI"],
];

/** Copy text to the clipboard and say so for a moment. */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      type="button"
      className="secondary small"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("copied");
        } catch {
          setState("failed");
        }
        setTimeout(() => setState("idle"), 1800);
      }}
    >
      <span aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Select and copy manually" : label}</span>
    </button>
  );
}

/* ---------------- PICO & search ---------------- */

const PICO_LABEL: Record<PicoElement, [title: string, placeholder: string, synonyms: string]> = {
  population: ["P: Population / problem", "e.g. adults with type 2 diabetes", "e.g. T2DM, diabetes mellitus type 2"],
  intervention: ["I: Intervention / exposure", "e.g. metformin", "e.g. biguanide"],
  comparison: ["C: Comparison (optional)", "e.g. sulfonylurea", "e.g. gliclazide, glipizide"],
  outcome: ["O: Outcome", "e.g. cardiovascular events", "e.g. myocardial infarction, stroke"],
};

const STUDY_LABEL: Record<StudyType, string> = {
  "randomized controlled trial": "Randomised controlled trials",
  "systematic review": "Systematic reviews",
  "meta-analysis": "Meta-analyses",
};

const EMPTY_PICO: Record<PicoElement, string> = { population: "", intervention: "", comparison: "", outcome: "" };

function PicoTab() {
  const [pico, setPico] = useState(EMPTY_PICO);
  const [syn, setSyn] = useState(EMPTY_PICO);
  const [years, setYears] = useState("");
  const [types, setTypes] = useState<StudyType[]>([]);

  const synonyms = Object.fromEntries(PICO_ELEMENTS.map((el) => [el, splitSynonyms(syn[el])])) as Record<PicoElement, string[]>;
  const query = buildPubmedQuery({ ...pico, synonyms, filters: { ...(years ? { years: Number(years) } : {}), studyTypes: types } });
  const question = framePicoQuestion(pico);
  const hasConcept = PICO_ELEMENTS.some((el) => pico[el].trim() || synonyms[el].length);

  return (
    <section className="panel">
      <h2>Frame the question, then search</h2>
      <p className="hint">
        Put one main term in each box and alternative wordings (synonyms, abbreviations, UK/US spellings) after it, separated
        by commas. Each element is searched in titles and abstracts.
      </p>
      {PICO_ELEMENTS.map((el) => {
        const [title, placeholder, synPlaceholder] = PICO_LABEL[el];
        return (
          <div className="row" key={el}>
            <label className="field">
              <span>{title}</span>
              <input value={pico[el]} placeholder={placeholder} onChange={(e) => setPico({ ...pico, [el]: e.target.value })} />
            </label>
            <label className="field">
              <span>Synonyms</span>
              <input value={syn[el]} placeholder={synPlaceholder} onChange={(e) => setSyn({ ...syn, [el]: e.target.value })} />
            </label>
          </div>
        );
      })}
      <fieldset className="rt-filters">
        <legend>Filters (optional)</legend>
        <label className="field">
          <span>Published in the last</span>
          <select value={years} onChange={(e) => setYears(e.target.value)}>
            <option value="">any time</option>
            {[1, 5, 10].map((n) => <option key={n} value={n}>{n} year{n === 1 ? "" : "s"}</option>)}
          </select>
        </label>
        {STUDY_TYPES.map((t) => (
          <label className="check" key={t}>
            <input type="checkbox" checked={types.includes(t)} onChange={(e) => setTypes(e.target.checked ? [...types, t] : types.filter((x) => x !== t))} />
            {STUDY_LABEL[t]}
          </label>
        ))}
      </fieldset>

      <div className="rt-section">
        <h3>Your clinical question</h3>
        <p className={question ? "rt-question" : "hint"}>{question || "Fill in P, I and O to see the question."}</p>
      </div>
      <div className="rt-section">
        <h3>PubMed query</h3>
        {hasConcept ? (
          <>
            <code className="rt-code">{query}</code>
            <div className="actions">
              <CopyButton text={query} label="Copy query" />
              <a className="button small" href={pubmedUrl(query)} target="_blank" rel="noopener noreferrer">
                Open in PubMed
              </a>
            </div>
            <p className="hint">
              Too many results? Add a study-type filter or a narrower outcome. Too few? Add synonyms or drop the comparison.
              Consider MeSH terms too ([mh]) once you know the right headings.
            </p>
          </>
        ) : (
          <p className="hint">The query appears here as you type.</p>
        )}
      </div>
    </section>
  );
}

/* ---------------- 2×2 calculator ---------------- */

const pct = (x: number | null) => (x === null ? "n/a" : `${(x * 100).toFixed(1)}%`);
const num = (x: number | null, d = 2) => (x === null || !Number.isFinite(x) ? "n/a" : Number(x.toFixed(d)).toString());
const ciPct = (c: Interval | null) => (c ? `${(c.lower * 100).toFixed(1)}–${(c.upper * 100).toFixed(1)}%` : "n/a");
const ciNum = (c: Interval | null) => (c ? `${num(c.lower)}–${num(c.upper)}` : "n/a");

/** Plain-language reading of a likelihood ratio, by the usual bands. */
function lrLine(lr: number | null, sign: "+" | "−"): string | null {
  if (lr === null) return null;
  const pos = sign === "+";
  const bands: [boolean, string, string][] = pos
    ? [[lr > 10, "above 10", "strongly rules in the condition"], [lr > 5, "5–10", "moderately raises the probability"],
       [lr > 2, "2–5", "raises the probability a little"], [lr >= 1, "1–2", "barely changes the probability"]]
    : [[lr < 0.1, "below 0.1", "strongly rules out the condition"], [lr < 0.2, "0.1–0.2", "moderately lowers the probability"],
       [lr < 0.5, "0.2–0.5", "lowers the probability a little"], [lr <= 1, "0.5–1", "barely changes the probability"]];
  const [, range, effect] = bands.find(([hit]) => hit)
    ?? [true, pos ? "below 1" : "above 1", `makes the condition ${pos ? "less" : "more"} likely, so check the table orientation`];
  return `LR${sign} ${num(lr)}: ${range}, a ${pos ? "positive" : "negative"} result ${effect}.`;
}

type Results = { rows: [measure: string, value: string, ci?: string][]; note: string; lines: (string | false | null)[] };

function diagnosticResults([tp, fp, fn, tn]: number[]): Results {
  const r = diagnostic({ tp: tp!, fp: fp!, fn: fn!, tn: tn! });
  return {
    rows: [
      ["Sensitivity", pct(r.sensitivity), ciPct(r.sensitivityCI)], ["Specificity", pct(r.specificity), ciPct(r.specificityCI)],
      ["PPV", pct(r.ppv)], ["NPV", pct(r.npv)], ["LR+", num(r.lrPositive)], ["LR−", num(r.lrNegative, 3)],
      ["Accuracy", pct(r.accuracy)], ["Prevalence (sample)", pct(r.prevalence)],
    ],
    note: "Confidence intervals for sensitivity and specificity use the Wilson score method.",
    lines: [
      r.sensitivity !== null &&
        `Sensitivity ${pct(r.sensitivity)}: the test picks up ${Math.round(r.sensitivity * 100)} of every 100 people who have the condition.${r.sensitivity >= 0.95 ? " Very sensitive: a negative result helps rule out (SnNOut)." : ""}`,
      r.specificity !== null &&
        `Specificity ${pct(r.specificity)}: ${Math.round(r.specificity * 100)} of every 100 people without the condition test negative.${r.specificity >= 0.95 ? " Very specific: a positive result helps rule in (SpPIn)." : ""}`,
      lrLine(r.lrPositive, "+"),
      lrLine(r.lrNegative, "−"),
      r.prevalence !== null &&
        `PPV and NPV apply to a prevalence of ${pct(r.prevalence)}, as in this sample. In a population where the condition is rarer, PPV falls and NPV rises.`,
    ],
  };
}

function treatmentResults([a, b, c, d]: number[]): Results {
  const r = treatment({ eventsTreated: a!, totalTreated: a! + b!, eventsControl: c!, totalControl: c! + d! });
  const nnt = r.nnt && Math.ceil(r.nnt.value);
  return {
    rows: [
      ["EER (treated)", pct(r.eer)], ["CER (control)", pct(r.cer)], ["Relative risk", num(r.rr), ciNum(r.rrCI)],
      ["ARR (CER − EER)", pct(r.arr)], ["RRR", pct(r.rrr)],
      [r.nnt?.label ?? "NNT", r.nnt ? `${num(r.nnt.value, 1)} (round up: ${nnt})` : "n/a (no difference)"],
      ["Odds ratio", num(r.oddsRatio), ciNum(r.orCI)],
    ],
    note: "RR interval: log method. OR interval: Woolf method (not available when a cell is 0).",
    lines: [
      `Event rate: ${pct(r.eer)} with treatment vs ${pct(r.cer)} in the control group.`,
      r.rr !== null &&
        (r.rr < 1
          ? `RR ${num(r.rr)}: the treated group had ${pct(1 - r.rr)} lower risk relative to control.`
          : r.rr > 1
            ? `RR ${num(r.rr)}: the treated group had ${pct(r.rr - 1)} higher risk relative to control.`
            : "RR 1: no difference in risk."),
      r.rrCI &&
        (r.rrCI.lower < 1 && r.rrCI.upper > 1
          ? `The RR confidence interval (${ciNum(r.rrCI)}) includes 1, so the data are compatible with no effect.`
          : `The RR confidence interval (${ciNum(r.rrCI)}) excludes 1, so chance alone is an unlikely explanation.`),
      r.nnt &&
        (r.nnt.label === "NNT"
          ? `NNT ${nnt}: treat about ${nnt} people for one to avoid an event (ARR ${pct(r.arr)}).`
          : `NNH ${nnt}: for about every ${nnt} people treated, one extra has the event (absolute risk increase ${pct(-r.arr)}).`),
      "Relative measures (RR, RRR) look impressive when baseline risk is low; ARR and NNT show the size of the benefit for patients.",
    ],
  };
}

function ResultsView({ rows, note, lines }: Results) {
  return (
    <>
      <table className="rt-results">
        <thead>
          <tr><th scope="col">Measure</th><th scope="col">Value</th><th scope="col">95% CI</th></tr>
        </thead>
        <tbody>
          {rows.map(([measure, value, ci]) => (
            <tr key={measure}><th scope="row">{measure}</th><td>{value}</td><td>{ci}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="hint">{note}</p>
      <ul className="rt-interpret">
        {lines.filter((l): l is string => typeof l === "string").map((l) => <li key={l}>{l}</li>)}
      </ul>
    </>
  );
}

const MODES = {
  diagnostic: {
    label: "Diagnostic test",
    cols: ["Disease present", "Disease absent"],
    rows: ["Test positive", "Test negative"],
    names: ["TP", "FP", "FN", "TN"],
    hint: "Rows are the test result; columns are the reference standard (who really has the condition).",
    example: ["90", "10", "10", "90"],
    results: diagnosticResults,
  },
  treatment: {
    label: "Treatment effect",
    cols: ["Event", "No event"],
    rows: ["Treated", "Control"],
    names: ["Events", "No events", "Events", "No events"],
    hint: "Rows are the groups; an event is the outcome you want to prevent (e.g. death, relapse).",
    example: ["10", "90", "20", "80"],
    results: treatmentResults,
  },
};
const EMPTY_CELLS = ["", "", "", ""];

function CalcTab() {
  const [mode, setMode] = useState<keyof typeof MODES>("diagnostic");
  const [cells, setCells] = useState(EMPTY_CELLS);
  const m = MODES[mode];
  const counts = cells.map((s) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : null));

  let out = <p className="hint">Fill in all four cells to see the results.</p>;
  if (cells.every((v) => v.trim() !== "")) {
    if (counts.some((v) => v === null)) out = <p className="error-inline">Each cell must be a whole number of 0 or more.</p>;
    else {
      try {
        out = <ResultsView {...m.results(counts as number[])} />;
      } catch (e) {
        out = <p className="error-inline">{e instanceof Error ? e.message : String(e)}</p>;
      }
    }
  }

  return (
    <section className="panel">
      <h2>2×2 table</h2>
      <div className="rt-toggle" role="group" aria-label="Kind of study">
        {(Object.keys(MODES) as (keyof typeof MODES)[]).map((k) => (
          <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)}>
            {MODES[k].label}
          </button>
        ))}
      </div>
      <p className="hint">{m.hint}</p>
      <div className="rt-2x2">
        <span />
        {m.cols.map((col) => <span key={col} className="rt-head">{col}</span>)}
        {m.rows.map((row, r) => (
          <Fragment key={row}>
            <span className="rt-rowhead">{row}</span>
            {m.cols.map((col, c) => {
              const i = r * 2 + c;
              return (
                <label key={col} className="rt-cell">
                  <span>{m.names[i]}</span>
                  <input
                    inputMode="numeric"
                    value={cells[i]}
                    aria-label={`${row}, ${col}`}
                    onChange={(e) => setCells(cells.map((v, j) => (j === i ? e.target.value : v)))}
                  />
                </label>
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="secondary small" onClick={() => setCells(m.example)}>
          Try an example
        </button>
        <button type="button" className="secondary small" onClick={() => setCells(EMPTY_CELLS)}>
          Clear
        </button>
      </div>
      <div role="status" aria-live="polite" style={{ marginTop: 14 }}>
        {out}
      </div>
    </section>
  );
}

/* ---------------- Evidence & appraisal ---------------- */

const LEVELS: [name: string, can: string, cant: string][] = [
  ["Systematic reviews and meta-analyses",
   "Gather every relevant study on a question with a pre-set, reproducible method, and may pool results for a more precise estimate.",
   "Can't be better than the studies inside them. Pooling small, biased or very different trials gives a precise wrong answer."],
  ["Randomised controlled trials (RCTs)",
   "Random allocation balances known and unknown confounders, so a difference in outcome can be credited to the intervention.",
   "Can be too small or short for rare harms, and strict entry criteria may leave out the patients you actually see."],
  ["Cohort studies",
   "Follow exposed and unexposed people forward in time: good for incidence, prognosis and harms that can't ethically be randomised.",
   "Can't rule out confounding; people who choose an exposure differ in other ways. Show association, not proof of cause."],
  ["Case–control studies",
   "Start from people with and without an outcome and look back at exposures: efficient for rare diseases and long latency.",
   "Can't give incidence or risk directly (they give odds ratios), and rely on records or memory, so recall and selection bias creep in."],
  ["Case series and case reports",
   "Describe new diseases, unusual presentations or unexpected drug reactions, and raise hypotheses.",
   "Have no comparison group, so they can't show that an exposure or treatment made a difference."],
  ["Expert opinion and mechanistic reasoning",
   "Fill gaps where no studies exist and explain how something might work.",
   "Untested by data: plausible mechanisms have often failed when finally trialled."],
];

const APPRAISAL: [heading: string, items: [term: string, text: string][]][] = [
  ["1. Are the results valid?", [
    ["Randomisation:", "was allocation truly random (computer-generated, not by date of birth or day of the week)?"],
    ["Allocation concealment:", "could whoever enrolled patients predict the next assignment? If so, selection bias is possible."],
    ["Similar groups at baseline:", "check the first table for imbalances in key prognostic factors."],
    ["Blinding:", "were patients, clinicians and outcome assessors unaware of the group, especially for subjective outcomes?"],
    ["Loss to follow-up:", "how many dropped out, and was it similar in both groups? Over about 20% is a warning sign."],
    ["Intention-to-treat:", "were people analysed in the group they were randomised to, even if they stopped or switched treatment?"],
  ]],
  ["2. What are the results?", [
    ["Effect size:", "how big is the difference? Look for absolute measures (ARR, NNT) as well as relative ones."],
    ["Precision:", "how wide is the 95% CI? Does it cross the line of no effect (1 for ratios, 0 for differences)?"],
    ["Clinically important?", "A statistically significant result can still be too small to matter to patients."],
  ]],
  ["3. Will the results help my patients?", [
    ["Generalisability:", "are your patients like those in the study (age, severity, setting, other conditions)?"],
    ["Outcomes that matter:", "were patient-important outcomes measured, or only surrogates such as a lab value?"],
    ["Benefits vs harms and costs:", "does the benefit outweigh side effects, burden and cost, and fit the patient's values?"],
  ]],
];

function EvidenceTab() {
  return (
    <section className="panel">
      <h2>The hierarchy of evidence</h2>
      <p className="hint">
        For questions about whether a treatment works, designs higher in the list are less prone to bias. The best design
        depends on the question: prognosis is often answered by cohorts, and a well-run cohort beats a flawed RCT.
      </p>
      <ol className="rt-pyramid">
        {LEVELS.map(([name, can, cant]) => (
          <li key={name}>
            <strong>{name}</strong>
            <span className="rt-can">Can show: {can}</span>
            <span className="rt-cant">Can't show: {cant}</span>
          </li>
        ))}
      </ol>

      <h2>Critical appraisal in three questions</h2>
      {APPRAISAL.map(([heading, items]) => (
        <div className="rt-section" key={heading}>
          <h3>{heading}</h3>
          <ul className="rt-checklist">
            {items.map(([term, text]) => (
              <li key={term}>
                <strong>{term}</strong> {text}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="hint">
        For structured checklists by study design, look up CASP, the Cochrane risk-of-bias tool (RoB 2), or reporting guidelines
        such as CONSORT and PRISMA.
      </p>
    </section>
  );
}

/* ---------------- Cite a DOI ---------------- */

function CiteTab() {
  const [doi, setDoi] = useState("");
  type State = { kind: "idle" | "loading" } | { kind: "error"; message: string } | { kind: "done"; data: CitationData };
  const [state, setState] = useState<State>({ kind: "idle" });
  const loading = state.kind === "loading";

  async function lookUp() {
    setState({ kind: "loading" });
    try {
      setState({ kind: "done", data: await fetchCitationData(doi) });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }

  return (
    <section className="panel">
      <h2>Format a reference from its DOI</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (doi.trim() && !loading) void lookUp();
        }}
      >
        <label className="field">
          <span>DOI or doi.org link</span>
          <input value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="e.g. 10.1136/bmj.n71" autoComplete="off" spellCheck={false} />
        </label>
        <div className="actions">
          <button type="submit" disabled={!doi.trim() || loading}>
            {loading ? "Looking up…" : "Look up"}
          </button>
        </div>
      </form>
      <div role="status" aria-live="polite" style={{ marginTop: 14 }}>
        {loading && <p className="hint">Asking Crossref…</p>}
        {state.kind === "error" && <p className="error-inline">{state.message}</p>}
        {state.kind === "done" && (
          <>
            {([["AMA (11th edition)", "AMA", formatAMA(state.data)], ["APA (7th edition)", "APA", formatAPA(state.data)]] as const).map(([title, style, text]) => (
              <div className="rt-section" key={style}>
                <h3>{title}</h3>
                <code className="rt-code">{text}</code>
                <CopyButton text={text} label={`Copy ${style}`} />
              </div>
            ))}
            <p className="hint">
              Check before you submit: italics are lost in plain text (journal name and volume in APA, journal in AMA), AMA
              expects the NLM abbreviation of the journal name, and Crossref data sometimes has odd capitalisation.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

const PANELS: Record<Tab, ComponentType> = { pico: PicoTab, calc: CalcTab, evidence: EvidenceTab, cite: CiteTab };

/** Research toolkit: PICO search builder, 2×2 statistics, evidence guide and DOI citations. */
export function Research() {
  const [tab, setTab] = useState<Tab>("pico");
  const Panel = PANELS[tab];
  return (
    <main className="shell narrow">
      <Crumbs here="Research toolkit" />
      <h1>Research toolkit</h1>
      <p className="lede">Turn a clinical question into a search, make sense of the numbers, appraise what you find and cite it.</p>
      <p className="hint rt-note">These tools support learning. They don't replace a librarian or a statistician.</p>
      <Tabs id="rt" label="Research tools" className="tabs rt-tabs" tabs={TABS} value={tab} onChange={setTab}>
        <Panel />
      </Tabs>
    </main>
  );
}
