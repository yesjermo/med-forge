import { normalise, type Atom, type Bond, type Model, type V3 } from "./render";

/**
 * Procedural model library for concept pages (`model:` in concept front matter). Simplified but
 * proportioned from real geometry; molecules use CPK-style colours and ångström units.
 */

const CPK = { H: "#e6e6e6", C: "#5b6472", N: "#3b6fe0", O: "#e0433b", P: "#f08a24", Fe: "#d2691e", K: "#8f40d4" };
const DEG = Math.PI / 180;
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: V3) => mul(a, 1 / Math.hypot(...a));
const lerp = (a: V3, b: V3, t: number) => add(a, mul(add(b, mul(a, -1)), t));
/** Two unit vectors perpendicular to d (and to each other). */
const frame = (d: V3): [V3, V3] => {
  const u = unit(cross(d, Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  return [u, cross(unit(d), u)];
};
/** Cylindrical coordinates about the vertical (y) axis. */
const cyl = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)];
/** n roughly even points on the unit sphere (Fibonacci lattice). */
const fib = (n: number): V3[] =>
  Array.from({ length: n }, (_, i) => cyl(Math.sqrt(1 - (1 - (2 * (i + 0.5)) / n) ** 2), i * 2.39996, 1 - (2 * (i + 0.5)) / n));
/** Seeded pseudo-random numbers in [0, 1), so models are identical on every load. */
const rng = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const TETRA: V3[] = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].map((v) => unit(v as V3));

class Builder {
  atoms: Atom[] = [];
  bonds: Bond[] = [];
  labels: Model["labels"] = [];
  constructor(readonly w = 0.3, readonly bc = "#8d949e") {}
  at(p: V3, r: number, c: string, a?: number) {
    this.atoms.push(a === undefined ? { p, r, c } : { p, r, c, a });
    return this.atoms.length - 1;
  }
  bond(i: number, j: number, w = this.w, c = this.bc, dash = false) {
    this.bonds.push(dash ? { i, j, w, c, dash } : { i, j, w, c });
  }
  chain(pts: V3[], r: number, c: string, w = this.w, bc = this.bc) {
    const ids = pts.map((p) => this.at(p, r, c));
    ids.forEach((id, k) => k && this.bond(ids[k - 1]!, id, w, bc));
    return ids;
  }
  label(p: V3, text: string) {
    this.labels.push({ p, text });
  }
  done(title: string, caption: string, legend: [string, string][], tilt = 0.3): Model {
    return normalise({ title, caption, atoms: this.atoms, bonds: this.bonds, labels: this.labels, legend, tilt });
  }
}

const BASE = { A: "#3fae5a", T: "#e05a4f", G: "#e6b422", C: "#4f7fe0" } as const;
const PAIR = { A: "T", T: "A", G: "C", C: "G" } as const;

function dna(): Model {
  const b = new Builder(0.6);
  const seq = "ATGCGTACCGATTGCAG", turn = (2 * Math.PI) / 10.5, rise = 3.4, R = 10;
  let prev: [number, number] | null = null;
  [...seq].forEach((ch, i) => {
    const t = i * turn, y = (i - seq.length / 2) * rise, x = ch as keyof typeof BASE;
    const p1 = cyl(R, t, y), p2 = cyl(R, t + 2.5, y); // minor groove ~145°
    const s1 = b.at(p1, 2.3, CPK.P), s2 = b.at(p2, 2.3, CPK.P);
    const b1 = b.at(lerp(p1, p2, 0.3), 1.9, BASE[x]), b2 = b.at(lerp(p1, p2, 0.7), 1.9, BASE[PAIR[x]]);
    b.bond(s1, b1, 0.9);
    b.bond(b1, b2, 0.5, "#b9bec6", true);
    b.bond(b2, s2, 0.9);
    if (prev) { b.bond(prev[0], s1, 1.1, CPK.P); b.bond(prev[1], s2, 1.1, CPK.P); }
    prev = [s1, s2];
  });
  return b.done("DNA double helix", "Two antiparallel sugar–phosphate backbones wind around each other, about 10.5 base pairs per turn; A pairs with T and G with C by hydrogen bonds, leaving a major and a minor groove.",
    [[CPK.P, "sugar–phosphate backbone"], [BASE.A, "adenine"], [BASE.T, "thymine"], [BASE.G, "guanine"], [BASE.C, "cytosine"]], 0.15);
}

