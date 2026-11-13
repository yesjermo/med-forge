/**
 * Save / Load: everything a student keeps in this browser, as a versioned backup object, a
 * downloadable JSON file or a compact single-line "save string" they can paste on another device.
 *
 * Pure logic over a Storage-like object so it runs in tests. Rules:
 * - Settings (`study-forge:settings`) are never exported: they hold API keys, and a backup is
 *   meant to be pasted around. Settings are also never written or removed by a restore.
 * - Only known keys are read, accepted and written (see BACKUP_KEYS / BACKUP_PREFIXES).
 * - A restore writes everything or nothing: on a full or blocked storage every change is rolled back.
 */
import { lastReviewedAt, NEW_SM2, type Progress, type QuestionProgress, type Sm2 } from "./progress";

export const BACKUP_FORMAT = "med-forge-backup";
export const BACKUP_VERSION = 1;
/** Save strings look like `MF1.z.<base64url>` (deflate-raw) or `MF1.j.<base64url>` (plain JSON). */
export const SAVE_PREFIX = "MF1.";

// Storage keys keep the app's original "study-forge" name so existing progress keeps working.
export const KEYS = {
  progress: "study-forge:med-progress",
  packs: "study-forge:med-packs",
  notebook: "study-forge:notebook",
  examDate: "study-forge:exam-date",
  lectureRate: "study-forge:lecture-rate",
  myCards: "study-forge:my-cards",
  settings: "study-forge:settings",
} as const;
export const SCRATCH_PREFIX = "study-forge:scratch:";
export const LECTURE_POS_PREFIX = "study-forge:lecture-pos:";

/** Exact keys a backup may contain (settings is deliberately absent). */
export const BACKUP_KEYS: readonly string[] = [KEYS.progress, KEYS.packs, KEYS.notebook, KEYS.examDate, KEYS.lectureRate, KEYS.myCards];
/** Key prefixes a backup may contain (the suffix is an item id). */
export const BACKUP_PREFIXES: readonly string[] = [SCRATCH_PREFIX, LECTURE_POS_PREFIX];

/** Caps on untrusted input. Browser storage is ~5M characters, so these are generous. */
export const LIMITS = {
  /** A pasted save string or uploaded file. */
  inputChars: 40_000_000,
  /** Decompressed JSON. */
  jsonBytes: 40_000_000,
  keys: 10_000,
  /** Any one value (snipped cards are the big one). */
  valueChars: 20_000_000,
  /** All values together. */
  totalChars: 30_000_000,
  idChars: 300,
} as const;

export interface Backup {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  /** ISO time the backup was made. */
  createdAt: string;
  data: Record<string, string>;
}

export type RestoreMode = "replace" | "merge";

/** Something the student can fix (bad paste, wrong file, full storage). The message is shown as is. */
export class BackupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackupError";
  }
}

export type BackupStorage = Pick<Storage, "getItem" | "setItem" | "removeItem" | "key" | "length">;

const isPrefixed = (key: string) =>
  BACKUP_PREFIXES.some((p) => key.startsWith(p) && key.length > p.length && key.length - p.length <= LIMITS.idChars);

/** True for a key a backup may contain and a restore may write. */
export function isBackupKey(key: string): boolean {
  return BACKUP_KEYS.includes(key) || isPrefixed(key);
}

/** All backup-scope keys currently in storage. */
function scopeKeys(storage: BackupStorage): string[] {
  const out: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k !== null && isBackupKey(k)) out.push(k);
  }
  return out.sort();
}

function readStorage(storage: BackupStorage | null): BackupStorage {
  if (!storage) throw new BackupError("This browser is blocking site storage (private mode or strict privacy settings), so nothing can be saved or restored here.");
  try {
    storage.getItem(KEYS.progress);
    void storage.length;
  } catch {
    throw new BackupError("This browser is blocking site storage (private mode or strict privacy settings), so nothing can be saved or restored here.");
  }
  return storage;
}

// ── Collect ──────────────────────────────────────────────────────────────────

export interface CollectOptions {
  /** Include snipped cards (`study-forge:my-cards`), which can be megabytes of images. */
  includeCards: boolean;
  now?: number;
}

