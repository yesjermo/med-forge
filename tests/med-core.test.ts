import { describe, expect, it } from "vitest";
import {
  beerLambertConcentration,
  cfuPerMl,
  checkNumber,
  dilution,
  hemocytometer,
  hendersonHasselbalch,
  massForSolution,
  serialDilution,
} from "../site/src/med/labmath";
import { NEW_SM2, createProgress, sm2, statusFor } from "../site/src/med/progress";

const DAY = 86_400_000;

describe("lab maths", () => {
  it("solves C1V1 = C2V2 for the missing value", () => {
    expect(dilution({ c1: 10, v1: null, c2: 1, v2: 100 })).toBe(10);
    expect(dilution({ c1: null, v1: 5, c2: 2, v2: 50 })).toBe(20);
    expect(dilution({ c1: 10, v1: 5, c2: null, v2: 50 })).toBe(1);
    expect(dilution({ c1: 10, v1: 5, c2: 1, v2: null })).toBe(50);
    expect(dilution({ c1: 10, v1: null, c2: null, v2: 50 })).toBeNull();
    expect(dilution({ c1: 0, v1: null, c2: 1, v2: 50 })).toBeNull();
  });

  it("computes solution mass, serial dilutions, plate counts, hemocytometer, Beer–Lambert and pH", () => {
    expect(massForSolution(0.5, 0.25, 58.44)).toBeCloseTo(7.305, 3);
    expect(serialDilution(1e8, 10, 6)).toBeCloseTo(100, 6);
    expect(cfuPerMl(150, 0.1, 1e-6)).toBeCloseTo(1.5e9, 0);
    expect(hemocytometer(200, 4, 2)).toBe(1e6);
    expect(beerLambertConcentration(0.62, 6220)).toBeCloseTo(9.968e-5, 7);
    expect(hendersonHasselbalch(6.1, 24, 1.2)).toBeCloseTo(7.4, 2);
  });

  it("checks typed answers with tolerance, commas and scientific notation", () => {
    expect(checkNumber("7.3", 7.305, 0.05)).toEqual({ ok: true, value: 7.3 });
    expect(checkNumber("1,500,000,000", 1.5e9, 1e7).ok).toBe(true);
    expect(checkNumber("1.5e9", 1.5e9, 1e7).ok).toBe(true);
    expect(checkNumber("1.5 x 10^9", 1.5e9, 1e7).ok).toBe(true);
    expect(checkNumber("8", 7.305, 0.05)).toEqual({ ok: false, value: 8 });
    expect(checkNumber("abc", 1, 0.1)).toEqual({ ok: false, value: null });
    expect(checkNumber("", 0, 0.1)).toEqual({ ok: false, value: null });
  });
});

describe("SM-2 scheduling", () => {
  it("grows intervals 1, 6, then by ease factor on good answers", () => {
    let s = NEW_SM2(0);
    s = sm2(s, 5, 0);
    expect([s.reps, s.interval]).toEqual([1, 1]);
    s = sm2(s, 5, 0);
    expect([s.reps, s.interval]).toEqual([2, 6]);
    s = sm2(s, 5, 0);
    expect(s.reps).toBe(3);
    expect(s.interval).toBe(Math.round(6 * s.ef));
    expect(s.due).toBe(s.interval * DAY);
  });

  it("restarts tomorrow on a failed recall and never drops ease below 1.3", () => {
    let s = sm2(sm2(NEW_SM2(0), 5, 0), 5, 0);
    s = sm2(s, 1, 0);
    expect([s.reps, s.interval, s.due]).toEqual([0, 1, DAY]);
    for (let i = 0; i < 20; i++) s = sm2(s, 0, 0);
    expect(s.ef).toBe(1.3);
  });

  it("maps grades to statuses", () => {
    expect(statusFor(2, 0)).toBe("needs_review");
    expect(statusFor(4, 1)).toBe("needs_review");
    expect(statusFor(5, 2)).toBe("mastered");
  });
});

function memoryStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe("progress store", () => {
  it("grades, persists, counts and lists due questions", () => {
    let t = 0;
    const s = memoryStorage();
    const p = createProgress(s, () => t);
    p.grade("q1", 5, "B");
    p.grade("q2", 1);
    expect(p.counts(["q1", "q2", "q3"])).toEqual({ unattempted: 1, needs_review: 2, mastered: 0 });
    t = DAY;
    expect(p.due(["q1", "q2", "q3"])).toEqual(["q1", "q2"]);
    const again = createProgress(s, () => t);
    expect(again.question("q1")).toMatchObject({ myAnswer: "B", attempts: 1 });
  });

  it("tracks lab steps, skills and best case scores", () => {
    const p = createProgress(memoryStorage(), () => 0);
    expect(p.toggleLabStep("lab", 2)).toEqual([2]);
    expect(p.toggleLabStep("lab", 0)).toEqual([0, 2]);
    expect(p.toggleLabStep("lab", 2)).toEqual([0]);
    expect(p.toggleSkill("bp", 1)).toEqual([1]);
    p.saveCase("c", 6, 10);
    p.saveCase("c", 4, 10);
    expect(p.caseResult("c")).toMatchObject({ score: 6, max: 10 });
    p.saveCase("c", 9, 10);
    expect(p.caseResult("c")).toMatchObject({ score: 9 });
  });

  it("works with blocked storage", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    const p = createProgress(broken, () => 0);
    expect(() => p.grade("q", 4)).not.toThrow();
    expect(p.question("q")?.lastGrade).toBe(4);
  });
});

describe("clinical case scoring", () => {
  it("scores multi-choice stages by good picks minus poor picks, floored at 0", async () => {
    const { scoreStage } = await import("../site/src/med/pages/Case");
    const stage = {
      title: "t", prompt: "p", mode: "multi" as const, debrief: "",
      options: [
        { text: "a", good: true, feedback: "" },
        { text: "b", good: true, feedback: "" },
        { text: "c", good: false, feedback: "" },
      ],
    };
    expect(scoreStage(stage, [0, 1])).toEqual({ score: 2, max: 2 });
    expect(scoreStage(stage, [0, 2])).toEqual({ score: 0, max: 2 });
    expect(scoreStage(stage, [2])).toEqual({ score: 0, max: 2 });
    const single = { ...stage, mode: "single" as const, options: stage.options.slice(1) };
    expect(scoreStage(single, [0])).toEqual({ score: 1, max: 1 });
    expect(scoreStage(single, [1])).toEqual({ score: 0, max: 1 });
  });
});

describe("daily review scale and look-ahead", () => {
  it("labels all six SM-2 grades and finds cards due before a later date", async () => {
    const { GRADES, createProgress } = await import("../site/src/med/progress");
    expect(GRADES.map((g) => g[0])).toEqual([0, 1, 2, 3, 4, 5]);
    expect(GRADES[0]![1]).toBe("Blankout");
    expect(GRADES[5]![1]).toMatch(/^Mastered/);
    let t = Date.UTC(2026, 0, 1);
    const p = createProgress(null, () => t);
    p.grade("a", 5);
    p.grade("b", 1);
    t += 86_400_000;
    expect(p.due(["a", "b"])).toEqual(["a", "b"]);
    p.grade("a", 5);
    p.grade("b", 5);
    expect(p.due(["a", "b"])).toEqual([]);
    expect(p.due(["a", "b"], t + 30 * 86_400_000)).toEqual(["b", "a"]);
  });
});

describe("review ahead", () => {
  it("knows when an item was last graded, so cards reviewed today aren't pulled in again", async () => {
    const { lastReviewedAt, NEW_SM2, sm2 } = await import("../site/src/med/progress");
    const t = Date.UTC(2026, 0, 10, 15);
    expect(lastReviewedAt(NEW_SM2(t))).toBe(-Infinity);
    expect(lastReviewedAt(sm2(NEW_SM2(t), 5, t))).toBe(t);
    expect(lastReviewedAt(sm2(NEW_SM2(t), 1, t))).toBe(t);
    const second = sm2(sm2(NEW_SM2(t), 5, t), 4, t + 86_400_000);
    expect(lastReviewedAt(second)).toBe(t + 86_400_000);
  });
});