function bilayer(): Model {
  const b = new Builder(0.07, "#c9a24a"), rand = rng(11);
  for (const side of [1, -1]) {
    for (let gx = -5; gx <= 5; gx++) for (let gz = -5; gz <= 5; gz++) {
      const x = gx + (gz % 2 ? 0.5 : 0) + (side < 0 ? 0.25 : 0), z = gz * 0.87, d = Math.hypot(x, z);
      if (d > 4.6 || d < 1.7) continue;
      const head = b.at([x, side * 2.3, z], 0.5, "#e8798a");
      for (const dx of [-0.18, 0.18]) {
        const wob = (rand() - 0.5) * 0.4;
        const mid = b.at([x + dx + wob, side * 1.2, z], 0, "#c9a24a"), end = b.at([x + dx - wob, side * 0.15, z + wob], 0, "#c9a24a");
        b.bond(head, mid);
        b.bond(mid, end);
      }
    }
  }
  for (let k = 0; k < 7; k++) b.chain([-2.4, -1.2, 0, 1.2, 2.4].map((y) => cyl(1.05, (k * 2 * Math.PI) / 7 + y * 0.15, y)), 0.5, "#8b6fd6", 0.4, "#8b6fd6");
  b.at([0, 1.4, 0], 0.32, CPK.K);
  b.at([0, -0.6, 0], 0.32, CPK.K);
  b.label([0, 3.4, 0], "outside");
  b.label([0, -3.4, 0], "cytoplasm");
  return b.done("Lipid bilayer with a channel", "Phospholipids form two leaflets: polar heads face the water on each side and fatty-acid tails meet in the middle. A channel protein spans the membrane and gives ions such as K⁺ a water-filled pore.",
    [["#e8798a", "phosphate head"], ["#c9a24a", "fatty-acid tails"], ["#8b6fd6", "channel protein"], [CPK.K, "K⁺ ion"]], 0.35);
}

function alphaHelix(): Model {
  const b = new Builder(0.3), n = 14, N: number[] = [], O: number[] = [];
  let prevC = -1;
  for (let i = 0; i < n; i++) {
    const t = i * 100 * DEG, y = (i - n / 2) * 1.5; // 3.6 residues and 5.4 Å per turn
    const ni = b.at(cyl(1.55, t - 0.5, y - 0.5), 0.55, CPK.N), ca = b.at(cyl(2.3, t, y), 0.6, CPK.C);
    const c = b.at(cyl(1.6, t + 0.5, y + 0.5), 0.6, CPK.C), o = b.at(cyl(1.9, t + 0.55, y + 2), 0.55, CPK.O);
    const r = b.at(cyl(4, t, y - 0.3), 0.85, "#4caf7a");
    if (prevC >= 0) b.bond(prevC, ni);
    b.bond(ni, ca);
    b.bond(ca, c);
    b.bond(c, o);
    b.bond(ca, r);
    prevC = c;
    N.push(ni);
    O.push(o);
  }
  for (let i = 0; i + 4 < n; i++) b.bond(O[i]!, N[i + 4]!, 0.15, "#e0a030", true);
  return b.done("α-helix", "The backbone coils right-handed, 3.6 residues per turn. Each C=O hydrogen-bonds to the N–H four residues along, and the side chains (R groups) point outwards.",
    [[CPK.C, "carbon"], [CPK.N, "nitrogen"], [CPK.O, "oxygen"], ["#4caf7a", "side chain (R)"], ["#e0a030", "hydrogen bond"]], 0.1);
}

