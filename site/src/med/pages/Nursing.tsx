import { useState, type ReactNode } from "react";
import { checkNumber } from "../labmath";
import {
  DRILL_KINDS, convertMass, doseVolume, dripRateGttPerMin, infusionHours, ivRateMlPerHr, lbToKg, makeDrill, roundTo,
  weightBasedInfusionMlPerHr, weightDose, type Drill, type DrillKind, type MassUnit,
} from "../nursing/dosage";
import "../nursing/nursing.css";
import { Crumbs } from "../ui";

/** Parse free text like the lab calculators do (commas, 1e3, 2.5 x 10^3). */
const num = (v: string) => checkNumber(v, 0, Infinity).value;
/** The parsed values when all are present and > 0, else null. */
const positives = (xs: string[]) => {
  const ns = xs.map(num);
  return ns.every((n) => (n ?? 0) > 0) ? (ns as number[]) : null;
};

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

type OutProps = { value: number | null; unit: string; places?: number; extra?: string };

function Out({ value, unit, places = 2, extra }: OutProps) {
  if (value === null || !Number.isFinite(value)) return <p className="calc-out hint">Fill in the values above (all greater than zero).</p>;
  return (
    <p className="calc-out" role="status">
      = <strong>{roundTo(value, places).toLocaleString("en-GB", { maximumFractionDigits: places })}</strong> {unit}
      {extra && <span className="hint"> {extra}</span>}
    </p>
  );
}

type Mode = DrillKind | "mixed";

const newDrill = (mode: Mode): Drill =>
  makeDrill(mode === "mixed" ? DRILL_KINDS[Math.floor(Math.random() * DRILL_KINDS.length)]!.kind : mode, Math.random);

