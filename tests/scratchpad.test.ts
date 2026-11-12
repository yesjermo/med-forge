import { describe, expect, it } from "vitest";
import {
  compact,
  createScratchStore,
  denormalise,
  eraseAt,
  MAX_NUMBERS,
  normalisePoint,
  round4,
  scratchKey,
  strokeHit,
  thinPoints,
  type Stroke,
} from "../site/src/med/scratchpad/strokes";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

const blocked = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
  removeItem: () => {
    throw new Error("SecurityError");
  },
};

const pen = (points: number[], size = 4): Stroke => ({ tool: "pen", color: "ink", size, points });

describe("normalise / denormalise", () => {
  it("maps pixels to 0–1 and back", () => {
    const [x, y] = normalisePoint(150, 100, 600, 400);
    expect([x, y]).toEqual([0.25, 0.25]);
    expect(denormalise([x, y, 1, 1], 600, 400)).toEqual([150, 100, 600, 400]);
  });

  it("rounds to 4 decimals and clamps outside the canvas", () => {
    expect(normalisePoint(100, 100, 300, 300)).toEqual([0.3333, 0.3333]);
    expect(normalisePoint(-20, 999, 300, 300)).toEqual([0, 1]);
    expect(normalisePoint(10, 10, 0, 0)).toEqual([0, 0]);
    expect(round4(0.123456)).toBe(0.1235);
  });

  it("survives a resize at the same aspect ratio", () => {
    const n = normalisePoint(120, 80, 600, 400);
    expect(denormalise(n, 300, 200)).toEqual([60, 40]);
  });
});

describe("thinPoints", () => {
  it("drops near-duplicate points but keeps both ends", () => {
    const pts = [0, 0, 0.0001, 0, 0.0002, 0, 0.1, 0.1, 0.1001, 0.1, 0.5, 0.5];
    const out = thinPoints(pts, 0.003);
    expect(out.slice(0, 2)).toEqual([0, 0]);
    expect(out.slice(-2)).toEqual([0.5, 0.5]);
    expect(out).toEqual([0, 0, 0.1, 0.1, 0.5, 0.5]);
  });

  it("leaves short strokes alone", () => {
    expect(thinPoints([0.1, 0.1])).toEqual([0.1, 0.1]);
    expect(thinPoints([0.1, 0.1, 0.1, 0.1])).toEqual([0.1, 0.1, 0.1, 0.1]);
  });

  it("shrinks a dense line a lot", () => {
    const pts: number[] = [];
    for (let i = 0; i <= 1000; i++) pts.push(i / 1000, 0.5);
    const out = thinPoints(pts, 0.01);
    expect(out.length / 2).toBeLessThanOrEqual(102);
    expect(out.slice(-2)).toEqual([1, 0.5]);
  });
});

describe("eraser hit-testing", () => {
  const W = 600;
  const H = 400;
  const line = pen([0.1, 0.5, 0.9, 0.5], 4); // horizontal line at y = 200px

  it("hits a segment within radius + half the stroke width", () => {
    expect(strokeHit(line, 300, 210, 9, W, H)).toBe(true); // 10px away, reach 9 + 2
    expect(strokeHit(line, 300, 215, 9, W, H)).toBe(false);
    expect(strokeHit(line, 20, 200, 5, W, H)).toBe(false); // past the left end (x = 60px)
  });

  it("hits single-point dots", () => {
    const dot = pen([0.5, 0.5]);
    expect(strokeHit(dot, 300, 203, 2, W, H)).toBe(true);
    expect(strokeHit(dot, 300, 220, 2, W, H)).toBe(false);
  });

  it("removes only touched strokes and returns the same array when nothing is hit", () => {
    const other = pen([0.1, 0.1, 0.2, 0.1]);
    const strokes = [line, other];
    const after = eraseAt(strokes, 300, 200, 5, W, H);
    expect(after).toEqual([other]);
    expect(eraseAt(strokes, 590, 390, 5, W, H)).toBe(strokes);
  });
});

