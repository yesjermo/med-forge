/**
 * Study progress kept in this browser: question status + SM-2 schedule, lab steps,
 * case scores and skill checklists. Works in memory if storage is blocked.
 */

export type QuestionStatus = "unattempted" | "needs_review" | "mastered";

export interface Sm2 {
  /** Ease factor, starts at 2.5, never below 1.3. */
  ef: number;
  /** Days until the next review. */
  interval: number;
  /** Successful reviews in a row. */
  reps: number;
  /** Next review time (ms since epoch). */
  due: number;
}

export interface QuestionProgress {
  status: QuestionStatus;
  sm2: Sm2;
  lastGrade?: number;
  myAnswer?: string;
  attempts: number;
}

export interface Progress {
  questions: Record<string, QuestionProgress>;
  labs: Record<string, number[]>;
  cases: Record<string, { score: number; max: number; at: number }>;
  skills: Record<string, number[]>;
}

const DAY = 24 * 60 * 60 * 1000;
// Browser-storage keys and export formats keep the original "study-forge" prefix (the app was renamed
// to MedForge), so students' saved progress and exported files keep working.
export const STORAGE_KEY = "study-forge:med-progress";

/** The SM-2 recall scale, 0–5: grade, label, what it means. Below 3 the card comes back tomorrow. */
export const GRADES: readonly (readonly [number, string, string])[] = [
  [0, "Blankout", "no memory of it"],
  [1, "Wrong", "wrong, but the answer looked familiar"],
  [2, "Hard", "wrong, but close"],
  [3, "OK", "right, with real effort"],
  [4, "Good", "right after a short pause"],
  [5, "Mastered 🎉", "instant and certain"],
];

export const NEW_SM2 = (now: number): Sm2 => ({ ef: 2.5, interval: 0, reps: 0, due: now });

/**
 * SuperMemo-2. grade: 0 (blank) … 5 (perfect). Grades below 3 restart the item tomorrow;
 * 3+ grows the interval (1 day, 6 days, then × ease factor).
 */
export function sm2(prev: Sm2, grade: number, now: number): Sm2 {
  const q = Math.max(0, Math.min(5, Math.round(grade)));
  const ef = Math.max(1.3, prev.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  if (q < 3) return { ef, interval: 1, reps: 0, due: now + DAY };
  const reps = prev.reps + 1;
  const interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(prev.interval * ef);
  return { ef, interval, reps, due: now + interval * DAY };
}

/** When the item was last graded (every grade sets due = grade time + interval days); -Infinity if never. */
export function lastReviewedAt(s: Sm2): number {
  return s.interval > 0 ? s.due - s.interval * DAY : -Infinity;
}

/** Status shown on the dashboard from the latest grade. */
export function statusFor(grade: number, reps: number): QuestionStatus {
  if (grade < 3) return "needs_review";
  return grade >= 4 && reps >= 2 ? "mastered" : "needs_review";
}

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function createProgress(storage: StorageLike | null, now: () => number = Date.now) {
  let data: Progress = { questions: {}, labs: {}, cases: {}, skills: {} };
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (raw) data = { ...data, ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    // Unreadable or blocked storage: start fresh in memory.
  }
  const save = () => {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Keep working in memory.
    }
  };

  return {
    question(id: string): QuestionProgress | undefined {
      return data.questions[id];
    },

    /** Record a self-graded attempt (0–5) and reschedule. */
    grade(id: string, grade: number, myAnswer?: string): QuestionProgress {
      const prev = data.questions[id];
      const next = sm2(prev?.sm2 ?? NEW_SM2(now()), grade, now());
      const entry: QuestionProgress = {
        status: statusFor(grade, next.reps),
        sm2: next,
        lastGrade: grade,
        attempts: (prev?.attempts ?? 0) + 1,
        ...(myAnswer !== undefined ? { myAnswer } : prev?.myAnswer !== undefined ? { myAnswer: prev.myAnswer } : {}),
      };
      data.questions[id] = entry;
      save();
      return entry;
    },

    /** Question ids due by `at` (default now), oldest due first. Unattempted questions aren't "due". */
    due(ids: string[], at?: number): string[] {
      const t = at ?? now();
      return ids
        .filter((id) => {
          const p = data.questions[id];
          return p && p.sm2.due <= t;
        })
        .sort((a, b) => data.questions[a]!.sm2.due - data.questions[b]!.sm2.due);
    },

    counts(ids: string[]): Record<QuestionStatus, number> {
      const c = { unattempted: 0, needs_review: 0, mastered: 0 };
      for (const id of ids) c[data.questions[id]?.status ?? "unattempted"]++;
      return c;
    },

    labSteps(id: string): number[] {
      return data.labs[id] ?? [];
    },
    toggleLabStep(id: string, step: number): number[] {
      const cur = new Set(data.labs[id] ?? []);
      cur.has(step) ? cur.delete(step) : cur.add(step);
      data.labs[id] = [...cur].sort((a, b) => a - b);
      save();
      return data.labs[id]!;
    },

    caseResult(id: string) {
      return data.cases[id];
    },
    saveCase(id: string, score: number, max: number): void {
      const best = data.cases[id];
      if (!best || score / max >= best.score / best.max) data.cases[id] = { score, max, at: now() };
      save();
    },

    skillChecks(id: string): number[] {
      return data.skills[id] ?? [];
    },
    toggleSkill(id: string, item: number): number[] {
      const cur = new Set(data.skills[id] ?? []);
      cur.has(item) ? cur.delete(item) : cur.add(item);
      data.skills[id] = [...cur].sort((a, b) => a - b);
      save();
      return data.skills[id]!;
    },

    reset(): void {
      data = { questions: {}, labs: {}, cases: {}, skills: {} };
      save();
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgress>;