/** Everything in scope from storage, as a backup object. Never includes settings. */
export function collectBackup(storage: BackupStorage | null, opts: CollectOptions): Backup {
  const s = readStorage(storage);
  const data: Record<string, string> = {};
  for (const k of scopeKeys(s)) {
    if (k === KEYS.myCards && !opts.includeCards) continue;
    const v = s.getItem(k);
    if (typeof v === "string" && v !== "") data[k] = v;
  }
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, createdAt: new Date(opts.now ?? Date.now()).toISOString(), data };
}

/** UTF-8 size in bytes. */
export function byteSize(text: string): number {
  return new TextEncoder().encode(text).length;
}

/** Sizes shown next to the "include snipped cards" checkboxes. */
export function measureStorage(storage: BackupStorage | null): { cardsBytes: number; cardCount: number; otherBytes: number } {
  const s = readStorage(storage);
  let cardsBytes = 0;
  let otherBytes = 0;
  for (const k of scopeKeys(s)) {
    const v = s.getItem(k) ?? "";
    if (k === KEYS.myCards) cardsBytes = byteSize(v);
    else otherBytes += byteSize(k) + byteSize(v);
  }
  return { cardsBytes, cardCount: countCards(s.getItem(KEYS.myCards)), otherBytes };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** `med-forge-backup-YYYY-MM-DD.json` in local time. */
export function backupFileName(now: number = Date.now()): string {
  const d = new Date(now);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `med-forge-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
}

/** Pretty JSON for the backup file. */
export function backupToFile(b: Backup): string {
  return JSON.stringify(b, null, 2) + "\n";
}

// ── Save string encoding ─────────────────────────────────────────────────────

const hasCompression = () => typeof globalThis.CompressionStream === "function";
const hasDecompression = () => typeof globalThis.DecompressionStream === "function";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new BackupError("This save string has characters that don't belong in it. Copy it again in one piece.");
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  let bin: string;
  try {
    bin = atob(b64);
  } catch {
    throw new BackupError("This save string is damaged (it may have been cut off). Copy it again in one piece.");
  }
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Pipe bytes through a (de)compression stream, stopping at `max` output bytes. */
async function transform(bytes: Uint8Array, stream: CompressionStream | DecompressionStream, max: number): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  void writer.write(bytes as Uint8Array<ArrayBuffer>).then(() => writer.close()).catch(() => {});
  const reader = stream.readable.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > max) {
      await reader.cancel().catch(() => {});
      throw new BackupError(`This save is larger than ${formatBytes(max)} once unpacked, which is more than a browser can hold.`);
    }
    parts.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/**
 * The single-line save string: `MF1.z.` + base64url(deflate-raw(JSON)) when the browser has
 * CompressionStream, otherwise `MF1.j.` + base64url(JSON).
 */
export async function encodeSaveString(b: Backup): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(b));
  if (hasCompression()) {
    try {
      const packed = await transform(json, new CompressionStream("deflate-raw"), Number.MAX_SAFE_INTEGER);
      return `${SAVE_PREFIX}z.${toBase64Url(packed)}`;
    } catch {
      // Fall through to the uncompressed form.
    }
  }
  return `${SAVE_PREFIX}j.${toBase64Url(json)}`;
}

async function decodeSaveString(input: string): Promise<unknown> {
  const s = input.replace(/\s+/g, "");
  if (!s.startsWith(SAVE_PREFIX)) {
    if (/^MF\d+\./.test(s)) throw new BackupError("This save string was made by a newer version of MedForge. Update the page (reload it) and try again.");
    throw new BackupError("That isn't a MedForge save string. Save strings start with “MF1.”.");
  }
  const rest = s.slice(SAVE_PREFIX.length);
  const method = rest.slice(0, 2);
  if (method !== "z." && method !== "j.") throw new BackupError("This save string is damaged: the part after “MF1.” should start with “z.” or “j.”.");
  let bytes = fromBase64Url(rest.slice(2));
  if (method === "z.") {
    if (!hasDecompression()) {
      throw new BackupError("This browser can't unpack compressed save strings. Use the backup file instead, or a current version of Chrome, Edge, Firefox or Safari.");
    }
    try {
      bytes = await transform(bytes, new DecompressionStream("deflate-raw"), LIMITS.jsonBytes);
    } catch (e) {
      if (e instanceof BackupError) throw e;
      throw new BackupError("This save string is damaged (it may have been cut off or changed). Copy it again in one piece.");
    }
  }
  if (bytes.length > LIMITS.jsonBytes) throw new BackupError(`This save is larger than ${formatBytes(LIMITS.jsonBytes)}, which is more than a browser can hold.`);
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  } catch {
    throw new BackupError("This save string is damaged (it may have been cut off or changed). Copy it again in one piece.");
  }
}

// ── Read + validate ──────────────────────────────────────────────────────────

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const parseJson = (v: string): unknown => {
  try {
    return JSON.parse(v) as unknown;
  } catch {
    return undefined;
  }
};

/** Why a stored value can't be accepted, or null when it's fine. */
function valueProblem(key: string, value: string): string | null {
  if (key === KEYS.examDate) return /^\d{4}-\d{2}-\d{2}$/.test(value) ? null : "the exam date isn't a YYYY-MM-DD date";
  if (key === KEYS.lectureRate || key.startsWith(LECTURE_POS_PREFIX)) return Number.isFinite(Number(value)) && value.trim() !== "" ? null : "it isn't a number";
  const v = parseJson(value);
  if (v === undefined) return "it isn't valid JSON";
  if (key === KEYS.progress) return isObj(v) && (v.questions === undefined || isObj(v.questions)) ? null : "study progress has the wrong shape";
  if (key === KEYS.packs) return Array.isArray(v) ? null : "imported course packs should be a list";
  if (key === KEYS.notebook) return isObj(v) && Array.isArray(v.posts) ? null : "notebook posts have the wrong shape";
  if (key === KEYS.myCards) return Array.isArray(v) || (isObj(v) && Array.isArray(v.cards)) ? null : "snipped cards have the wrong shape";
  if (key.startsWith(SCRATCH_PREFIX)) return Array.isArray(v) || (isObj(v) && Array.isArray(v.strokes)) ? null : "a scratchpad has the wrong shape";
  return null;
}

/** Check an untrusted parsed object and return it as a Backup, or throw a BackupError. */
export function validateBackup(raw: unknown): Backup {
  if (!isObj(raw) || raw.format !== BACKUP_FORMAT) {
    if (isObj(raw) && typeof raw.format === "string" && raw.format.startsWith("study-forge-")) {
      throw new BackupError("This is a different MedForge export (for one feature, not a full backup). Import it from the page that made it.");
    }
    throw new BackupError("That isn't a MedForge backup.");
  }
  if (typeof raw.version !== "number" || !Number.isInteger(raw.version) || raw.version < 1) throw new BackupError("This backup has no valid version number.");
  if (raw.version > BACKUP_VERSION) throw new BackupError(`This backup was made by a newer version of MedForge (format ${raw.version}). Reload the page to update, then try again.`);
  if (!isObj(raw.data)) throw new BackupError("This backup has no saved data in it.");
  const entries = Object.entries(raw.data);
  if (entries.length > LIMITS.keys) throw new BackupError(`This backup has too many entries (${entries.length.toLocaleString()}).`);
  const data: Record<string, string> = {};
  let total = 0;
  for (const [k, v] of entries) {
    if (k === KEYS.settings) throw new BackupError("This backup contains settings. MedForge never restores settings (they hold API keys), so it won't load this file.");
    if (!isBackupKey(k)) throw new BackupError(`This backup contains an entry MedForge doesn't know (“${k.slice(0, 80)}”), so nothing was restored.`);
    if (typeof v !== "string") throw new BackupError(`An entry in this backup (“${k}”) isn't text, so nothing was restored.`);
    if (v.length > LIMITS.valueChars) throw new BackupError(`An entry in this backup (“${k}”) is too large (${formatBytes(v.length)}).`);
    total += v.length;
    if (total > LIMITS.totalChars) throw new BackupError(`This backup is too large (over ${formatBytes(LIMITS.totalChars)}).`);
    const problem = valueProblem(k, v);
    if (problem) throw new BackupError(`An entry in this backup (“${k}”) is damaged: ${problem}. Nothing was restored.`);
    data[k] = v;
  }
  const createdAt = typeof raw.createdAt === "string" && !Number.isNaN(Date.parse(raw.createdAt)) ? raw.createdAt : new Date(0).toISOString();
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, createdAt, data };
}

