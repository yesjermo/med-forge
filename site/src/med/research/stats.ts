/**
 * 2×2 table statistics for evidence-based practice: diagnostic accuracy and treatment effect.
 * Pure functions. Counts must be finite, non-negative integers (a RangeError is thrown otherwise);
 * a measure whose denominator is zero comes back as null instead of Infinity/NaN.
 */

/** Lower and upper bound of a 95% confidence interval. */
export interface Interval {
  lower: number;
  upper: number;
}

const Z95 = 1.959963984540054;

/** Throw a RangeError unless every value is a whole number ≥ 0 (checked in key order). */
function checkCounts(counts: Record<string, number>): void {
  for (const [name, v] of Object.entries(counts)) {
    if (!Number.isFinite(v) || v < 0 || !Number.isInteger(v)) throw new RangeError(`${name} must be a whole number of 0 or more (got ${v})`);
  }
}

/** a / b, or null when b is 0. */
const ratio = (a: number, b: number): number | null => (b === 0 ? null : a / b);

/**
 * 95% Wilson score interval for a proportion `successes / n`. Always within [0, 1].
 * Returns null when n is 0.
 */
export function wilson(successes: number, n: number, z = Z95): Interval | null {
  checkCounts({ successes, n });
  if (successes > n) throw new RangeError("successes cannot exceed n");
  if (n === 0) return null;
  const p = successes / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return { lower: Math.max(0, centre - half), upper: Math.min(1, centre + half) };
}

export interface DiagnosticInput {
  /** Disease present, test positive. */
  tp: number;
  /** Disease absent, test positive. */
  fp: number;
  /** Disease present, test negative. */
  fn: number;
  /** Disease absent, test negative. */
  tn: number;
}

export interface DiagnosticResult {
  sensitivity: number | null;
  specificity: number | null;
  ppv: number | null;
  npv: number | null;
  /** Sensitivity / (1 − specificity). */
  lrPositive: number | null;
  /** (1 − sensitivity) / specificity. */
  lrNegative: number | null;
  accuracy: number | null;
  /** Prevalence in this sample: (TP + FN) / total. */
  prevalence: number | null;
  sensitivityCI: Interval | null;
  specificityCI: Interval | null;
}

/**
 * Diagnostic test accuracy from a 2×2 table (rows: test +/−, columns: disease present/absent).
 * PPV and NPV depend on the prevalence in this sample; LRs do not.
 * @throws RangeError if any count is negative, fractional or not finite.
 */
export function diagnostic({ tp, fp, fn, tn }: DiagnosticInput): DiagnosticResult {
  checkCounts({ TP: tp, FP: fp, FN: fn, TN: tn });
  const total = tp + fp + fn + tn;
  const sensitivity = ratio(tp, tp + fn);
  const specificity = ratio(tn, tn + fp);
  const both = sensitivity !== null && specificity !== null;
  return {
    sensitivity,
    specificity,
    ppv: ratio(tp, tp + fp),
    npv: ratio(tn, tn + fn),
    lrPositive: both ? ratio(sensitivity, 1 - specificity) : null,
    lrNegative: both ? ratio(1 - sensitivity, specificity) : null,
    accuracy: ratio(tp + tn, total),
    prevalence: ratio(tp + fn, total),
    sensitivityCI: wilson(tp, tp + fn),
    specificityCI: wilson(tn, tn + fp),
  };
}

export interface TreatmentInput {
  eventsTreated: number;
  totalTreated: number;
  eventsControl: number;
  totalControl: number;
}

export interface TreatmentResult {
  /** Experimental event rate. */
  eer: number;
  /** Control event rate. */
  cer: number;
  /** Relative risk EER / CER. */
  rr: number | null;
  rrCI: Interval | null;
  /** Absolute risk reduction CER − EER (negative means the treatment group had more events). */
  arr: number;
  /** Relative risk reduction (CER − EER) / CER. */
  rrr: number | null;
  /**
   * Number needed to treat (1 / ARR) when ARR > 0, or number needed to harm (1 / −ARR) when ARR < 0.
   * Null when ARR is 0 (no difference).
   */
  nnt: { label: "NNT" | "NNH"; value: number } | null;
  oddsRatio: number | null;
  /** Woolf (logit) interval; null when any cell is 0. */
  orCI: Interval | null;
}

/**
 * Treatment effect for a binary outcome (events are the bad outcome, e.g. death or relapse).
 * RR CI uses the log method; OR CI uses Woolf's method.
 * @throws RangeError for invalid counts, a group total of 0, or events above the group total.
 */
export function treatment({ eventsTreated, totalTreated, eventsControl, totalControl }: TreatmentInput): TreatmentResult {
  checkCounts({ "Events (treated)": eventsTreated, "Total (treated)": totalTreated, "Events (control)": eventsControl, "Total (control)": totalControl });
  if (totalTreated === 0 || totalControl === 0) throw new RangeError("Each group needs at least one participant");
  if (eventsTreated > totalTreated || eventsControl > totalControl) throw new RangeError("Events cannot exceed the group total");
  const a = eventsTreated;
  const b = totalTreated - eventsTreated;
  const c = eventsControl;
  const d = totalControl - eventsControl;
  const eer = a / totalTreated;
  const cer = c / totalControl;
  const arr = cer - eer;
  const rr = ratio(eer, cer);
  const ci = (est: number, se: number): Interval => ({ lower: Math.exp(Math.log(est) - Z95 * se), upper: Math.exp(Math.log(est) + Z95 * se) });
  const oddsRatio = b === 0 || c === 0 ? null : (a * d) / (b * c);
  // Round tiny floating-point noise so 0.2 − 0.1 gives an NNT of exactly 10.
  const arrClean = Math.round(arr * 1e12) / 1e12;
  return {
    eer,
    cer,
    rr,
    rrCI: rr !== null && a > 0 && c > 0 ? ci(rr, Math.sqrt(1 / a - 1 / totalTreated + 1 / c - 1 / totalControl)) : null,
    arr: arrClean,
    rrr: ratio(arr, cer),
    nnt: arrClean === 0 ? null : { label: arrClean > 0 ? "NNT" : "NNH", value: 1 / Math.abs(arrClean) },
    oddsRatio,
    orCI: oddsRatio !== null && a > 0 && b > 0 && c > 0 && d > 0 ? ci(oddsRatio, Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d)) : null,
  };
}
