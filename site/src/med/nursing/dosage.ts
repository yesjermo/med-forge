/**
 * Dosage-calculation formulas for nursing practice, plus a seeded drill generator.
 * Practice arithmetic only: every drill uses a hypothetical order and fictional drug names.
 */

export type MassUnit = "mcg" | "mg" | "g";
export type DrillKind = "tablets" | "liquid" | "weight" | "iv-rate" | "drip-rate" | "infusion-time";

export const DRILL_KINDS: { kind: DrillKind; label: string }[] = [
  { kind: "tablets", label: "Tablets (D/H × Q)" },
  { kind: "liquid", label: "Oral liquid (D/H × Q)" },
  { kind: "weight", label: "Weight-based dose" },
  { kind: "iv-rate", label: "IV pump rate (mL/h)" },
  { kind: "drip-rate", label: "Gravity drip rate (gtt/min)" },
  { kind: "infusion-time", label: "Infusion time (h)" },
];

export interface Drill {
  id: string;
  kind: DrillKind;
  prompt: string;
  answer: number;
  tolerance: number;
  unit: string;
  working: string;
}

/** Amount to give: desired ÷ on-hand × quantity ("D/H × Q"). Desired and on-hand must be in the same unit. */
export function doseVolume(desired: number, onHand: number, quantity: number): number {
  return (desired / onHand) * quantity;
}

/** Weight-based dose: mg/kg × weight in kg = mg. */
export function weightDose(mgPerKg: number, weightKg: number): number {
  return mgPerKg * weightKg;
}

/** Pounds to kilograms (1 kg = 2.2046 lb). */
export function lbToKg(lb: number): number {
  return lb / 2.2046;
}

const MCG_PER: Record<MassUnit, number> = { mcg: 1, mg: 1000, g: 1_000_000 };

/** Convert a mass between mcg, mg and g (1 g = 1,000 mg = 1,000,000 mcg). */
export function convertMass(value: number, from: MassUnit, to: MassUnit): number {
  return (value * MCG_PER[from]) / MCG_PER[to];
}

/** Infusion-pump rate: volume (mL) ÷ time (h) = mL/h. */
export function ivRateMlPerHr(volumeMl: number, hours: number): number {
  return volumeMl / hours;
}

/** Gravity drip rate: volume (mL) × drop factor (gtt/mL) ÷ time (min) = gtt/min. */
export function dripRateGttPerMin(volumeMl: number, minutes: number, dropFactor: number): number {
  return (volumeMl * dropFactor) / minutes;
}

/** Infusion time: volume (mL) ÷ rate (mL/h) = hours. */
export function infusionHours(volumeMl: number, rateMlPerHr: number): number {
  return volumeMl / rateMlPerHr;
}

/** Weight-based continuous infusion: dose (mcg/kg/min) × weight (kg) × 60 ÷ concentration (mcg/mL) = mL/h. */
export function weightBasedInfusionMlPerHr(doseMcgPerKgPerMin: number, weightKg: number, concentrationMcgPerMl: number): number {
  return (doseMcgPerKgPerMin * weightKg * 60) / concentrationMcgPerMl;
}

/** Round to a number of decimal places (half away from zero for positive values). */
export function roundTo(value: number, places: number): number {
  const f = 10 ** places;
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** Small, fast seeded PRNG returning floats in [0, 1). Same seed → same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rng: () => number, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)]!;
const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 3 });

type DrillBody = Omit<Drill, "id" | "kind">;