/** A pasted save string or the text of a backup file, checked and ready to restore. */
export async function readBackup(input: string): Promise<Backup> {
  if (input.length > LIMITS.inputChars) throw new BackupError(`That's too large to be a MedForge backup (over ${formatBytes(LIMITS.inputChars)}).`);
  const text = input.replace(/^﻿/, "").trim();
  if (!text) throw new BackupError("Paste a save string or choose a backup file first.");
  if (text.startsWith("{")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new BackupError("This backup file is damaged (it isn't valid JSON). Try downloading it again.");
    }
    return validateBackup(parsed);
  }
  return validateBackup(await decodeSaveString(text));
}

// ── Preview ──────────────────────────────────────────────────────────────────

export interface BackupSummary {
  createdAt: string;
  /** Questions/terms with saved progress. */
  questions: number;
  /** Of those, how many have been graded at least once. */
  reviewed: number;
  labs: number;
  cases: number;
  skills: number;
  notebookPosts: number;
  packs: string[];
  examDate: string | null;
  scratchpads: number;
  lecturePositions: number;
  /** null when the backup doesn't include snipped cards. */
  myCards: number | null;
  bytes: number;
}

function countCards(raw: string | null): number {
  const v = raw ? parseJson(raw) : undefined;
  const list = Array.isArray(v) ? v : isObj(v) && Array.isArray(v.cards) ? v.cards : [];
  return list.length;
}