function water(): Model {
  const b = new Builder(0.28);
  const mol = (o: V3, d1: V3, d2: V3): [number, number, number] => {
    const oi = b.at(o, 0.75, CPK.O), h = (d: V3) => { const id = b.at(add(o, mul(d, 0.96)), 0.45, CPK.H); b.bond(oi, id); return id; };
    return [oi, h(d1), h(d2)];
  };
  const hb = (h: number, o: number) => b.bond(h, o, 0.14, "#5aa9e6", true);
  const [o0, h1, h2] = mol([0, 0, 0], TETRA[0]!, TETRA[1]!);
  TETRA.forEach((d, k) => {
    const o = mul(d, 2.8), away = (j: number) => mul(TETRA[j % 4]!, -1);
    if (k < 2) {
      const [oi] = mol(o, away(k + 2), away(k + 3)); // accepts an H from the centre
      hb(k ? h2 : h1, oi);
    } else {
      const [, h] = mol(o, away(k), away(k + 1)); // donates an H to the centre
      hb(h, o0);
    }
  });
  return b.done("Water and hydrogen bonds", "Water is bent (H–O–H about 104.5°) and polar. Each molecule can donate two and accept two hydrogen bonds, giving the near-tetrahedral network behind water's high heat capacity and its role as a solvent.",
    [[CPK.O, "oxygen (δ−)"], [CPK.H, "hydrogen (δ+)"], ["#5aa9e6", "hydrogen bond"]]);
}

function glucose(): Model {
  const b = new Builder(0.25), ring: number[] = [];
  for (let k = 0; k < 6; k++) {
    const t = k * 60 * DEG, up = k % 2 ? 1 : -1, p: V3 = [1.45 * Math.cos(t), up * 0.25, 1.45 * Math.sin(t)];
    const out: V3 = [Math.cos(t), 0, Math.sin(t)];
    ring.push(b.at(p, k ? 0.7 : 0.65, k ? CPK.C : CPK.O)); // ring order O5, C1…C5
    if (!k) continue;
    b.bond(ring[k]!, b.at(add(p, [0, up * 1.09, 0]), 0.4, CPK.H)); // axial H
    const eq = add(p, add(mul(out, 1.38), [0, -up * 0.45, 0])); // every heavy substituent equatorial: β-D-glucose
    const sub = b.at(eq, k === 5 ? 0.7 : 0.65, k === 5 ? CPK.C : CPK.O);
    b.bond(ring[k]!, sub);
    const o = k === 5 ? b.at(add(eq, add(mul(out, 0.6), [0, up * 1.25, 0])), 0.65, CPK.O) : sub;
    if (k === 5) b.bond(sub, o);
    b.bond(o, b.at(add(b.atoms[o]!.p, add(mul(out, 0.55), [0, -up * 0.75, 0])), 0.4, CPK.H));
    if (k === 1 || k === 4) b.label(add(p, [0, -up * 0.9, 0]), `C${k}`);
    if (k === 5) b.label(add(eq, [0, -up * 0.9, 0]), "C6");
  }
  ring.forEach((id, k) => b.bond(id, ring[(k + 1) % 6]!));
  return b.done("β-D-glucose (chair)", "Glucose in solution is mostly a six-membered pyranose ring in the chair shape. In β-D-glucose every OH and the CH₂OH sit equatorial, which makes it the most stable hexose.",
    [[CPK.C, "carbon"], [CPK.O, "oxygen"], [CPK.H, "hydrogen"]], 0.6);
}

function carbonicAcid(): Model {
  const b = new Builder(0.28), c = b.at([0, 0, 0], 0.72, CPK.C);
  [90, 210, 330].forEach((a, k) => {
    const d = cyl(1, a * DEG, 0), o = b.at(mul([d[0], d[2], 0], 1.3), 0.66, CPK.O);
    b.bond(c, o, k ? 0.28 : 0.42);
    if (k) b.bond(o, b.at(add(b.atoms[o]!.p, mul([0, -1, 0], 0.96)), 0.4, CPK.H));
  });
  b.label([0, 2.1, 0], "C=O");
  return b.done("Carbonic acid (H₂CO₃)", "CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Carbonic anhydrase speeds the first step; carbonic acid is planar, with carbon at the centre of a triangle of oxygens.",
    [[CPK.C, "carbon"], [CPK.O, "oxygen"], [CPK.H, "hydrogen (lost as H⁺)"]], 0);
}