/** Each generator writes the part of the prompt after "Practice problem (hypothetical order): Drug X". */
const GENERATORS: Record<DrillKind, (rng: () => number) => DrillBody> = {
  tablets(rng) {
    const strength = pick(rng, [5, 10, 25, 50, 100, 125, 250, 500]);
    const desired = strength * pick(rng, [0.5, 1, 1.5, 2, 3]);
    const answer = doseVolume(desired, strength, 1);
    return {
      prompt: `${fmt(desired)} mg by mouth. Available: ${fmt(strength)} mg scored tablets. How many tablets?`,
      answer,
      tolerance: 0.01,
      unit: "tablets",
      working: `D/H × Q = ${fmt(desired)} mg ÷ ${fmt(strength)} mg × 1 tablet = ${fmt(answer)} tablets.`,
    };
  },
  liquid(rng) {
    const [onHand, perMl] = pick(rng, [[125, 5], [250, 5], [100, 5], [50, 1], [10, 1], [40, 2]] as const);
    const desired = onHand * pick(rng, [0.4, 0.5, 0.8, 1.2, 1.5, 2]);
    const answer = roundTo(doseVolume(desired, onHand, perMl), 1);
    return {
      prompt: `${fmt(desired)} mg oral liquid. Available: ${fmt(onHand)} mg per ${fmt(perMl)} mL. How many mL? (one decimal place)`,
      answer,
      tolerance: 0.05,
      unit: "mL",
      working: `D/H × Q = ${fmt(desired)} mg ÷ ${fmt(onHand)} mg × ${fmt(perMl)} mL = ${fmt(answer)} mL.`,
    };
  },
  weight(rng) {
    const perKg = pick(rng, [1, 2, 2.5, 5, 10, 15, 20]);
    const kg = pick(rng, [10, 12, 15, 18, 20, 25, 30, 40, 50, 60, 70, 80]);
    const answer = weightDose(perKg, kg);
    return {
      prompt: `${fmt(perKg)} mg/kg. The patient weighs ${kg} kg. What single dose in mg is ordered?`,
      answer,
      tolerance: 0.01,
      unit: "mg",
      working: `Dose = ${fmt(perKg)} mg/kg × ${kg} kg = ${fmt(answer)} mg.`,
    };
  },
  "iv-rate"(rng) {
    const volume = pick(rng, [100, 250, 500, 1000]);
    const hours = pick(rng, [1, 2, 4, 5, 8, 10, 12]);
    const answer = roundTo(ivRateMlPerHr(volume, hours), 1);
    return {
      prompt: `in ${fmt(volume)} mL to infuse over ${hours} h by pump. What rate in mL/h? (one decimal place)`,
      answer,
      tolerance: 0.05,
      unit: "mL/h",
      working: `Rate = volume ÷ time = ${fmt(volume)} mL ÷ ${hours} h = ${fmt(answer)} mL/h.`,
    };
  },
  "drip-rate"(rng) {
    const volume = pick(rng, [100, 250, 500, 1000]);
    const minutes = pick(rng, [30, 60, 120, 240, 480, 600]);
    const factor = pick(rng, [10, 15, 20, 60]);
    const exact = dripRateGttPerMin(volume, minutes, factor);
    const answer = Math.round(exact);
    const time = minutes >= 60 ? `${minutes / 60} h (${minutes} min)` : `${minutes} min`;
    return {
      prompt: `in ${fmt(volume)} mL over ${time} by gravity. The giving set delivers ${factor} gtt/mL. What drip rate in gtt/min? Round to the nearest whole drop.`,
      answer,
      tolerance: 0,
      unit: "gtt/min",
      working: `Drip rate = volume × drop factor ÷ minutes = ${fmt(volume)} × ${factor} ÷ ${minutes} = ${fmt(roundTo(exact, 2))} → ${answer} gtt/min.`,
    };
  },
  "infusion-time"(rng) {
    const volume = pick(rng, [250, 500, 1000]);
    const rate = volume / pick(rng, [2, 4, 5, 8, 10]);
    const answer = roundTo(infusionHours(volume, rate), 1);
    return {
      prompt: `${fmt(volume)} mL is running at ${fmt(rate)} mL/h. How many hours will it take to infuse? (one decimal place)`,
      answer,
      tolerance: 0.05,
      unit: "h",
      working: `Time = volume ÷ rate = ${fmt(volume)} mL ÷ ${fmt(rate)} mL/h = ${fmt(answer)} h.`,
    };
  },
};

/** Generate one practice problem. Pass a seeded RNG (see mulberry32) for repeatable sets. */
export function makeDrill(kind: DrillKind, rng: () => number): Drill {
  const id = `${kind}-${Math.floor(rng() * 1e9).toString(36)}`;
  const name = `Drug ${pick(rng, ["A", "B", "C", "D", "E", "F", "G", "H"])}`;
  const body = GENERATORS[kind](rng);
  return { id, kind, ...body, prompt: `Practice problem (hypothetical order): ${name} ${body.prompt}` };
}