const size = (v: unknown) => (isObj(v) ? Object.keys(v).length : 0);

/** What a backup contains, for the preview before restoring. */
export function describeBackup(b: Backup): BackupSummary {
  const progress = parseJson(b.data[KEYS.progress] ?? "{}");
  const p = isObj(progress) ? progress : {};
  const questions = isObj(p.questions) ? Object.values(p.questions) : [];
  const packsRaw = parseJson(b.data[KEYS.packs] ?? "[]");
  const packs = Array.isArray(packsRaw)
    ? packsRaw.map((c) => (isObj(c) ? String(c.title ?? c.id ?? "Untitled course") : "Untitled course"))
    : [];
  const nb = parseJson(b.data[KEYS.notebook] ?? "{}");
  const keys = Object.keys(b.data);
  return {
    createdAt: b.createdAt,
    questions: questions.length,
    reviewed: questions.filter((q) => isObj(q) && typeof q.attempts === "number" && q.attempts > 0).length,
    labs: size(p.labs),
    cases: size(p.cases),
    skills: size(p.skills),
    notebookPosts: isObj(nb) && Array.isArray(nb.posts) ? nb.posts.length : 0,
    packs,
    examDate: b.data[KEYS.examDate] ?? null,
    scratchpads: keys.filter((k) => k.startsWith(SCRATCH_PREFIX)).length,
    lecturePositions: keys.filter((k) => k.startsWith(LECTURE_POS_PREFIX)).length,
    myCards: KEYS.myCards in b.data ? countCards(b.data[KEYS.myCards]!) : null,
    bytes: byteSize(JSON.stringify(b)),
  };
}

/** The same summary for what's in this browser now (cards always counted). */
export function describeStorage(storage: BackupStorage | null): BackupSummary {
  return describeBackup(collectBackup(storage, { includeCards: true }));
}

// ── Merge ────────────────────────────────────────────────────────────────────

const reviewedAt = (s: unknown): number => {
  const x = s as Partial<Sm2> | null;
  if (!x || typeof x.interval !== "number" || typeof x.due !== "number") return -Infinity;
  return lastReviewedAt(x as Sm2);
};

/** Per question: the more recently graded copy wins; if neither tells, the one with more attempts; ties keep this device's. */
function newerQuestion(local: QuestionProgress, incoming: QuestionProgress): QuestionProgress {
  const a = reviewedAt(local.sm2);
  const b = reviewedAt(incoming.sm2);
  if (a !== b) return b > a ? incoming : local;
  return (incoming.attempts ?? 0) > (local.attempts ?? 0) ? incoming : local;
}

const unionSteps = (a: unknown, b: unknown): number[] =>
  [...new Set([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])].filter((n): n is number => typeof n === "number"))].sort((x, y) => x - y);

