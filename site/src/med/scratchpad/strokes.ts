/**
 * Scratchpad data: freehand strokes kept as compact, resolution-free numbers, plus a small
 * per-question store in localStorage. Pure logic, no DOM; works in memory if storage is blocked.
 *
 * Points are normalised to 0–1 of the canvas width (x) and height (y), so a drawing survives
 * resizing as long as the canvas keeps its aspect ratio. `size` is the line width in CSS pixels
 * at REFERENCE_WIDTH and is scaled with the canvas.
 */

export type Tool = "pen" | "highlighter" | "eraser";

export interface Stroke {
  tool: Tool;
  /** A swatch id (e.g. "ink", "blue") resolved to a theme colour at draw time, or any CSS colour. */
  color: string;
  /** Line width in CSS px at REFERENCE_WIDTH. */
  size: number;
  /** Flat [x0, y0, x1, y1, …] in 0–1 canvas coordinates. */
  points: number[];
}

/** Canvas width at which `Stroke.size` is measured. */
export const REFERENCE_WIDTH = 600;
/** Default minimum distance (normalised units) between kept points. */
export const THIN_DISTANCE = 0.003;
/** Caps that keep one question's save small (well under ~200 KB). */
export const MAX_STROKES = 400;
export const MAX_NUMBERS = 30_000;
export const STORAGE_PREFIX = "study-forge:scratch:";

const TOOLS: readonly Tool[] = ["pen", "highlighter", "eraser"];

/** Round to 4 decimals (≈0.06 px on a 600 px canvas). */
export function round4(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Canvas pixels → normalised, clamped, rounded [x, y]. */
export function normalisePoint(x: number, y: number, width: number, height: number): [number, number] {
  if (!(width > 0) || !(height > 0)) return [0, 0];
  return [round4(clamp01(x / width)), round4(clamp01(y / height))];
}

/** Flat normalised points → flat canvas pixel points. */
export function denormalise(points: readonly number[], width: number, height: number): number[] {
  const out = new Array<number>(points.length);
  for (let i = 0; i + 1 < points.length; i += 2) {
    out[i] = points[i]! * width;
    out[i + 1] = points[i + 1]! * height;
  }
  return out;
}

/** Line width in pixels for a canvas of `width` CSS px. */
export function scaledSize(size: number, width: number): number {
  return (size * width) / REFERENCE_WIDTH;
}

/**
 * Drop points closer than `minDist` to the last kept point. The first and last points are
 * always kept, so a stroke never loses its ends.
 */
export function thinPoints(points: readonly number[], minDist = THIN_DISTANCE): number[] {
  const n = Math.floor(points.length / 2);
  if (n <= 2) return points.slice(0, n * 2);
  const min2 = minDist * minDist;
  const out = [points[0]!, points[1]!];
  let lx = points[0]!;
  let ly = points[1]!;
  for (let i = 1; i < n - 1; i++) {
    const x = points[i * 2]!;
    const y = points[i * 2 + 1]!;
    const dx = x - lx;
    const dy = y - ly;
    if (dx * dx + dy * dy >= min2) {
      out.push(x, y);
      lx = x;
      ly = y;
    }
  }
  const ex = points[(n - 1) * 2]!;
  const ey = points[(n - 1) * 2 + 1]!;
  // Replace a too-close final kept point rather than stacking two nearly equal points.
  if (out.length > 2) {
    const dx = ex - lx;
    const dy = ey - ly;
    if (dx * dx + dy * dy < min2) out.length -= 2;
  }
  out.push(ex, ey);
  return out;
}

/** Squared distance from point p to segment a–b. */
function dist2ToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / len2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const cx = ax + t * dx - px;
  const cy = ay + t * dy - py;
  return cx * cx + cy * cy;
}

/**
 * Does an eraser circle at canvas pixel (px, py) with `radius` px touch the stroke?
 * Measured in pixels so the canvas aspect ratio does not skew the hit area; the stroke's own
 * half-width counts too.
 */