function PracticeDrills() {
  const [mode, setMode] = useState<Mode>("mixed");
  const [drill, setDrill] = useState<Drill>(() => newDrill("mixed"));
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<{ ok: boolean; parsed: boolean } | null>(null);
  const [score, setScore] = useState({ right: 0, tried: 0 });

  const next = (m: Mode = mode) => {
    setDrill(newDrill(m));
    setTyped("");
    setResult(null);
  };

  return (
    <section className="panel nursing-practice" aria-labelledby="practice-h">
      <div className="result-head">
        <h2 id="practice-h">Practice problems</h2>
        <span className="hint" role="status" aria-live="polite">
          Score this session: {score.right}/{score.tried}
        </span>
      </div>
      <div className="actions nursing-controls">
        <label className="field">
          <span>Problem type</span>
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as Mode;
              setMode(m);
              next(m);
            }}
          >
            <option value="mixed">Mixed</option>
            {DRILL_KINDS.map((k) => <option key={k.kind} value={k.kind}>{k.label}</option>)}
          </select>
        </label>
        <button type="button" className="secondary small" onClick={() => next()}>
          New problem
        </button>
      </div>
      <p className="nursing-prompt">{drill.prompt}</p>
      <form
        className="drill-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (result) return;
          const r = checkNumber(typed, drill.answer, drill.tolerance);
          setResult({ ok: r.ok, parsed: r.value !== null });
          if (r.value !== null) setScore((s) => ({ right: s.right + (r.ok ? 1 : 0), tried: s.tried + 1 }));
        }}
      >
        <label className="sr-only" htmlFor="nursing-answer">
          Your answer in {drill.unit}
        </label>
        <input
          id="nursing-answer"
          inputMode="decimal"
          value={typed}
          onChange={(e) => {
            setTyped(e.target.value);
            if (result && !result.parsed) setResult(null);
          }}
          placeholder="Answer"
          disabled={!!result?.parsed}
        />
        <span className="hint">{drill.unit}</span>
        <button type="submit" className="secondary" disabled={!typed.trim() || !!result?.parsed}>
          Check
        </button>
      </form>
      <div role="status" aria-live="polite">
        {result && !result.parsed && <p className="error-inline">Type a number, e.g. 1.5</p>}
        {result?.parsed && (
          <div className={`nursing-feedback ${result.ok ? "is-ok" : "is-wrong"}`}>
            <p className={result.ok ? "lint-ok" : "error-inline"}>
              {result.ok ? "Correct." : `Not quite. The answer is ${drill.answer} ${drill.unit}.`}
            </p>
            <p className="nursing-working">{drill.working}</p>
            <button type="button" className="secondary small" onClick={() => next()}>
              Next problem
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * A calculator panel: the first two fields share a row, the rest follow. `calc` gets the parsed values
 * (all > 0) and returns what to show; `children` adds extra content (e.g. a second calculator) at the end.
 */
interface CalcSpec {
  title: string;
  hint: string;
  fields: [label: string, initial?: string][];
  calc: (xs: number[]) => OutProps;
}

function Calc({ title, hint, fields, calc, children }: CalcSpec & { children?: ReactNode }) {
  const [vals, setVals] = useState(() => fields.map(([, initial = ""]) => initial));
  const xs = positives(vals);
  const field = (i: number) => (
    <Field key={i} label={fields[i]![0]} value={vals[i]!} onChange={(v) => setVals(vals.map((x, j) => (j === i ? v : x)))} />
  );
  const out = xs ? calc(xs) : null;
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p className="hint">{hint}</p>
      <div className="row">{[0, 1].map(field)}</div>
      {fields.slice(2).map((_, i) => field(i + 2))}
      <Out {...(out ?? { value: null, unit: "" })} />
      {children}
    </section>
  );
}

const CALCS: CalcSpec[] = [
  {
    title: "Tablets or liquid: D/H × Q",
    hint: "Desired ÷ have (on hand) × quantity. Desired and on-hand must be in the same unit.",
    fields: [["Desired dose (D)"], ["On hand (H)"], ["Quantity per H (Q: tablets or mL)", "1"]],
    calc: ([d, h, q]) => ({ value: doseVolume(d!, h!, q!), unit: "tablets or mL" }),
  },
  {
    title: "Weight-based dose",
    hint: "mg/kg × weight (kg). Convert pounds first: kg = lb ÷ 2.2046.",
    fields: [["Dose (mg/kg)"], ["Weight (kg)"]],
    calc: ([perKg, kg]) => ({ value: weightDose(perKg!, kg!), unit: "mg" }),
  },
  {
    title: "IV pump rate (mL/h)",
    hint: "Volume (mL) ÷ time (h).",
    fields: [["Volume (mL)"], ["Time (h)"]],
    calc: ([ml, h]) => ({ value: ivRateMlPerHr(ml!, h!), unit: "mL/h", places: 1 }),
  },
  {
    title: "Gravity drip rate (gtt/min)",
    hint: "Volume (mL) × drop factor (gtt/mL) ÷ time (min). Round to the nearest whole drop.",
    fields: [["Volume (mL)"], ["Time (min)"], ["Drop factor (gtt/mL)", "20"]],
    calc: ([ml, min, factor]) => {
      const drip = dripRateGttPerMin(ml!, min!, factor!);
      return { value: Math.round(drip), unit: "gtt/min", places: 0, extra: `(exact ${roundTo(drip, 2)})` };
    },
  },
  {
    title: "Infusion time",
    hint: "Volume (mL) ÷ rate (mL/h) = hours.",
    fields: [["Volume (mL)"], ["Rate (mL/h)"]],
    calc: ([ml, rate]) => {
      const hours = infusionHours(ml!, rate!);
      const mins = Math.round(hours * 60);
      return { value: hours, unit: "h", extra: `(${Math.floor(mins / 60)} h ${mins % 60} min)` };
    },
  },
  {
    title: "Weight-based infusion (mcg/kg/min → mL/h)",
    hint: "Dose (mcg/kg/min) × weight (kg) × 60 ÷ concentration (mcg/mL).",
    fields: [["Dose (mcg/kg/min)"], ["Weight (kg)"], ["Concentration (mcg/mL)"]],
    calc: ([dose, kg, conc]) => ({ value: weightBasedInfusionMlPerHr(dose!, kg!, conc!), unit: "mL/h" }),
  },
];

/** Pounds → kg, shown under the weight-based dose calculator. */
function LbToKg() {
  const [lb, setLb] = useState("");
  const xs = positives([lb]);
  return (
    <>
      <Field label="Weight in pounds (lb), to convert" value={lb} onChange={setLb} />
      <Out value={xs && lbToKg(xs[0]!)} unit="kg" />
    </>
  );
}

const UNITS: MassUnit[] = ["mcg", "mg", "g"];

function MassConversion() {
  const [cm, setCm] = useState<{ v: string; from: MassUnit; to: MassUnit }>({ v: "", from: "mg", to: "mcg" });
  const xs = positives([cm.v]);
  return (
    <section className="panel">
      <h2>Mass conversion</h2>
      <p className="hint">1 g = 1,000 mg; 1 mg = 1,000 mcg.</p>
      <Field label="Value" value={cm.v} onChange={(v) => setCm({ ...cm, v })} />
      <div className="row">
        {(["from", "to"] as const).map((k) => (
          <label className="field" key={k}>
            <span>{k === "from" ? "From" : "To"}</span>
            <select value={cm[k]} onChange={(e) => setCm({ ...cm, [k]: e.target.value as MassUnit })}>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
        ))}
      </div>
      <Out value={xs && convertMass(xs[0]!, cm.from, cm.to)} unit={cm.to} places={6} />
    </section>
  );
}

/** Dosage-calculation calculators and practice problems for nursing students. */
export function Nursing() {
  const [dhq, weight, ...rest] = CALCS;
  return (
    <main className="shell">
      <Crumbs here="Dosage calculations" />
      <h1>Dosage calculations</h1>
      <div className="notice nursing-notice" role="note">
        <p>
          <strong>Practice arithmetic with hypothetical orders only. This is not clinical guidance.</strong> In practice, always follow the
          prescriber&apos;s order and your local policy, and use independent double-checks.
        </p>
      </div>

      <PracticeDrills />

      <h2 className="nursing-section">Calculators</h2>
      <p className="hint">Write the formula and units first, then use these to check your working.</p>
      <div className="calc-grid">
        <Calc {...dhq!} />
        <Calc {...weight!}>
          <LbToKg />
        </Calc>
        <MassConversion />
        {rest.map((c) => <Calc key={c.title} {...c} />)}
      </div>
      <p className="hint nursing-foot">Results are rounded for display. For learning only.</p>
    </main>
  );
}
