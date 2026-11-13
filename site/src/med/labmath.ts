/** Lab calculations used by the calculators page and to check drill answers. */

/** C1·V1 = C2·V2: solve for whichever value is null. Returns null for impossible input. */
export function dilution(v: { c1: number | null; v1: number | null; c2: number | null; v2: number | null }): number | null {
  const { c1, v1, c2, v2 } = v;
  const missing = [c1, v1, c2, v2].filter((x) => x === null).length;
  if (missing !== 1) return null;
  if (c1 === null) return v1! > 0 ? (c2! * v2!) / v1! : null;
  if (v1 === null) return c1 > 0 ? (c2! * v2!) / c1 : null;
  if (c2 === null) return v2! > 0 ? (c1 * v1) / v2! : null;
  return c2 > 0 ? (c1 * v1) / c2 : null;
}

/** Grams of solute for a solution: mass = molarity (mol/L) × volume (L) × molar mass (g/mol). */
export function massForSolution(molarity: number, volumeL: number, molarMass: number): number {
  return molarity * volumeL * molarMass;
}

/** Concentration after n serial dilutions of factor f each (e.g. 1:10 → f = 10). */
export function serialDilution(start: number, factor: number, steps: number): number {
  return start / factor ** steps;
}

/** CFU per mL from a plate count: colonies ÷ (volume plated in mL × dilution), dilution like 1e-6. */
export function cfuPerMl(colonies: number, platedMl: number, dilution: number): number {
  return colonies / (platedMl * dilution);
}

/**
 * Hemocytometer: cells/mL = (cells counted ÷ squares counted) × dilution factor × 10⁴
 * (each large square holds 0.1 µL = 10⁻⁴ mL).
 */
export function hemocytometer(cellsCounted: number, squares: number, dilutionFactor: number): number {
  return (cellsCounted / squares) * dilutionFactor * 1e4;
}

/** Beer–Lambert: A = ε·l·c → c = A / (ε·l). */
export function beerLambertConcentration(absorbance: number, epsilon: number, pathCm = 1): number {
  return absorbance / (epsilon * pathCm);
}

/** Henderson–Hasselbalch: pH = pKa + log10([A⁻]/[HA]). */
export function hendersonHasselbalch(pKa: number, base: number, acid: number): number {
  return pKa + Math.log10(base / acid);
}

/**
 * Read a typed number: accepts thousands separators (1,500,000), a decimal comma (4,9), scientific
 * notation (1.5e9, 1.5 × 10^9, 1.5x10^-3), a typographic minus (−3) and a trailing unit or % sign
 * ("4.9 L/min"), which is ignored. Returns NaN when there's no number at the start.
 */
export function parseAnswer(input: string): number {
  let t = input.trim().replace(/[\u2212\u2013]/g, "-").replace(/\s*[x×]\s*10\s*\^?\s*/i, "e");
  const m = /^[-+]?(?:\d[\d,]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?/i.exec(t);
  if (!m) return NaN;
  // Whatever follows the number must look like a unit ("L/min", "%", "mmHg"), not more maths ("3/4").
  if (!/^(\s+\S.*|%.*|[a-zµμ°].*)?$/i.test(t.slice(m[0].length))) return NaN;
  t = m[0];
  // One comma not followed by exactly three digits is a decimal comma (4,9); otherwise commas group thousands.
  if (/^[-+]?\d+,\d+$/.test(t.replace(/e.*$/i, "")) && !/^[-+]?\d{1,3}(,\d{3})+$/.test(t.replace(/e.*$/i, ""))) t = t.replace(",", ".");
  return Number(t.replace(/,/g, ""));
}

/** Check a typed numeric answer within a tolerance (see parseAnswer for what's accepted). */
export function checkNumber(input: string, answer: number, tolerance: number): { ok: boolean; value: number | null } {
  const value = parseAnswer(input);
  if (!Number.isFinite(value)) return { ok: false, value: null };
  return { ok: Math.abs(value - answer) <= tolerance, value };
}