function mergeProgress(localRaw: string, incomingRaw: string): string {
  const empty = (): Progress => ({ questions: {}, labs: {}, cases: {}, skills: {} });
  const read = (raw: string): Progress => {
    const v = parseJson(raw);
    if (!isObj(v)) return empty();
    const p = empty();
    for (const k of ["questions", "labs", "cases", "skills"] as const) if (isObj(v[k])) (p as unknown as Record<string, unknown>)[k] = v[k];
    return p;
  };
  const a = read(localRaw);
  const b = read(incomingRaw);
  const out: Progress = { ...b, ...a, questions: { ...a.questions }, labs: { ...a.labs }, cases: { ...a.cases }, skills: { ...a.skills } };
  for (const [id, q] of Object.entries(b.questions)) {
    const mine = out.questions[id];
    out.questions[id] = mine && isObj(mine) ? newerQuestion(mine, q) : q;
  }
  for (const [id, steps] of Object.entries(b.labs)) out.labs[id] = unionSteps(out.labs[id], steps);
  for (const [id, steps] of Object.entries(b.skills)) out.skills[id] = unionSteps(out.skills[id], steps);
  for (const [id, c] of Object.entries(b.cases)) {
    const mine = out.cases[id];
    const ratio = (x: { score: number; max: number }) => (x.max > 0 ? x.score / x.max : 0);
    if (!mine || ratio(c) > ratio(mine) || (ratio(c) === ratio(mine) && (c.at ?? 0) > (mine.at ?? 0))) out.cases[id] = c;
  }
  return JSON.stringify(out);
}

/** Union by id; `pick` decides when both sides have the same id. Order: this device's first, then new ones. */
function unionById<T>(local: unknown[], incoming: unknown[], pick: (a: T, b: T) => T): T[] {
  const out = new Map<string, T>();
  const extra: T[] = [];
  for (const x of local) {
    if (isObj(x) && typeof x.id === "string") out.set(x.id, x as T);
    else extra.push(x as T);
  }
  for (const x of incoming) {
    if (!isObj(x) || typeof x.id !== "string") continue;
    const mine = out.get(x.id);
    out.set(x.id, mine === undefined ? (x as T) : pick(mine, x as T));
  }
  return [...out.values(), ...extra];
}

function mergeNotebook(localRaw: string, incomingRaw: string): string {
  const posts = (raw: string) => {
    const v = parseJson(raw);
    return isObj(v) && Array.isArray(v.posts) ? v.posts : [];
  };
  type Post = { id: string; createdAt?: number; replies?: { id: string; createdAt?: number }[] };
  const activity = (p: Post) => Math.max(p.createdAt ?? 0, ...(p.replies ?? []).map((r) => r.createdAt ?? 0));
  const merged = unionById<Post>(posts(localRaw), posts(incomingRaw), (a, b) => {
    const base = activity(b) > activity(a) ? b : a;
    const replies = unionById<{ id: string; createdAt?: number }>(a.replies ?? [], b.replies ?? [], (x) => x).sort(
      (x, y) => (x.createdAt ?? 0) - (y.createdAt ?? 0),
    );
    return { ...base, replies };
  });
  const v = parseJson(localRaw);
  const head = isObj(v) ? v : parseJson(incomingRaw);
  return JSON.stringify({ ...(isObj(head) ? head : { format: "study-forge-notebook", version: 1 }), posts: merged });
}

function mergeCards(localRaw: string, incomingRaw: string): string {
  const read = (raw: string) => {
    const v = parseJson(raw);
    return Array.isArray(v) ? v : isObj(v) && Array.isArray(v.cards) ? v.cards : [];
  };
  type Card = { id: string; sm2?: Sm2 };
  const cards = unionById<Card>(read(localRaw), read(incomingRaw), (a, b) => (reviewedAt(b.sm2) > reviewedAt(a.sm2) ? b : a));
  return JSON.stringify({ format: "study-forge-my-cards", version: 1, cards });
}

function mergePacks(localRaw: string, incomingRaw: string): string {
  const read = (raw: string) => {
    const v = parseJson(raw);
    return Array.isArray(v) ? v : [];
  };
  // Packs carry no timestamps: the backup's copy of a course replaces this device's copy.
  return JSON.stringify(unionById<unknown>(read(localRaw), read(incomingRaw), (_a, b) => b));
}

/** The merged value for one key. Anything without its own rule: the backup's value wins. */
function mergeValue(key: string, local: string, incoming: string): string {
  if (key === KEYS.progress) return mergeProgress(local, incoming);
  if (key === KEYS.notebook) return mergeNotebook(local, incoming);
  if (key === KEYS.myCards) return mergeCards(local, incoming);
  if (key === KEYS.packs) return mergePacks(local, incoming);
  return incoming;
}

// ── Write (all or nothing) ───────────────────────────────────────────────────

