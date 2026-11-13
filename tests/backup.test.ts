import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BACKUP_FORMAT,
  BackupError,
  backupFileName,
  backupToFile,
  cleanSlate,
  collectBackup,
  describeBackup,
  encodeSaveString,
  isBackupKey,
  KEYS,
  readBackup,
  restoreBackup,
  SAVE_PREFIX,
  type Backup,
} from "../site/src/med/backup";
import { MY_CARDS_KEY } from "../site/src/med/mycards";
import { PACKS_STORAGE_KEY } from "../site/src/med/packs";
import { STORAGE_KEY as PROGRESS_KEY } from "../site/src/med/progress";
import { STORAGE_PREFIX as SCRATCH_KEY_PREFIX } from "../site/src/med/scratchpad/strokes";
import { STORAGE_KEY as NOTEBOOK_KEY } from "../site/src/notebook";
import { SETTINGS_KEY } from "../site/src/settings";

const DAY = 86_400_000;

/** In-memory Storage with an optional character quota. */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  constructor(public quota = Infinity) {}
  get length() {
    return this.map.size;
  }
  key(i: number) {
    return [...this.map.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    const used = [...this.map].reduce((n, [key, val]) => n + (key === k ? 0 : key.length + val.length), 0);
    if (used + k.length + v.length > this.quota) {
      const e = new Error("quota");
      e.name = "QuotaExceededError";
      throw e;
    }
    this.map.set(k, String(v));
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
  clear() {
    this.map.clear();
  }
  dump() {
    return Object.fromEntries(this.map);
  }
}

const q = (due: number, interval: number, attempts: number, myAnswer?: string) => ({
  status: "needs_review",
  sm2: { ef: 2.5, interval, reps: 1, due },
  attempts,
  ...(myAnswer ? { myAnswer } : {}),
});

const NOW = Date.UTC(2026, 10, 12, 12);

function seeded() {
  const s = new MemoryStorage();
  s.setItem(PROGRESS_KEY, JSON.stringify({ questions: { q1: q(NOW + DAY, 1, 1, "my answer"), term1: q(NOW + 6 * DAY, 6, 2) }, labs: { lab1: [0, 2] }, cases: { c1: { score: 3, max: 5, at: NOW } }, skills: { s1: [1] } }));
  s.setItem(PACKS_STORAGE_KEY, JSON.stringify([{ id: "pack-a", title: "Pack A" }]));
  s.setItem(NOTEBOOK_KEY, JSON.stringify({ format: "study-forge-notebook", version: 1, posts: [{ id: "p1", title: "Mine", createdAt: NOW, replies: [] }] }));
  s.setItem(KEYS.examDate, "2027-01-15");
  s.setItem(SCRATCH_KEY_PREFIX + "q1", JSON.stringify({ v: 1, strokes: [] }));
  s.setItem("study-forge:lecture-pos:l1", "93");
  s.setItem(MY_CARDS_KEY, JSON.stringify({ format: "study-forge-my-cards", version: 1, cards: [{ id: "mc1", front: "data:image/webp;base64,AAAA", sm2: { ef: 2.5, interval: 1, reps: 1, due: NOW }, lastGrade: 4 }] }));
  s.setItem(SETTINGS_KEY, JSON.stringify({ writer: "openai", apiKeys: { openai: "sk-secret-123" }, perplexityKey: "pplx-secret", openalexKey: "oa-secret" }));
  s.setItem("other-app:thing", "x");
  return s;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("key constants", () => {
  it("match the stores' own keys", () => {
    expect(KEYS.progress).toBe(PROGRESS_KEY);
    expect(KEYS.packs).toBe(PACKS_STORAGE_KEY);
    expect(KEYS.notebook).toBe(NOTEBOOK_KEY);
    expect(KEYS.myCards).toBe(MY_CARDS_KEY);
    expect(KEYS.settings).toBe(SETTINGS_KEY);
    expect(isBackupKey(SCRATCH_KEY_PREFIX + "x")).toBe(true);
    expect(isBackupKey(SETTINGS_KEY)).toBe(false);
    expect(isBackupKey(SCRATCH_KEY_PREFIX)).toBe(false);
  });
});

describe("collect", () => {
  it("never exports settings or API keys, and skips other apps' keys", async () => {
    const s = seeded();
    for (const includeCards of [true, false]) {
      const b = collectBackup(s, { includeCards, now: NOW });
      expect(b.format).toBe(BACKUP_FORMAT);
      expect(b.version).toBe(1);
      expect(b.data[SETTINGS_KEY]).toBeUndefined();
      expect(b.data["other-app:thing"]).toBeUndefined();
      const text = backupToFile(b) + (await encodeSaveString(b));
      expect(backupToFile(b)).not.toMatch(/secret/);
      expect(text).not.toContain("sk-secret");
      expect(KEYS.myCards in b.data).toBe(includeCards);
    }
  });

  it("names the file by date", () => {
    expect(backupFileName(new Date(2026, 0, 5).getTime())).toBe("med-forge-backup-2026-01-05.json");
  });

  it("summarises what's inside", () => {
    const sum = describeBackup(collectBackup(seeded(), { includeCards: true, now: NOW }));
    expect(sum).toMatchObject({ questions: 2, reviewed: 2, labs: 1, cases: 1, skills: 1, notebookPosts: 1, packs: ["Pack A"], examDate: "2027-01-15", scratchpads: 1, lecturePositions: 1, myCards: 1 });
    expect(describeBackup(collectBackup(seeded(), { includeCards: false })).myCards).toBeNull();
  });
});

describe("save string and file round trip", () => {
  it("compresses with the MF1.z. prefix and restores identically", async () => {
    const src = seeded();
    const b = collectBackup(src, { includeCards: true, now: NOW });
    const str = await encodeSaveString(b);
    expect(str.startsWith(SAVE_PREFIX + "z.")).toBe(true);
    expect(str).toMatch(/^MF1\.z\.[A-Za-z0-9_-]+$/);
    expect(str.length).toBeLessThan(JSON.stringify(b).length);
    const back = await readBackup(str);
    expect(back).toEqual(b);
    // Line breaks from a chat app are tolerated.
    expect(await readBackup(str.slice(0, 20) + "\n  " + str.slice(20))).toEqual(b);

    const dest = new MemoryStorage();
    restoreBackup(dest, back, "replace");
    for (const [k, v] of Object.entries(b.data)) expect(dest.getItem(k)).toBe(v);
    expect(dest.getItem(SETTINGS_KEY)).toBeNull();
  });

  it("round trips the backup file", async () => {
    const b = collectBackup(seeded(), { includeCards: true, now: NOW });
    const back = await readBackup("﻿" + backupToFile(b));
    expect(back).toEqual(b);
  });

  it("falls back to uncompressed MF1.j. without CompressionStream, and reads it anywhere", async () => {
    const b = collectBackup(seeded(), { includeCards: false, now: NOW });
    vi.stubGlobal("CompressionStream", undefined);
    vi.stubGlobal("DecompressionStream", undefined);
    const str = await encodeSaveString(b);
    expect(str).toMatch(/^MF1\.j\.[A-Za-z0-9_-]+$/);
    expect(await readBackup(str)).toEqual(b);
    vi.unstubAllGlobals();
    expect(await readBackup(str)).toEqual(b);
  });

  it("explains when a compressed string can't be unpacked here", async () => {
    const str = await encodeSaveString(collectBackup(seeded(), { includeCards: false }));
    vi.stubGlobal("DecompressionStream", undefined);
    await expect(readBackup(str)).rejects.toThrow(/can't unpack compressed/);
  });

  it("keeps non-ASCII text intact", async () => {
    const s = new MemoryStorage();
    s.setItem(NOTEBOOK_KEY, JSON.stringify({ posts: [{ id: "p", title: "Hämoglobin – O₂ 🫁", replies: [] }] }));
    const b = collectBackup(s, { includeCards: false });
    expect((await readBackup(await encodeSaveString(b))).data[NOTEBOOK_KEY]).toContain("Hämoglobin – O₂ 🫁");
  });
});

describe("validation", () => {
  const good = (): Backup => collectBackup(seeded(), { includeCards: false, now: NOW });
  const asFile = (x: unknown) => readBackup(JSON.stringify(x));

  it("rejects wrong prefixes, formats and versions", async () => {
    await expect(readBackup("hello")).rejects.toThrow(/start with “MF1\.”/);
    await expect(readBackup("MF2.z.abc")).rejects.toThrow(/newer version/);
    await expect(readBackup("MF1.x.abc")).rejects.toThrow(/damaged/);
    await expect(readBackup("")).rejects.toThrow(/Paste a save string/);
    await expect(asFile({ ...good(), format: "nope" })).rejects.toThrow(/isn't a MedForge backup/);
    await expect(asFile({ format: "study-forge-my-cards", version: 1, cards: [] })).rejects.toThrow(/different MedForge export/);
    await expect(asFile({ ...good(), version: 2 })).rejects.toThrow(/newer version/);
    await expect(asFile({ ...good(), version: "1" })).rejects.toThrow(/version/);
    await expect(asFile({ ...good(), data: [] })).rejects.toThrow(/no saved data/);
  });

  it("rejects unknown keys, settings and non-string values", async () => {
    await expect(asFile({ ...good(), data: { ...good().data, "study-forge:evil": "x" } })).rejects.toThrow(/doesn't know/);
    await expect(asFile({ ...good(), data: { "localStorage-hijack": "x" } })).rejects.toThrow(/doesn't know/);
    await expect(asFile({ ...good(), data: { [SETTINGS_KEY]: "{}" } })).rejects.toThrow(/settings/);
    await expect(asFile({ ...good(), data: { [PROGRESS_KEY]: { questions: {} } } })).rejects.toThrow(/isn't text/);
    await expect(asFile({ ...good(), data: { [PROGRESS_KEY]: "{not json" } })).rejects.toThrow(/damaged: it isn't valid JSON/);
    await expect(asFile({ ...good(), data: { [PACKS_STORAGE_KEY]: "{}" } })).rejects.toThrow(/should be a list/);
    await expect(asFile({ ...good(), data: { [KEYS.examDate]: "next week" } })).rejects.toThrow(/YYYY-MM-DD/);
  });

  it("reports corrupt input clearly", async () => {
    const str = await encodeSaveString(good());
    await expect(readBackup(str.slice(0, Math.floor(str.length / 2)))).rejects.toThrow(BackupError);
    await expect(readBackup(str.slice(0, 30))).rejects.toThrow(/damaged/);
    await expect(readBackup("MF1.z.!!!!")).rejects.toThrow(/characters that don't belong/);
    await expect(readBackup("MF1.j.bm90IGpzb24")).rejects.toThrow(/damaged/);
    await expect(readBackup("{ broken")).rejects.toThrow(/isn't valid JSON/);
  });

  it("restoreBackup re-validates objects passed in directly", () => {
    const bad = { ...good(), data: { "study-forge:evil": "x" } } as Backup;
    const s = new MemoryStorage();
    expect(() => restoreBackup(s, bad, "replace")).toThrow(/doesn't know/);
    expect(s.length).toBe(0);
  });
});

describe("restore: replace vs merge", () => {
  // Another device: q1 graded later, a new question, a different lab step, a new post and pack.
  function otherDevice(): Backup {
    const s = new MemoryStorage();
    s.setItem(PROGRESS_KEY, JSON.stringify({ questions: { q1: q(NOW + 7 * DAY, 6, 2, "newer answer"), term1: q(NOW - 10 * DAY, 1, 1), q9: q(NOW, 1, 1) }, labs: { lab1: [1] }, cases: { c1: { score: 2, max: 5, at: NOW + 1 } }, skills: {} }));
    s.setItem(PACKS_STORAGE_KEY, JSON.stringify([{ id: "pack-a", title: "Pack A v2" }, { id: "pack-b", title: "Pack B" }]));
    s.setItem(NOTEBOOK_KEY, JSON.stringify({ posts: [{ id: "p2", title: "From laptop", createdAt: NOW, replies: [] }] }));
    s.setItem(KEYS.examDate, "2027-02-01");
    return collectBackup(s, { includeCards: false, now: NOW });
  }

  it("replace makes study data exactly the backup's, but keeps cards (not in backup) and settings", () => {
    const s = seeded();
    restoreBackup(s, otherDevice(), "replace");
    expect(Object.keys(JSON.parse(s.getItem(PROGRESS_KEY)!).questions).sort()).toEqual(["q1", "q9", "term1"]);
    expect(s.getItem(SCRATCH_KEY_PREFIX + "q1")).toBeNull();
    expect(s.getItem("study-forge:lecture-pos:l1")).toBeNull();
    expect(s.getItem(KEYS.examDate)).toBe("2027-02-01");
    expect(JSON.parse(s.getItem(NOTEBOOK_KEY)!).posts.map((p: { id: string }) => p.id)).toEqual(["p2"]);
    expect(s.getItem(MY_CARDS_KEY)).toContain("mc1");
    expect(s.getItem(SETTINGS_KEY)).toContain("sk-secret-123");
    expect(s.getItem("other-app:thing")).toBe("x");
  });

  it("merge keeps the more recently reviewed schedule per item and unions the rest", () => {
    const s = seeded();
    restoreBackup(s, otherDevice(), "merge");
    const p = JSON.parse(s.getItem(PROGRESS_KEY)!);
    expect(p.questions.q1.myAnswer).toBe("newer answer"); // backup reviewed it later
    expect(p.questions.term1.sm2.interval).toBe(6); // this device reviewed it later
    expect(p.questions.q9).toBeDefined();
    expect(p.labs.lab1).toEqual([0, 1, 2]);
    expect(p.skills.s1).toEqual([1]);
    expect(p.cases.c1.score).toBe(3); // best score kept
    expect(JSON.parse(s.getItem(NOTEBOOK_KEY)!).posts.map((x: { id: string }) => x.id).sort()).toEqual(["p1", "p2"]);
    const packs = JSON.parse(s.getItem(PACKS_STORAGE_KEY)!);
    expect(packs.map((x: { title: string }) => x.title)).toEqual(["Pack A v2", "Pack B"]);
    expect(s.getItem(KEYS.examDate)).toBe("2027-02-01");
    expect(s.getItem(SCRATCH_KEY_PREFIX + "q1")).not.toBeNull();
    expect(s.getItem(MY_CARDS_KEY)).toContain("mc1");
  });

  it("merging a backup into the device it came from changes nothing", () => {
    const s = seeded();
    const before = s.dump();
    const r = restoreBackup(s, collectBackup(s, { includeCards: true }), "merge");
    expect(s.dump()).toEqual(before);
    expect(r.written).toBe(0);
  });

  it("merges snipped cards by most recent review", () => {
    const s = seeded();
    const other = new MemoryStorage();
    other.setItem(MY_CARDS_KEY, JSON.stringify({ cards: [{ id: "mc1", front: "data:image/webp;base64,BBBB", sm2: { ef: 2.5, interval: 6, reps: 2, due: NOW + 6 * DAY } }, { id: "mc2", front: "data:image/webp;base64,CCCC", sm2: { ef: 2.5, interval: 0, reps: 0, due: NOW } }] }));
    restoreBackup(s, collectBackup(other, { includeCards: true }), "merge");
    const cards = JSON.parse(s.getItem(MY_CARDS_KEY)!).cards;
    expect(cards.map((c: { id: string }) => c.id)).toEqual(["mc1", "mc2"]);
    expect(cards[0].front).toContain("BBBB");
  });

  it("a full storage changes nothing and says so", () => {
    const s = seeded();
    const before = s.dump();
    s.quota = JSON.stringify(before).length + 50; // room for a little, not a big pack
    const other = new MemoryStorage();
    other.setItem(PACKS_STORAGE_KEY, JSON.stringify([{ id: "big", title: "x".repeat(20_000) }]));
    other.setItem(KEYS.examDate, "2030-01-01");
    for (const mode of ["replace", "merge"] as const) {
      expect(() => restoreBackup(s, collectBackup(other, { includeCards: false }), mode)).toThrow(/storage is full, so nothing was changed/);
      expect(s.dump()).toEqual(before);
    }
  });

  it("blocked storage gives a clear error", () => {
    const blocked = {
      get length(): number {
        throw new Error("SecurityError");
      },
      key: () => null,
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {},
      removeItem: () => {},
    };
    expect(() => collectBackup(blocked, { includeCards: true })).toThrow(/blocking site storage/);
    expect(() => restoreBackup(null, collectBackup(seeded(), { includeCards: false }), "merge")).toThrow(/blocking site storage/);
  });
});

describe("clean slate", () => {
  it("resets personal work but keeps course packs, settings and card images", () => {
    const s = seeded();
    cleanSlate(s, { deleteCards: false, now: NOW + DAY });
    expect(s.getItem(PROGRESS_KEY)).toBeNull();
    expect(s.getItem(NOTEBOOK_KEY)).toBeNull();
    expect(s.getItem(KEYS.examDate)).toBeNull();
    expect(s.getItem(SCRATCH_KEY_PREFIX + "q1")).toBeNull();
    expect(s.getItem("study-forge:lecture-pos:l1")).toBeNull();
    expect(JSON.parse(s.getItem(PACKS_STORAGE_KEY)!)[0].id).toBe("pack-a");
    expect(s.getItem(SETTINGS_KEY)).toContain("sk-secret-123");
    const card = JSON.parse(s.getItem(MY_CARDS_KEY)!).cards[0];
    expect(card.front).toContain("AAAA");
    expect(card.sm2).toEqual({ ef: 2.5, interval: 0, reps: 0, due: NOW + DAY });
    expect(card.lastGrade).toBeUndefined();
  });

  it("can delete snipped cards too", () => {
    const s = seeded();
    cleanSlate(s, { deleteCards: true });
    expect(s.getItem(MY_CARDS_KEY)).toBeNull();
    expect(s.getItem(PACKS_STORAGE_KEY)).not.toBeNull();
  });
});
