import { describe, expect, it } from "vitest";
import { checkNumber } from "../site/src/med/labmath";
import {
  DRILL_KINDS,
  convertMass,
  doseVolume,
  dripRateGttPerMin,
  infusionHours,
  ivRateMlPerHr,
  lbToKg,
  makeDrill,
  mulberry32,
  roundTo,
  weightBasedInfusionMlPerHr,
  weightDose,
} from "../site/src/med/nursing/dosage";
import { NORMALS } from "../site/src/med/nursing/normals";

describe("dosage formulas", () => {
  it("D/H × Q", () => {
    expect(doseVolume(500, 250, 1)).toBe(2); // 500 mg ordered, 250 mg tablets → 2 tablets
    expect(doseVolume(375, 125, 5)).toBe(15); // 375 mg ordered, 125 mg/5 mL → 15 mL
    expect(doseVolume(12.5, 25, 1)).toBe(0.5);
  });

  it("weight-based dose and lb → kg", () => {
    expect(weightDose(15, 20)).toBe(300);
    expect(lbToKg(154)).toBeCloseTo(69.85, 2);
    expect(lbToKg(2.2046)).toBeCloseTo(1, 10);
  });

  it("converts mcg / mg / g", () => {
    expect(convertMass(1, "g", "mg")).toBe(1000);
    expect(convertMass(500, "mcg", "mg")).toBe(0.5);
    expect(convertMass(0.25, "mg", "mcg")).toBe(250);
    expect(convertMass(2500, "mg", "g")).toBe(2.5);
    expect(convertMass(7, "mg", "mg")).toBe(7);
  });

  it("IV rate, drip rate, infusion time", () => {
    expect(ivRateMlPerHr(1000, 8)).toBe(125);
    expect(Math.round(dripRateGttPerMin(1000, 480, 15))).toBe(31); // 31.25
    expect(dripRateGttPerMin(100, 30, 20)).toBeCloseTo(66.67, 2);
    expect(infusionHours(1000, 125)).toBe(8);
  });

  it("weight-based infusion in mL/h", () => {
    expect(weightBasedInfusionMlPerHr(5, 70, 1600)).toBeCloseTo(13.125, 10);
  });

  it("roundTo", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(31.25, 0)).toBe(31);
    expect(roundTo(66.666, 1)).toBe(66.7);
  });
});

describe("drill generator", () => {
  it("is deterministic for a fixed seed", () => {
    const a = DRILL_KINDS.map((k) => makeDrill(k.kind, mulberry32(42)));
    const b = DRILL_KINDS.map((k) => makeDrill(k.kind, mulberry32(42)));
    expect(a).toEqual(b);
    const r1 = mulberry32(7);
    const r2 = mulberry32(7);
    for (let i = 0; i < 20; i++) expect(makeDrill("drip-rate", r1)).toEqual(makeDrill("drip-rate", r2));
  });

  it("every drill is well formed, self-consistent and uses fictional names", () => {
    const rng = mulberry32(2026);
    for (const { kind } of DRILL_KINDS) {
      for (let i = 0; i < 50; i++) {
        const d = makeDrill(kind, rng);
        expect(d.kind).toBe(kind);
        expect(Number.isFinite(d.answer) && d.answer > 0, `${d.prompt} → ${d.answer}`).toBe(true);
        expect(checkNumber(String(d.answer), d.answer, d.tolerance).ok).toBe(true);
        expect(d.prompt).toMatch(/^Practice problem \(hypothetical order\):/);
        const names = d.prompt.match(/Drug \w+/g) ?? [];
        expect(names.length).toBeGreaterThan(0);
        for (const n of names) expect(n).toMatch(/^Drug [A-Z]$/);
        expect(d.unit).not.toBe("");
        expect(d.working).not.toBe("");
        if (kind === "drip-rate") {
          expect(Number.isInteger(d.answer)).toBe(true);
          expect(d.prompt).toMatch(/nearest whole drop/i);
        }
        if (kind === "liquid" || kind === "iv-rate" || kind === "infusion-time") expect(roundTo(d.answer, 1)).toBe(d.answer);
      }
    }
  });
});

describe("normal values", () => {
  it("has unique names within each group and non-empty ranges", () => {
    expect(NORMALS.length).toBeGreaterThan(0);
    for (const g of NORMALS) {
      const names = g.items.map((i) => i.name);
      expect(new Set(names).size, g.group).toBe(names.length);
      for (const i of g.items) expect(i.range.trim(), `${g.group}: ${i.name}`).not.toBe("");
    }
  });
});