export function strokeHit(
  stroke: Stroke,
  px: number,
  py: number,
  radius: number,
  width: number,
  height: number,
): boolean {
  const pts = stroke.points;
  const reach = radius + scaledSize(stroke.size, width) / 2;
  const r2 = reach * reach;
  if (pts.length < 2) return false;
  if (pts.length < 4) {
    const dx = pts[0]! * width - px;
    const dy = pts[1]! * height - py;
    return dx * dx + dy * dy <= r2;
  }
  for (let i = 0; i + 3 < pts.length; i += 2) {
    if (
      dist2ToSegment(px, py, pts[i]! * width, pts[i + 1]! * height, pts[i + 2]! * width, pts[i + 3]! * height) <= r2
    ) {
      return true;
    }
  }
  return false;
}

/** Remove every stroke the eraser circle touches. Returns the same array when nothing changed. */
export function eraseAt(
  strokes: readonly Stroke[],
  px: number,
  py: number,
  radius: number,
  width: number,
  height: number,
): readonly Stroke[] {
  const kept = strokes.filter((s) => !strokeHit(s, px, py, radius, width, height));
  return kept.length === strokes.length ? strokes : kept;
}

/** Validate one parsed stroke; returns null for anything malformed. Eraser strokes are never kept. */
export function sanitizeStroke(raw: unknown): Stroke | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!TOOLS.includes(r.tool as Tool) || r.tool === "eraser") return null;
  if (typeof r.color !== "string" || r.color.length === 0 || r.color.length > 40) return null;
  if (typeof r.size !== "number" || !Number.isFinite(r.size) || r.size <= 0 || r.size > 200) return null;
  if (!Array.isArray(r.points) || r.points.length < 2) return null;
  const points: number[] = [];
  for (let i = 0; i + 1 < r.points.length; i += 2) {
    const x = r.points[i];
    const y = r.points[i + 1];
    if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    points.push(round4(clamp01(x)), round4(clamp01(y)));
  }
  return { tool: r.tool as Tool, color: r.color, size: r.size, points };
}

/** Thin, round and cap a drawing for saving. Oldest strokes are dropped first when over a cap. */
export function compact(strokes: readonly Stroke[]): Stroke[] {
  const out: Stroke[] = [];
  let numbers = 0;
  // Walk newest → oldest so the most recent work survives the caps.
  for (let i = strokes.length - 1; i >= 0 && out.length < MAX_STROKES; i--) {
    const s = sanitizeStroke(strokes[i]);
    if (!s) continue;
    const points = thinPoints(s.points);
    if (numbers + points.length > MAX_NUMBERS) break;
    numbers += points.length;
    out.push({ ...s, points });
  }
  return out.reverse();
}

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function scratchKey(id: string): string {
  return STORAGE_PREFIX + id;
}

/** Per-id scratch drawings. Every call tolerates blocked, full or corrupt storage. */
export function createScratchStore(storage: StorageLike | null) {
  // In-memory fallback so drawings survive within the session when storage is unusable.
  const memory = new Map<string, Stroke[]>();

  return {
    load(id: string): Stroke[] {
      try {
        const raw = storage?.getItem(scratchKey(id));
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          const list = Array.isArray(parsed)
            ? parsed
            : parsed && typeof parsed === "object" && Array.isArray((parsed as { strokes?: unknown }).strokes)
              ? (parsed as { strokes: unknown[] }).strokes
              : [];
          return list.map(sanitizeStroke).filter((s): s is Stroke => s !== null);
        }
      } catch {
        // Corrupt JSON or blocked storage: fall through to memory.
      }
      return memory.get(id)?.slice() ?? [];
    },

    save(id: string, strokes: readonly Stroke[]): void {
      const data = compact(strokes);
      if (data.length === 0) {
        this.clear(id);
        return;
      }
      memory.set(id, data);
      try {
        storage?.setItem(scratchKey(id), JSON.stringify({ v: 1, strokes: data }));
      } catch {
        // Quota or blocked: keep the in-memory copy.
      }
    },

    clear(id: string): void {
      memory.delete(id);
      try {
        storage?.removeItem(scratchKey(id));
      } catch {
        // Nothing else to do.
      }
    },
  };
}

export type ScratchStore = ReturnType<typeof createScratchStore>;
