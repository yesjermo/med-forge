/** Tiny 3D renderer for course-note models: perspective-projected, depth-sorted shaded spheres and sticks on a 2D canvas. */

export type V3 = [number, number, number];
/** A sphere. r = 0 makes an invisible joint for bonds. a = opacity. */
export interface Atom { p: V3; r: number; c: string; a?: number }
/** A stick between atoms i and j; w is its width in model units. */
export interface Bond { i: number; j: number; w: number; c: string; dash?: boolean }
export interface Model {
  title: string;
  caption: string;
  atoms: Atom[];
  bonds: Bond[];
  labels: { p: V3; text: string }[];
  /** [colour, meaning] pairs shown under the canvas. */
  legend: [string, string][];
  /** Starting tilt about the horizontal axis (radians). */
  tilt: number;
}

/** Camera distance from the origin, in model radii (models are normalised to fit a unit sphere). */
export const CAM = 4.5;

export function rotate([x, y, z]: V3, yaw: number, pitch: number): V3 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x1 = x * cy + z * sy, z1 = z * cy - x * sy;
  return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
}

/**
 * Perspective projection onto a w×h canvas (camera on -z looking at the origin, +y up).
 * The focal length is chosen so a unit sphere's silhouette fills ~94% of the shorter side.
 * Returns screen x/y, the pixels-per-unit scale s at that depth, and the depth z (bigger = farther).
 */
export function project([x, y, z]: V3, w: number, h: number) {
  const f = 0.47 * Math.min(w, h) * Math.sqrt(CAM * CAM - 1);
  const s = f / (CAM + z);
  return { x: w / 2 + x * s, y: h / 2 - y * s, s, z };
}

/** Centre a model on its bounding box and scale it so every sphere fits inside the unit sphere. */
export function normalise(m: Model): Model {
  const lo: V3 = [Infinity, Infinity, Infinity], hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const a of m.atoms) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k]!, a.p[k]! - a.r); hi[k] = Math.max(hi[k]!, a.p[k]! + a.r); }
  const c = lo.map((v, k) => (v + hi[k]!) / 2) as V3;
  const sub = (p: V3): V3 => [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
  const k = 1 / Math.max(1e-9, ...m.atoms.map((a) => Math.hypot(...sub(a.p)) + a.r));
  const fit = (p: V3) => sub(p).map((v) => v * k) as V3;
  return {
    ...m,
    atoms: m.atoms.map((a) => ({ ...a, p: fit(a.p), r: a.r * k })),
    bonds: m.bonds.map((b) => ({ ...b, w: b.w * k })),
    labels: m.labels.map((l) => ({ ...l, p: fit(l.p) })),
  };
}

const shades = new Map<string, string>();
/** Mix a #rrggbb colour towards white (f > 0) or black (f < 0). */
export function shade(hex: string, f: number): string {
  const key = hex + f;
  let v = shades.get(key);
  if (!v) {
    const n = parseInt(hex.slice(1), 16), t = f > 0 ? 255 : 0, g = Math.abs(f);
    const ch = (s: number) => Math.round(((n >> s) & 255) * (1 - g) + t * g);
    shades.set(key, (v = `rgb(${ch(16)},${ch(8)},${ch(0)})`));
  }
  return v;
}

/** Draw the model; ink is the text colour for labels. Painter's algorithm: farthest item first. */
export function draw(ctx: CanvasRenderingContext2D, m: Model, w: number, h: number, yaw: number, pitch: number, ink: string) {
  ctx.clearRect(0, 0, w, h);
  const P = m.atoms.map((a) => project(rotate(a.p, yaw, pitch), w, h));
  const items: [number, number][] = m.atoms.map((_, i) => [P[i]!.z, i]);
  // Bonds sort just behind their midpoint so the spheres at each end sit on top.
  m.bonds.forEach((b, i) => items.push([(P[b.i]!.z + P[b.j]!.z) / 2 + 0.02, ~i]));
  items.sort((a, b) => b[0] - a[0]);
  ctx.lineCap = "round";
  for (const [, i] of items) {
    if (i < 0) {
      const b = m.bonds[~i]!, p = P[b.i]!, q = P[b.j]!;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = b.c;
      ctx.lineWidth = Math.max(0.75, (b.w * (p.s + q.s)) / 2);
      ctx.setLineDash(b.dash ? [ctx.lineWidth * 1.2, ctx.lineWidth * 1.6] : []);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    } else {
      const a = m.atoms[i]!, p = P[i]!, r = a.r * p.s;
      if (r < 0.4) continue;
      const g = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.08, p.x, p.y, r);
      g.addColorStop(0, shade(a.c, 0.65));
      g.addColorStop(0.45, a.c);
      g.addColorStop(1, shade(a.c, -0.5));
      ctx.globalAlpha = a.a ?? 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.fillStyle = ink;
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.textAlign = "center";
  for (const l of m.labels) {
    const p = project(rotate(l.p, yaw, pitch), w, h);
    ctx.fillText(l.text, p.x, p.y);
  }
}