function enzyme(): Model {
  const b = new Builder(0.03), axis = unit([0.5, 0.55, -0.67]), [u, v] = frame(axis);
  for (const p of fib(340)) {
    const c = dot(p, axis), pit = Math.min(1, Math.max(0, (c - 0.74) / 0.16)); // dimple around the axis
    const bump = 1 + 0.04 * Math.sin(6 * p[0] + 4 * p[2]);
    b.at(mul(p, bump * (1 - 0.42 * pit)), 0.15, c > 0.74 ? "#e2667a" : "#5b8bd6");
  }
  const ring = Array.from({ length: 6 }, (_, k) => add(mul(axis, 0.85), add(mul(u, 0.15 * Math.cos(k * 60 * DEG)), mul(v, 0.15 * Math.sin(k * 60 * DEG)))));
  const ids = ring.map((p, k) => b.at(p, 0.07, k % 3 ? CPK.C : CPK.O));
  ids.forEach((id, k) => b.bond(id, ids[(k + 1) % 6]!));
  return b.done("Enzyme–substrate complex", "The substrate fits a pocket on the enzyme surface, the active site. Side chains lining the pocket bind the substrate and stabilise the transition state; a competitive inhibitor would occupy the same pocket.",
    [["#5b8bd6", "enzyme surface"], ["#e2667a", "active site"], [CPK.C, "substrate (C, O)"]], 0.2);
}

function haemoglobin(): Model {
  const b = new Builder(0.03), pts = fib(110);
  TETRA.forEach((d, k) => {
    const c = mul(d, 0.75), col = k < 2 ? "#e58e8e" : "#7fa7e0";
    for (const p of pts) b.at(add(c, mul(p, 0.62 * (1 + 0.05 * Math.sin(7 * p[0] + 3 * p[1])))), 0.13, col);
    const hd = unit(add(d, frame(d)[0])), hc = add(c, mul(hd, 0.74)), [u, v] = frame(hd);
    const fe = b.at(hc, 0.1, CPK.Fe);
    for (let j = 0; j < 4; j++) b.bond(fe, b.at(add(hc, add(mul(u, 0.14 * Math.cos(j * 90 * DEG)), mul(v, 0.14 * Math.sin(j * 90 * DEG)))), 0.06, "#7a3b1f"), 0.03, "#7a3b1f");
    const o1 = b.at(add(hc, mul(hd, 0.16)), 0.07, CPK.O), o2 = b.at(add(hc, add(mul(hd, 0.24), mul(u, 0.08))), 0.07, CPK.O);
    b.bond(fe, o1);
    b.bond(o1, o2);
  });
  return b.done("Haemoglobin tetramer", "Two α and two β globin chains, each holding a haem group whose iron binds one O₂. Binding at one haem shifts the subunits and raises the others' affinity: cooperative binding, the sigmoid curve.",
    [["#e58e8e", "α subunit"], ["#7fa7e0", "β subunit"], [CPK.Fe, "haem iron"], [CPK.O, "bound O₂"]], 0.25);
}

function sarcomere(): Model {
  const b = new Builder(0.05), ACTIN = "#e0a347", MYO = "#6d7fd1", ZC = "#9aa3ad";
  for (const s of [-1, 1]) {
    const corners = ([[-1, -0.8], [1, -0.8], [1, 0.8], [-1, 0.8]] as const).map(([y, z]) => b.at([s * 3, y, z], 0.07, ZC));
    corners.forEach((id, k) => b.bond(id, corners[(k + 1) % 4]!, 0.08, ZC));
    for (const y of [-0.75, -0.25, 0.25, 0.75]) for (const z of [-0.45, 0.45]) {
      b.chain(Array.from({ length: 11 }, (_, k): V3 => [s * (3 - k * 0.22), y, z + 0.04 * Math.sin(k * 1.6)]), 0.085, ACTIN, 0.04, ACTIN);
    }
  }
  for (const y of [-0.5, 0, 0.5]) for (const z of [-0.45, 0.45]) {
    b.bond(b.at([-1.9, y, z], 0.07, MYO), b.at([1.9, y, z], 0.07, MYO), 0.11, MYO);
    for (let k = 0; k < 7; k++) for (const s of [-1, 1]) {
      const x = s * (0.4 + k * 0.24), t = k * 2.1 + (s > 0 ? 1 : 0); // bare zone in the middle, heads spiral round
      b.bond(b.at([x, y, z], 0, MYO), b.at([x + s * 0.08, y + 0.14 * Math.cos(t), z + 0.14 * Math.sin(t)], 0.075, "#9fb0f0"), 0.04, MYO);
    }
  }
  b.label([3, 1.25, 0], "Z disc");
  b.label([-3, 1.25, 0], "Z disc");
  b.label([0, 1.25, 0], "M line");
  return b.done("Sarcomere", "Thin actin filaments anchor at the Z discs; thick myosin filaments sit in the middle. Myosin heads pull actin towards the M line, shortening the sarcomere. Stretching it before contraction improves filament overlap (Frank–Starling).",
    [[ACTIN, "actin (thin)"], [MYO, "myosin (thick)"], ["#9fb0f0", "myosin heads"], [ZC, "Z disc"]], 0.35);
}

