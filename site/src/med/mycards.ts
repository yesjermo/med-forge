/**
 * "My cards": question cards a student snipped from their own exam papers and tutorial sheets
 * (an image crop, an optional answer), scheduled with the same SM-2 as course questions.
 * Kept in this browser only. Works in memory if storage is blocked; a full storage is reported
 * as MyCardsFullError so the page can tell the student, and the change is not applied.
 */
import { NEW_SM2, sm2, type Sm2, type StorageLike } from "./progress";

export interface MyCard {
  id: string;
  createdAt: number;
  course: string;
  title: string;
  /** Image data URL (webp/jpeg, compressed). */
  front: string;
  frontNote?: string;
  /** Optional answer image data URL. */
  back?: string;
  /** Optional answer text. */
  answer?: string;
  /** File name + page. */
  source?: string;
  sm2: Sm2;
  lastGrade?: number;
}

export const MY_CARDS_KEY = "study-forge:my-cards";
const EXPORT_FORMAT = "study-forge-my-cards";

/** Browser storage is full (images are big). Nothing was changed. */
export class MyCardsFullError extends Error {
  constructor() {
    super(
      "This browser's storage is full, so the card wasn't saved. Delete some cards (or export them to a file first), or crop a smaller area.",
    );
    this.name = "MyCardsFullError";
  }
}

const isQuota = (e: unknown) => {
  const err = e as { name?: string; code?: number } | null;
  return !!err && (/quota/i.test(err.name ?? "") || err.code === 22 || err.code === 1014);
};

const isImageUrl = (v: unknown): v is string => typeof v === "string" && /^data:image\/(webp|jpeg|png|gif|avif);base64,/i.test(v);
const optString = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function validSm2(v: unknown): Sm2 | undefined {
  const s = v as Partial<Sm2> | null;
  if (!s || !num(s.ef) || !num(s.interval) || !num(s.reps) || !num(s.due)) return undefined;
  return { ef: Math.max(1.3, s.ef), interval: Math.max(0, s.interval), reps: Math.max(0, Math.round(s.reps)), due: s.due };
}

/** A clean card from untrusted JSON, or undefined. Images must be data:image URLs. */
function cleanCard(v: unknown, now: number): MyCard | undefined {
  const c = v as Record<string, unknown> | null;
  if (!c || typeof c !== "object" || typeof c.id !== "string" || !c.id || !isImageUrl(c.front)) return undefined;
  const card: MyCard = {
    id: c.id,
    createdAt: num(c.createdAt) ? c.createdAt : now,
    course: typeof c.course === "string" ? c.course : "",
    title: typeof c.title === "string" && c.title.trim() ? c.title : "Untitled question",
    front: c.front,
    sm2: validSm2(c.sm2) ?? NEW_SM2(now),
  };
  const frontNote = optString(c.frontNote);
  const answer = optString(c.answer);
  const source = optString(c.source);
  if (frontNote) card.frontNote = frontNote;
  if (isImageUrl(c.back)) card.back = c.back;
  if (answer) card.answer = answer;
  if (source) card.source = source;
  if (num(c.lastGrade)) card.lastGrade = c.lastGrade;
  return card;
}

const copy = (c: MyCard): MyCard => ({ ...c, sm2: { ...c.sm2 } });

function newId(now: number): string {
  const rand =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `mc-${now.toString(36)}-${rand}`;
}