describe("scratch store", () => {
  it("round-trips strokes per id under the study-forge:scratch: key", () => {
    const storage = memoryStorage();
    const store = createScratchStore(storage);
    const strokes: Stroke[] = [pen([0.1, 0.1, 0.5, 0.5]), { tool: "highlighter", color: "amber", size: 22, points: [0.2, 0.2, 0.8, 0.2] }];
    store.save("q1", strokes);
    expect(storage.map.has(scratchKey("q1"))).toBe(true);
    expect(scratchKey("q1")).toBe("study-forge:scratch:q1");
    expect(createScratchStore(storage).load("q1")).toEqual(strokes);
    expect(createScratchStore(storage).load("q2")).toEqual([]);
  });

  it("clear removes the key, and saving nothing clears too", () => {
    const storage = memoryStorage();
    const store = createScratchStore(storage);
    store.save("q1", [pen([0.1, 0.1, 0.2, 0.2])]);
    store.clear("q1");
    expect(storage.map.size).toBe(0);
    store.save("q1", [pen([0.1, 0.1, 0.2, 0.2])]);
    store.save("q1", []);
    expect(storage.map.size).toBe(0);
    expect(store.load("q1")).toEqual([]);
  });

  it("tolerates corrupt JSON and drops malformed strokes", () => {
    const corrupt = memoryStorage({ [scratchKey("bad")]: "{not json" });
    expect(createScratchStore(corrupt).load("bad")).toEqual([]);

    const mixed = memoryStorage({
      [scratchKey("mix")]: JSON.stringify({
        v: 1,
        strokes: [
          pen([0.1, 0.1, 0.2, 0.2]),
          { tool: "laser", color: "ink", size: 4, points: [0, 0] },
          { tool: "pen", color: "ink", size: -1, points: [0, 0] },
          { tool: "pen", color: "ink", size: 4, points: ["a", 1] },
          { tool: "eraser", color: "ink", size: 4, points: [0, 0] },
          null,
          { tool: "pen", color: "ink", size: 4, points: [2, -1] },
        ],
      }),
    });
    expect(createScratchStore(mixed).load("mix")).toEqual([pen([0.1, 0.1, 0.2, 0.2]), pen([1, 0])]);
  });

  it("keeps working in memory when storage is blocked or missing", () => {
    for (const storage of [blocked, null]) {
      const store = createScratchStore(storage);
      expect(store.load("q1")).toEqual([]);
      store.save("q1", [pen([0.1, 0.1, 0.2, 0.2])]);
      expect(store.load("q1")).toEqual([pen([0.1, 0.1, 0.2, 0.2])]);
      store.clear("q1");
      expect(store.load("q1")).toEqual([]);
    }
  });

  it("thins points on save and caps size, keeping the newest strokes", () => {
    const dense: number[] = [];
    for (let i = 0; i <= 500; i++) dense.push(i / 500, 0.5);
    const out = compact([pen(dense)]);
    expect(out[0]!.points.length).toBeLessThan(dense.length * 0.6);

    const many: Stroke[] = [];
    for (let i = 0; i < 2000; i++) {
      const pts: number[] = [];
      for (let j = 0; j < 20; j++) pts.push(j / 20, i / 2000);
      many.push(pen(pts));
    }
    const capped = compact(many);
    const numbers = capped.reduce((n, s) => n + s.points.length, 0);
    expect(numbers).toBeLessThanOrEqual(MAX_NUMBERS);
    expect(capped.length).toBeLessThan(many.length);
    expect(capped[capped.length - 1]).toEqual(many[many.length - 1]);

    const storage = memoryStorage();
    createScratchStore(storage).save("big", many);
    expect(storage.map.get(scratchKey("big"))!.length).toBeLessThan(400_000);
  });
});
