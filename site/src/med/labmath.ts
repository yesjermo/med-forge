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

/** Check a typed numeric answer within a tolerance. Accepts commas and scientific notation. */
export function checkNumber(input: string, answer: number, tolerance: number): { ok: boolean; value: number | null } {
  const cleaned = input.trim().replace(/,/g, "").replace(/\s*[x×]\s*10\^?/i, "e");
  const value = cleaned === "" ? NaN : Number(cleaned);
  if (!Number.isFinite(value)) return { ok: false, value: null };
  return { ok: Math.abs(value - answer) <= tolerance, value };
}
