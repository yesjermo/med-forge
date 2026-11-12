import { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  beerLambertConcentration,
  cfuPerMl,
  checkNumber,
  dilution,
  hemocytometer,
  hendersonHasselbalch,
  massForSolution,
} from "../labmath";
import type { ProgressStore } from "../progress";
import type { Course, Lab, Skill } from "../types";
import { Crumbs, MedText } from "../ui";

function Drill({ drill }: { drill: Lab["drills"][number] }) {
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  return (
    <li className="drill">
      <p>
        <MedText text={drill.prompt} inline />
      </p>
      <form
        className="drill-form"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkNumber(typed, drill.answer, drill.tolerance).ok);
        }}
      >
        <input inputMode="decimal" value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Your answer" placeholder="Answer" />
        <span className="hint">{drill.unit}</span>
        <button type="submit" className="secondary" disabled={!typed.trim()}>
          Check
        </button>
      </form>
      {result !== null && (
        <p className={result ? "lint-ok" : "error-inline"} role="status">
          {result ? "Correct. " : `Not quite: ${drill.answer} ${drill.unit}. `}
          <MedText text={drill.working} inline />
        </p>
      )}
    </li>
  );
}

/** A lab protocol: safety first, a checklist of steps you can tick, then calculation drills. */
export function LabPage({ course, lab, progress, refresh }: { course: Course; lab: Lab; progress: ProgressStore; refresh: () => void }) {
  const done = new Set(progress.labSteps(lab.id));
  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Lab practice" />
      <article className="panel">
        <span className="tag">{lab.topic}</span>
        <h1>{lab.title}</h1>
        <p className="lede">
          <MedText text={lab.objective} inline />
        </p>
        <div className="safety">
          <h2>Safety first</h2>
          <ul>
            {lab.safety.map((s, i) => (
              <li key={i}>
                <MedText text={s} inline />
              </li>
            ))}
          </ul>
        </div>
        <h2>Materials</h2>
        <ul>
          {lab.materials.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <div className="result-head">
          <h2>Procedure</h2>
          <span className="hint">
            {done.size}/{lab.steps.length} done
          </span>
        </div>
        <ol className="steps-check">
          {lab.steps.map((s, i) => (
            <li key={i} className={done.has(i) ? "done" : ""}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={done.has(i)}
                  onChange={() => {
                    progress.toggleLabStep(lab.id, i);
                    refresh();
                  }}
                />
                <span>
                  <MedText text={s.text} inline />
                  {s.why && (
                    <small className="why">
                      Why: <MedText text={s.why} inline />
                    </small>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ol>
        <h2>Calculations</h2>
        <ol className="drills">
          {lab.drills.map((d) => (
            <Drill key={d.id} drill={d} />
          ))}
        </ol>
        <h2>What to expect</h2>
        <MedText text={lab.resultsGuide} />
      </article>
    </main>
  );
}

/** OSCE-style checklist. Practise with a partner reading the list; critical items must all be done. */
export function SkillPage({ course, skill, progress, refresh }: { course: Course; skill: Skill; progress: ProgressStore; refresh: () => void }) {
  const checked = new Set(progress.skillChecks(skill.id));
  const critical = skill.items.map((it, i) => ({ it, i })).filter((x) => x.it.critical);
  const missedCritical = critical.filter((x) => !checked.has(x.i)).length;
  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Skill checklist" />
      <article className="panel">
        <h1>{skill.title}</h1>
        <p className="lede">{skill.purpose}</p>
        <p className="hint">
          Practise with a partner: they read the checklist and tick each step you perform. Items marked{" "}
          <span className="tag tag-error">critical</span> must all be done to pass.
        </p>
        <ol className="steps-check">
          {skill.items.map((it, i) => (
            <li key={i} className={checked.has(i) ? "done" : ""}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={checked.has(i)}
                  onChange={() => {
                    progress.toggleSkill(skill.id, i);
                    refresh();
                  }}
                />
                <span>
                  {it.text} {it.critical && <span className="tag tag-error">critical</span>}
                </span>
              </label>
            </li>
          ))}
        </ol>
        <p className={missedCritical ? "error-inline" : "lint-ok"} role="status">
          {checked.size}/{skill.items.length} steps ·{" "}
          {missedCritical ? `${missedCritical} critical step${missedCritical === 1 ? "" : "s"} not yet done` : "all critical steps done"}
        </p>
        <div className="actions">
          <button
            className="secondary"
            onClick={() => {
              for (const i of checked) progress.toggleSkill(skill.id, i);
              refresh();
            }}
            disabled={checked.size === 0}
          >
            Reset checklist
          </button>
        </div>
      </article>
    </main>
  );
}

function num(v: string): number | null {
  const r = checkNumber(v, 0, Infinity);
  return r.value;
}

function Out({ value, unit, digits = 4 }: { value: number | null; unit: string; digits?: number }) {
  if (value === null || !Number.isFinite(value)) return <p className="calc-out hint">Fill in the values above.</p>;
  const shown = Math.abs(value) >= 1e5 || (Math.abs(value) < 1e-3 && value !== 0) ? value.toExponential(3) : Number(value.toPrecision(digits)).toString();
  return (
    <p className="calc-out" role="status">
      = <strong>{shown}</strong> {unit}
    </p>
  );
}

/** Lab calculators. Inputs are free text so you can type 1e-6 or 2.5 x 10^4. */
export function LabTools() {
  const [d, setD] = useState({ c1: "", v1: "", c2: "", v2: "" });
  const [m, setM] = useState({ molarity: "", volume: "", mm: "" });
  const [p, setP] = useState({ colonies: "", plated: "", dil: "" });
  const [h, setH] = useState({ cells: "", squares: "4", factor: "1" });
  const [b, setB] = useState({ a: "", eps: "", l: "1" });
  const [hh, setHh] = useState({ pka: "", base: "", acid: "" });

  const blanks = (Object.values(d) as string[]).filter((x) => x.trim() === "").length;
  const dil =
    blanks === 1
      ? dilution({
          c1: d.c1.trim() ? num(d.c1) : null,
          v1: d.v1.trim() ? num(d.v1) : null,
          c2: d.c2.trim() ? num(d.c2) : null,
          v2: d.v2.trim() ? num(d.v2) : null,
        })
      : null;
  const missing = (["c1", "v1", "c2", "v2"] as const).find((k) => d[k].trim() === "");
  const f = (field: string, value: string, set: (v: string) => void) => (
    <label className="field">
      <span>{field}</span>
      <input inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} />
    </label>
  );
  const all = (...xs: string[]) => xs.every((x) => num(x) !== null);

  return (
    <main className="shell">
      <Crumbs here="Lab calculators" />
      <h1>Lab calculators</h1>
      <p className="lede">Check your working, not replace it: write the formula and units in your lab book first.</p>
      <div className="calc-grid">
        <section className="panel">
          <h2>Dilution: C₁V₁ = C₂V₂</h2>
          <p className="hint">Leave exactly one box empty; use matching units on both sides.</p>
          <div className="row">
            {f("C₁ (stock)", d.c1, (v) => setD({ ...d, c1: v }))}
            {f("V₁ (stock volume)", d.v1, (v) => setD({ ...d, v1: v }))}
          </div>
          <div className="row">
            {f("C₂ (final)", d.c2, (v) => setD({ ...d, c2: v }))}
            {f("V₂ (final volume)", d.v2, (v) => setD({ ...d, v2: v }))}
          </div>
          <Out value={dil} unit={missing ? `(${missing.toUpperCase()})` : ""} />
        </section>

        <section className="panel">
          <h2>Mass of solute to weigh</h2>
          <div className="row">
            {f("Molarity (mol/L)", m.molarity, (v) => setM({ ...m, molarity: v }))}
            {f("Volume (L)", m.volume, (v) => setM({ ...m, volume: v }))}
          </div>
          {f("Molar mass (g/mol)", m.mm, (v) => setM({ ...m, mm: v }))}
          <Out value={all(m.molarity, m.volume, m.mm) ? massForSolution(num(m.molarity)!, num(m.volume)!, num(m.mm)!) : null} unit="g" />
        </section>

        <section className="panel">
          <h2>Viable plate count</h2>
          <p className="hint">CFU/mL = colonies ÷ (mL plated × dilution). Count plates with 30–300 colonies.</p>
          <div className="row">
            {f("Colonies", p.colonies, (v) => setP({ ...p, colonies: v }))}
            {f("Volume plated (mL)", p.plated, (v) => setP({ ...p, plated: v }))}
          </div>
          {f("Dilution (e.g. 1e-6)", p.dil, (v) => setP({ ...p, dil: v }))}
          <Out value={all(p.colonies, p.plated, p.dil) ? cfuPerMl(num(p.colonies)!, num(p.plated)!, num(p.dil)!) : null} unit="CFU/mL" />
        </section>

        <section className="panel">
          <h2>Hemocytometer</h2>
          <p className="hint">cells/mL = (cells ÷ large squares) × dilution factor × 10⁴.</p>
          <div className="row">
            {f("Cells counted", h.cells, (v) => setH({ ...h, cells: v }))}
            {f("Large squares", h.squares, (v) => setH({ ...h, squares: v }))}
          </div>
          {f("Dilution factor (e.g. 2 for 1:1 trypan blue)", h.factor, (v) => setH({ ...h, factor: v }))}
          <Out value={all(h.cells, h.squares, h.factor) && num(h.squares)! > 0 ? hemocytometer(num(h.cells)!, num(h.squares)!, num(h.factor)!) : null} unit="cells/mL" />
        </section>

        <section className="panel">
          <h2>Beer–Lambert: c = A / (εl)</h2>
          <div className="row">
            {f("Absorbance A", b.a, (v) => setB({ ...b, a: v }))}
            {f("ε (L·mol⁻¹·cm⁻¹)", b.eps, (v) => setB({ ...b, eps: v }))}
          </div>
          {f("Path length l (cm)", b.l, (v) => setB({ ...b, l: v }))}
          <Out value={all(b.a, b.eps, b.l) && num(b.eps)! > 0 ? beerLambertConcentration(num(b.a)!, num(b.eps)!, num(b.l)!) : null} unit="mol/L" />
        </section>

        <section className="panel">
          <h2>Henderson–Hasselbalch</h2>
          <p className="hint">pH = pKa + log₁₀([A⁻]/[HA]). For blood: pKa 6.1, base = HCO₃⁻, acid = 0.03 × PaCO₂.</p>
          <div className="row">
            {f("pKa", hh.pka, (v) => setHh({ ...hh, pka: v }))}
            {f("[A⁻] (base)", hh.base, (v) => setHh({ ...hh, base: v }))}
          </div>
          {f("[HA] (acid)", hh.acid, (v) => setHh({ ...hh, acid: v }))}
          <Out
            value={all(hh.pka, hh.base, hh.acid) && num(hh.base)! > 0 && num(hh.acid)! > 0 ? hendersonHasselbalch(num(hh.pka)!, num(hh.base)!, num(hh.acid)!) : null}
            unit=""
            digits={3}
          />
        </section>
      </div>
      <p className="hint">
        <Icon name="check" size={12} /> Results are rounded for display. Keep full precision in your own calculations.
      </p>
    </main>
  );
}
