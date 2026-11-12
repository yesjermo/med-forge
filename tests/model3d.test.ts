import { describe, expect, it } from "vitest";
import { courseToFiles, parseCourseFiles } from "../site/src/med/coursefiles";
import { COURSES } from "../site/src/med/courses";
import { getModel, hasModel, MODEL_IDS } from "../site/src/med/model3d/models";
import { CAM, normalise, project, rotate, shade, type V3 } from "../site/src/med/model3d/render";
import { validateCourse } from "../site/src/med/validate";

describe("model library", () => {
  it("has a useful set of models", () => {
    expect(MODEL_IDS.length).toBeGreaterThanOrEqual(8);
    expect(hasModel("dna")).toBe(true);
    expect(hasModel("nope")).toBe(false);
    expect(hasModel("toString")).toBe(false);
    expect(getModel("nope")).toBeNull();
  });

  it.each(MODEL_IDS)("%s builds a finite, normalised, well-formed model", (id) => {
    const m = getModel(id)!;
    expect(m.title).toBeTruthy();
    expect(m.caption.length).toBeGreaterThan(40);
    expect(m.legend.length).toBeGreaterThan(0);
    expect(m.atoms.filter((a) => a.r > 0).length).toBeGreaterThan(2);
    for (const a of m.atoms) {
      expect(a.p.every(Number.isFinite) && Number.isFinite(a.r)).toBe(true);
      expect(Math.hypot(...a.p) + a.r).toBeLessThanOrEqual(1 + 1e-9);
      expect(a.c).toMatch(/^#[0-9a-f]{6}$/i);
    }
    for (const b of m.bonds) {
      expect(m.atoms[b.i]).toBeDefined();
      expect(m.atoms[b.j]).toBeDefined();
      expect(b.i).not.toBe(b.j);
      expect(b.w > 0 && Number.isFinite(b.w)).toBe(true);
    }
    for (const l of m.labels) expect(l.p.every(Number.isFinite)).toBe(true);
    for (const [c] of m.legend) expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    // Fills the unit sphere: something touches the boundary.
    expect(Math.max(...m.atoms.map((a) => Math.hypot(...a.p) + a.r))).toBeCloseTo(1, 6);
    // Builds are deterministic and cached.
    expect(getModel(id)).toBe(m);
  });

  it("keeps real-ish geometry for water (O–H 0.96 Å, H–O–H ≈ 104.5–109.5°)", () => {
    const m = getModel("water")!;
    const [o, h1, h2] = m.atoms;
    const d1 = o!.p.map((v, k) => h1!.p[k]! - v) as V3, d2 = o!.p.map((v, k) => h2!.p[k]! - v) as V3;
    const angle = (Math.acos((d1[0] * d2[0] + d1[1] * d2[1] + d1[2] * d2[2]) / (Math.hypot(...d1) * Math.hypot(...d2))) * 180) / Math.PI;
    expect(angle).toBeGreaterThan(104);
    expect(angle).toBeLessThan(110);
    expect(Math.hypot(...d1)).toBeCloseTo(Math.hypot(...d2), 9);
  });
});

describe("projection maths", () => {
  it("rotates without changing length, and by quarter turns as expected", () => {
    const p: V3 = [0.3, -0.5, 0.8];
    const r = rotate(p, 1.1, -0.7);
    expect(Math.hypot(...r)).toBeCloseTo(Math.hypot(...p), 12);
    const q = rotate([1, 0, 0], Math.PI / 2, 0);
    expect(q[0]).toBeCloseTo(0, 12);
    expect(q[2]).toBeCloseTo(-1, 12);
    const t = rotate([0, 1, 0], 0, Math.PI / 2);
    expect(t[1]).toBeCloseTo(0, 12);
    expect(t[2]).toBeCloseTo(1, 12);
  });

  it("projects the origin to the centre and shrinks with depth", () => {
    const c = project([0, 0, 0], 400, 300);
    expect(c.x).toBe(200);
    expect(c.y).toBe(150);
    const near = project([0.5, 0.5, -0.5], 400, 300), far = project([0.5, 0.5, 0.5], 400, 300);
    expect(near.s).toBeGreaterThan(far.s);
    expect(near.y).toBeLessThan(150); // +y is up on screen
    expect(far.x - 200).toBeCloseTo(0.5 * far.s, 9);
  });

  it("fits a unit sphere's silhouette inside the canvas from any angle", () => {
    // The silhouette of a unit sphere seen from distance CAM has half-width f / sqrt(CAM² - 1).
    const w = 375, h = 260, f = project([0, 0, 0], w, h).s * CAM;
    expect(f / Math.sqrt(CAM * CAM - 1)).toBeLessThan(Math.min(w, h) / 2);
    for (let k = 0; k < 200; k++) {
      const t = k * 2.39996, y = 1 - (2 * (k + 0.5)) / 200, r = Math.sqrt(1 - y * y);
      const p = project(rotate([r * Math.cos(t), y, r * Math.sin(t)], k, k * 0.3), w, h);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(w);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(h);
    }
  });

  it("normalises a model into the unit sphere and scales widths with it", () => {
    const m = normalise({
      title: "t", caption: "c", legend: [], tilt: 0, labels: [{ p: [10, 0, 0], text: "x" }],
      atoms: [{ p: [8, 0, 0], r: 2, c: "#000000" }, { p: [12, 0, 0], r: 2, c: "#ffffff" }],
      bonds: [{ i: 0, j: 1, w: 1, c: "#888888" }],
    });
    expect(m.atoms[0]!.p[0]).toBeCloseTo(-0.5, 12);
    expect(m.atoms[1]!.r).toBeCloseTo(0.5, 12);
    expect(m.bonds[0]!.w).toBeCloseTo(0.25, 12);
    expect(m.labels[0]!.p).toEqual([0, 0, 0]);
  });

  it("shades colours towards white and black", () => {
    expect(shade("#808080", 1)).toBe("rgb(255,255,255)");
    expect(shade("#808080", -1)).toBe("rgb(0,0,0)");
    expect(shade("#ff0000", 0.5)).toBe("rgb(255,128,128)");
  });
});

describe("models in course content", () => {
  it("every built-in course attaches at least two known models", () => {
    for (const c of COURSES) {
      const withModel = c.concepts.filter((x) => x.model);
      expect(withModel.length, c.id).toBeGreaterThanOrEqual(2);
      for (const x of withModel) expect(hasModel(x.model!), `${c.id}/${x.slug}`).toBe(true);
    }
  });

  it("round-trips model: through course folder files", () => {
    const course = COURSES[0]!;
    const files = courseToFiles(course);
    const withModel = course.concepts.find((x) => x.model)!;
    const file = files[`concepts/${withModel.slug}.md`] ?? "";
    expect(file).toMatch(new RegExp(`^model: ${withModel.model}$`, "m"));
    const { course: back, errors } = parseCourseFiles(files);
    expect(errors).toEqual([]);
    expect(back.concepts.map((x) => x.model)).toEqual(course.concepts.map((x) => x.model));
    expect(back.concepts.find((x) => !x.model)).not.toHaveProperty("model");
  });

  it("reports an unknown model id", () => {
    const course = COURSES[0]!;
    const bad = { ...course, concepts: course.concepts.map((x, i) => (i ? x : { ...x, model: "not-a-model" })) };
    expect(validateCourse(bad).join("\n")).toMatch(/unknown model "not-a-model"/);
    const files = courseToFiles(bad);
    expect(parseCourseFiles(files).errors.join("\n")).toMatch(/unknown model "not-a-model"/);
  });
});