/** key → new value, or null to remove. */
type Plan = Map<string, string | null>;

const isQuota = (e: unknown) => {
  const err = e as { name?: string; code?: number } | null;
  return !!err && (/quota/i.test(err.name ?? "") || err.code === 22 || err.code === 1014);
};

function applyPlan(storage: BackupStorage, plan: Plan): void {
  const before = new Map<string, string | null>();
  for (const k of plan.keys()) before.set(k, storage.getItem(k));
  // Removals first so a replace frees space before the big writes.
  const order = [...plan.entries()].sort(([, a], [, b]) => (a === null ? 0 : 1) - (b === null ? 0 : 1));
  try {
    for (const [k, v] of order) {
      if (v === null) storage.removeItem(k);
      else storage.setItem(k, v);
    }
  } catch (e) {
    for (const [k, v] of before) {
      try {
        if (v === null) storage.removeItem(k);
        else storage.setItem(k, v);
      } catch {
        // Best effort: the old value fitted before, so this normally succeeds.
      }
    }
    throw new BackupError(
      isQuota(e)
        ? "This browser's storage is full, so nothing was changed. Try restoring without snipped cards, or delete some snipped cards first."
        : "This browser blocked writing to site storage, so nothing was changed.",
    );
  }
}

export interface RestoreResult {
  written: number;
  removed: number;
}

/**
 * Restore a checked backup.
 * - replace: this device's saved study data becomes exactly the backup's. Snipped cards are left
 *   alone when the backup doesn't include them. Settings are never touched.
 * - merge: keys only on this device stay; keys only in the backup are added; keys on both are
 *   merged (progress per question by most recent review, labs/skills union, best case score,
 *   notebook/cards/packs union by id) and for everything else the backup's value wins.
 */
export function restoreBackup(storage: BackupStorage | null, backup: Backup, mode: RestoreMode): RestoreResult {
  const s = readStorage(storage);
  const b = validateBackup(backup);
  const plan: Plan = new Map();
  if (mode === "replace") {
    for (const k of scopeKeys(s)) {
      if (k === KEYS.myCards && !(KEYS.myCards in b.data)) continue;
      if (!(k in b.data)) plan.set(k, null);
    }
    for (const [k, v] of Object.entries(b.data)) plan.set(k, v);
  } else {
    for (const [k, v] of Object.entries(b.data)) {
      const local = s.getItem(k);
      plan.set(k, local ? mergeValue(k, local, v) : v);
    }
  }
  for (const [k, v] of [...plan]) if (v !== null && s.getItem(k) === v) plan.delete(k);
  applyPlan(s, plan);
  const removed = [...plan.values()].filter((v) => v === null).length;
  return { written: plan.size - removed, removed };
}

// ── Clean slate ──────────────────────────────────────────────────────────────

export interface CleanSlateOptions {
  /** Delete snipped cards too. Otherwise they stay, with fresh (never-reviewed) schedules. */
  deleteCards: boolean;
  now?: number;
}

/**
 * Reset personal work for sharing a device or handing over a copy: study progress (questions,
 * SM-2 schedules, answers, labs, cases, skills, terms), notebook posts, scratchpads, exam date and
 * lecture positions. Imported course packs, built-in courses, the lecture speed and settings stay.
 */
export function cleanSlate(storage: BackupStorage | null, opts: CleanSlateOptions): RestoreResult {
  const s = readStorage(storage);
  const plan: Plan = new Map();
  for (const k of scopeKeys(s)) {
    if (k === KEYS.packs || k === KEYS.lectureRate) continue;
    if (k === KEYS.myCards) {
      if (opts.deleteCards) plan.set(k, null);
      else {
        const v = parseJson(s.getItem(k) ?? "");
        const list = Array.isArray(v) ? v : isObj(v) && Array.isArray(v.cards) ? v.cards : [];
        const now = opts.now ?? Date.now();
        const cards = list.filter(isObj).map((c) => {
          const { lastGrade: _drop, ...rest } = c;
          return { ...rest, sm2: NEW_SM2(now) };
        });
        plan.set(k, JSON.stringify({ format: "study-forge-my-cards", version: 1, cards }));
      }
      continue;
    }
    plan.set(k, null);
  }
  applyPlan(s, plan);
  const removed = [...plan.values()].filter((v) => v === null).length;
  return { written: plan.size - removed, removed };
}
