import { describe, expect, it } from "vitest";
import { COURSES } from "../site/src/med/courses";
import { lint } from "../src/engine/validator";
import { validateCourse as validate } from "../site/src/med/validate";

describe("course packs", () => {
  it("has at least three courses with unique ids", () => {
    expect(COURSES.length).toBeGreaterThanOrEqual(3);
    expect(new Set(COURSES.map((c) => c.id)).size).toBe(COURSES.length);
  });

  for (const c of COURSES) {
    it(`${c.title} is internally consistent`, () => {
      expect(validate(c)).toEqual([]);
    });

    it(`${c.title} text renders without format errors`, () => {
      // Concept bodies use the same markup as hub posts; plain text must lint with zero errors.
      for (const x of c.concepts) expect(lint(x.body).errorCount, x.slug).toBe(0);
    });
  }

  it("ids are unique across all courses (progress is keyed by id)", () => {
    const all = COURSES.flatMap((c) => [...c.questions.map((q) => q.id), ...c.labs.map((l) => l.id), ...c.cases.map((k) => k.id), ...c.skills.map((s) => s.id)]);
    expect(new Set(all).size).toBe(all.length);
  });
});