function bacterium(): Model {
  const b = new Builder(0.02), rand = rng(5), L = 1.2, R = 0.5, cap = (Math.PI / 2) * R, step = 0.2;
  const surface = (u: number): [number, number] => // arc length along the rod's profile -> (x, radius)
    u < cap ? [-L - R * Math.cos(u / R), R * Math.sin(u / R)] : u < cap + 2 * L ? [u - cap - L, R] : [L + R * Math.sin((u - cap - 2 * L) / R), R * Math.cos((u - cap - 2 * L) / R)];
  const shell: V3[] = [];
  for (let u = step / 2; u < 2 * cap + 2 * L; u += step) {
    const [x, rho] = surface(u), n = Math.max(1, Math.round((2 * Math.PI * rho) / step));
    for (let k = 0; k < n; k++) shell.push([x, rho * Math.cos((k * 2 * Math.PI) / n + u), rho * Math.sin((k * 2 * Math.PI) / n + u)]);
  }
  for (const p of shell) b.at(p, 0.055, "#4fa3a0", 0.55);
  const loop = Array.from({ length: 90 }, (_, k): V3 => { const t = (k / 89) * 2 * Math.PI; return [0.75 * Math.cos(t) + 0.1 * Math.cos(7 * t), 0.2 * Math.sin(3 * t), 0.2 * Math.sin(2 * t + 1) + 0.12 * Math.sin(t)]; });
  b.chain(loop, 0, "#3b6fe0", 0.025, "#3b6fe0");
  for (let k = 0; k < 45; k++) b.at([(rand() - 0.5) * 2.6, (rand() - 0.5) * 0.7, (rand() - 0.5) * 0.7], 0.035, "#e2a03f");
  for (let k = 0; k < 30; k++) { const p = shell[Math.floor(rand() * shell.length)]!, d = unit([p[0] - Math.max(-L, Math.min(L, p[0])), p[1], p[2]]); b.bond(b.at(p, 0, "#c98b5a"), b.at(add(p, mul(d, 0.2)), 0, "#c98b5a"), 0.012, "#c98b5a"); }
  for (const [x, a] of [[-1.5, 0], [-0.4, 2], [0.5, 4], [1.5, 1]] as const) {
    const s = surface(x + cap + L), start: V3 = [x, s[1] * Math.cos(a), s[1] * Math.sin(a)], d = unit([x / 1.5, Math.cos(a), Math.sin(a)]), [u, v] = frame(d);
    b.chain(Array.from({ length: 14 }, (_, k): V3 => add(add(start, mul(d, k * 0.065)), add(mul(u, 0.07 * Math.sin(k * 0.8) * Math.min(1, k / 3)), mul(v, 0.07 * Math.cos(k * 0.8) * Math.min(1, k / 3))))), 0, "#9aa3ad", 0.02, "#9aa3ad");
  }
  return b.done("Rod-shaped bacterium", "A bacillus such as E. coli: a cell envelope (membrane and peptidoglycan wall; Gram-negatives add an outer membrane) around cytoplasm with ribosomes and a looped nucleoid. Flagella drive swimming; short fimbriae (pili) stick to host cells.",
    [["#4fa3a0", "cell envelope"], ["#3b6fe0", "nucleoid DNA"], ["#e2a03f", "ribosomes (70S)"], ["#9aa3ad", "flagella"], ["#c98b5a", "fimbriae"]], 0.3);
}