export function createMyCards(storage: StorageLike | null, now: () => number = Date.now) {
  let cards: MyCard[] = [];
  /** Last JSON read from or written to storage; lets several instances (and tabs) stay in step. */
  let lastRaw: string | null = null;
  let blocked = !storage;

  const sync = () => {
    if (blocked) return;
    let raw: string | null;
    try {
      raw = storage!.getItem(MY_CARDS_KEY);
    } catch {
      blocked = true; // Storage blocked: carry on in memory.
      return;
    }
    if (raw === lastRaw) return;
    lastRaw = raw;
    cards = [];
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      const list = Array.isArray(parsed) ? parsed : (parsed as { cards?: unknown })?.cards;
      if (Array.isArray(list)) cards = list.map((c) => cleanCard(c, now())).filter((c): c is MyCard => !!c);
    } catch {
      // Corrupt JSON: start empty (the bad value is overwritten on the next save).
    }
  };

  /** Persist `next`. Throws MyCardsFullError (and keeps the old cards) when storage is full. */
  const commit = (next: MyCard[], strict: boolean) => {
    if (!blocked) {
      const raw = JSON.stringify({ format: EXPORT_FORMAT, version: 1, cards: next });
      try {
        storage!.setItem(MY_CARDS_KEY, raw);
        lastRaw = raw;
      } catch (e) {
        if (isQuota(e)) {
          if (strict) throw new MyCardsFullError();
        } else {
          blocked = true; // e.g. SecurityError: keep working in memory.
        }
      }
    }
    cards = next;
  };

  const find = (id: string) => cards.find((c) => c.id === id);

  return {
    /** Newest first. */
    list(): MyCard[] {
      sync();
      return [...cards].sort((a, b) => b.createdAt - a.createdAt).map(copy);
    },

    get(id: string): MyCard | undefined {
      sync();
      const c = find(id);
      return c && copy(c);
    },

    /** New cards are due straight away. Throws MyCardsFullError if storage is full. */
    add(c: Omit<MyCard, "id" | "createdAt" | "sm2">): MyCard {
      sync();
      const t = now();
      const card = cleanCard({ ...c, id: newId(t), createdAt: t, sm2: NEW_SM2(t), lastGrade: undefined }, t);
      if (!card) throw new Error("A card needs a question image (an image data URL).");
      if (c.title?.trim()) card.title = c.title.trim();
      card.course = (c.course ?? "").trim();
      commit([...cards, card], true);
      return copy(card);
    },

    /** Empty strings or undefined clear the optional fields. Throws MyCardsFullError if storage is full. */
    update(id: string, patch: Partial<Pick<MyCard, "title" | "course" | "frontNote" | "answer" | "back">>): void {
      sync();
      const cur = find(id);
      if (!cur) return;
      const next: MyCard = copy(cur);
      if ("title" in patch) next.title = patch.title?.trim() || cur.title;
      if ("course" in patch) next.course = (patch.course ?? "").trim();
      for (const key of ["frontNote", "answer"] as const) {
        if (!(key in patch)) continue;
        const v = optString(patch[key]);
        if (v) next[key] = v;
        else delete next[key];
      }
      if ("back" in patch) {
        if (isImageUrl(patch.back)) next.back = patch.back;
        else if (!patch.back) delete next.back;
        else throw new Error("The answer image must be an image data URL.");
      }
      commit(cards.map((c) => (c.id === id ? next : c)), true);
    },

    remove(id: string): void {
      sync();
      commit(cards.filter((c) => c.id !== id), false);
    },

    /** Cards due at `at` (default now), most overdue first. */
    due(at?: number): MyCard[] {
      sync();
      const t = at ?? now();
      return cards
        .filter((c) => c.sm2.due <= t)
        .sort((a, b) => a.sm2.due - b.sm2.due)
        .map(copy);
    },

    /**
     * Self-grade 0–5 and reschedule with SM-2. Never throws for a full storage (the new schedule
     * is kept in memory); throws for an unknown id.
     */
    rate(id: string, grade: number): MyCard {
      sync();
      const cur = find(id);
      if (!cur) throw new Error(`No card with id ${id}`);
      const g = Math.max(0, Math.min(5, Math.round(grade)));
      const next: MyCard = { ...copy(cur), sm2: sm2(cur.sm2, g, now()), lastGrade: g };
      commit(cards.map((c) => (c.id === id ? next : c)), false);
      return copy(next);
    },

    exportJson(): string {
      sync();
      return JSON.stringify({ format: EXPORT_FORMAT, version: 1, exportedAt: new Date(now()).toISOString(), cards });
    },

    /**
     * Add the cards from an export file; returns how many were added. Cards whose id is already
     * here are skipped, so importing the same file twice is harmless. Throws for a file that isn't
     * a cards export, or MyCardsFullError (nothing imported) when storage is full.
     */
    importJson(text: string): number {
      sync();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("That file isn't valid JSON.");
      }
      const list = Array.isArray(parsed) ? parsed : (parsed as { cards?: unknown } | null)?.cards;
      if (!Array.isArray(list)) throw new Error("That file doesn't contain any cards.");
      const have = new Set(cards.map((c) => c.id));
      const valid = list.map((raw) => cleanCard(raw, now())).filter((c): c is MyCard => !!c);
      if (list.length > 0 && valid.length === 0) {
        throw new Error("No usable cards in that file (each card needs an id and a question image).");
      }
      const added: MyCard[] = [];
      for (const c of valid) {
        if (have.has(c.id)) continue;
        have.add(c.id);
        added.push(c);
      }
      if (added.length) commit([...cards, ...added], true);
      return added.length;
    },
  };
}

export type MyCardsStore = ReturnType<typeof createMyCards>;