function virus(): Model {
  const b = new Builder(0.04), phi = (1 + Math.sqrt(5)) / 2, V: V3[] = [];
  for (const s of [-1, 1]) for (const t of [-1, 1]) V.push([0, s, t * phi], [s, t * phi, 0], [t * phi, 0, s]);
  const seen = new Set<string>(), f = 3;
  for (let a = 0; a < 12; a++) for (let c = a + 1; c < 12; c++) for (let d = c + 1; d < 12; d++) {
    const P = [V[a]!, V[c]!, V[d]!], e = (x: V3, y: V3) => Math.abs(Math.hypot(...add(x, mul(y, -1))) - 2) < 1e-6;
    if (!e(P[0]!, P[1]!) || !e(P[1]!, P[2]!) || !e(P[0]!, P[2]!)) continue; // one of the 20 faces
    for (let i = 0; i <= f; i++) for (let j = 0; i + j <= f; j++) {
      const p = unit(add(add(mul(P[0]!, i / f), mul(P[1]!, j / f)), mul(P[2]!, (f - i - j) / f)));
      const key = p.map((x) => x.toFixed(3)).join();
      if (seen.has(key)) continue;
      seen.add(key);
      b.at(p, 0.17, i === f || j === f || i + j === 0 ? "#d9822b" : "#5fa8d3");
    }
  }
  for (const v of V) { const d = unit(v); b.bond(b.at(mul(d, 1.05), 0, "#9aa3ad"), b.at(mul(d, 1.4), 0.08, "#c2549b"), 0.04, "#9aa3ad"); }
  return b.done("Icosahedral virus capsid", "Many viruses build a shell from repeated protein subunits arranged with icosahedral symmetry: 12 five-fold vertices (pentons) and hexons between them. Spike proteins at the vertices attach to host-cell receptors.",
    [["#5fa8d3", "hexon capsomers"], ["#d9822b", "penton capsomers"], ["#c2549b", "attachment spikes"]], 0.2);
}

function cell(): Model {
  const b = new Builder(0.03), rand = rng(3);
  for (const p of fib(300)) b.at(p, 0.05, "#4fa3a0", 0.45);
  const nc: V3 = [-0.15, 0.05, 0];
  for (const p of fib(130)) b.at(add(nc, mul(p, 0.36)), 0.06, "#7c6fd6", 0.6);
  b.at(add(nc, [0.05, 0.05, 0]), 0.12, "#4b3fa8");
  for (let k = 0; k < 6; k++) {
    const c = mul(unit([rand() - 0.5, rand() - 0.5, rand() - 0.5]), 0.62 + rand() * 0.15), d = unit([rand() - 0.5, rand() - 0.5, rand() - 0.5]);
    for (let j = -2; j <= 2; j++) b.at(add(c, mul(d, j * 0.045)), 0.065, "#e07a4f");
  }
  for (let s = 0; s < 4; s++) b.chain(Array.from({ length: 9 }, (_, k): V3 => add([0.42 + s * 0.07, 0.15, 0.25], [0, Math.sin((k / 8 - 0.5) * 1.6) * 0.28, Math.cos((k / 8 - 0.5) * 1.6) * 0.12 - 0.12])), 0, "#e0b23f", 0.035, "#e0b23f");
  for (let k = 0; k < 4; k++) b.at(mul(unit([rand() - 0.5, rand() - 0.5, rand() - 0.5]), 0.55), 0.06, "#c2549b");
  for (let k = 0; k < 60; k++) b.at(mul(unit([rand() - 0.5, rand() - 0.5, rand() - 0.5]), 0.45 + rand() * 0.45), 0.018, "#9aa3ad");
  return b.done("Eukaryotic cell", "A plasma membrane encloses the cytoplasm (intracellular fluid) holding the nucleus and nucleolus, mitochondria, the Golgi apparatus, lysosomes and ribosomes. Everything outside the membrane is extracellular fluid.",
    [["#4fa3a0", "plasma membrane"], ["#7c6fd6", "nucleus"], ["#4b3fa8", "nucleolus"], ["#e07a4f", "mitochondria"], ["#e0b23f", "Golgi"], ["#c2549b", "lysosomes"]], 0.2);
}

const BUILDERS: Record<string, () => Model> = {
  dna, bilayer, "alpha-helix": alphaHelix, water, glucose, "carbonic-acid": carbonicAcid,
  enzyme, haemoglobin, sarcomere, bacterium, virus, cell,
};

export const MODEL_IDS = Object.keys(BUILDERS);
export const hasModel = (id: string) => Object.prototype.hasOwnProperty.call(BUILDERS, id);

const cache = new Map<string, Model>();
export function getModel(id: string): Model | null {
  if (!hasModel(id)) return null;
  let m = cache.get(id);
  if (!m) cache.set(id, (m = BUILDERS[id]!()));
  return m;
}
