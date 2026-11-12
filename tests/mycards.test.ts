import { describe, expect, it } from "vitest";
import { MY_CARDS_KEY, MyCardsFullError, createMyCards } from "../site/src/med/mycards";
import { NEW_SM2, sm2 } from "../site/src/med/progress";

const DAY = 86_400_000;
const IMG = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
const IMG2 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP////////////////////8=";

class FakeStorage {
  data = new Map<string, string>();
  /** Max characters stored in total; setItem past it throws a QuotaExceededError like browsers do. */
  limit = Infinity;
  blocked = false;
  getItem(k: string) {
    if (this.blocked) throw Object.assign(new Error("denied"), { name: "SecurityError" });
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    if (this.blocked) throw Object.assign(new Error("denied"), { name: "SecurityError" });
    if (v.length > this.limit) throw Object.assign(new Error("full"), { name: "QuotaExceededError", code: 22 });
    this.data.set(k, v);
  }
}

function clock(start = Date.UTC(2026, 10, 12, 9)) {
  const c = { t: start, now: () => c.t };
  return c;
}

const base = { course: "Pharmacology", title: "Q3 warfarin", front: IMG, source: "exam-2024.pdf p.2" };

describe("my cards store", () => {
  it("adds cards that are due straight away and lists newest first", () => {
    const c = clock();
    const store = createMyCards(new FakeStorage(), c.now);
    const a = store.add(base);
    c.t += 1000;
    const b = store.add({ ...base, title: "  Q4  ", course: " Physiology ", frontNote: "Part (b) only", answer: "INR 2–3" });
    expect(a.id).not.toBe(b.id);
    expect(a.sm2).toEqual(NEW_SM2(c.t - 1000));
    expect(b).toMatchObject({ title: "Q4", course: "Physiology", frontNote: "Part (b) only", answer: "INR 2–3", source: "exam-2024.pdf p.2" });
    expect(store.list().map((x) => x.id)).toEqual([b.id, a.id]);
    expect(store.due().map((x) => x.id)).toEqual([a.id, b.id]);
    expect(store.get(a.id)?.title).toBe("Q3 warfarin");
    expect(store.get("nope")).toBeUndefined();
  });

  it("refuses a card without an image data URL", () => {
    const store = createMyCards(new FakeStorage());
    expect(() => store.add({ ...base, front: "javascript:alert(1)" })).toThrow(/image/);
    expect(() => store.add({ ...base, front: "https://example.com/a.png" })).toThrow(/image/);
    expect(store.list()).toHaveLength(0);
  });

  it("rate() schedules with sm2 and due() follows the schedule", () => {
    const c = clock();
    const store = createMyCards(new FakeStorage(), c.now);
    const card = store.add(base);

    const r1 = store.rate(card.id, 4);
    expect(r1.sm2).toEqual(sm2(NEW_SM2(c.t), 4, c.t));
    expect(r1.lastGrade).toBe(4);
    expect(r1.sm2.due).toBe(c.t + DAY);
    expect(store.due()).toHaveLength(0);
    expect(store.due(c.t + DAY)).toHaveLength(1);

    c.t += DAY;
    const r2 = store.rate(card.id, 5);
    expect(r2.sm2.interval).toBe(6);
    expect(store.due(c.t + 5 * DAY)).toHaveLength(0);
    expect(store.due(c.t + 6 * DAY)).toHaveLength(1);

    const r3 = store.rate(card.id, 1);
    expect(r3.sm2).toMatchObject({ reps: 0, interval: 1, due: c.t + DAY });
    expect(store.rate(card.id, 9).lastGrade).toBe(5);
    expect(() => store.rate("missing", 3)).toThrow();
  });

  it("orders due cards most overdue first", () => {
    const c = clock();
    const store = createMyCards(new FakeStorage(), c.now);
    const a = store.add(base);
    const b = store.add(base);
    store.rate(a.id, 5); // due in 1 day
    store.rate(b.id, 0); // due in 1 day too
    c.t += 60_000;
    store.rate(b.id, 0); // a minute later
    expect(store.due(c.t + 2 * DAY).map((x) => x.id)).toEqual([a.id, b.id]);
  });

  it("persists under study-forge:my-cards and reloads in a new instance", () => {
    const storage = new FakeStorage();
    const c = clock();
    const one = createMyCards(storage, c.now);
    const card = one.add({ ...base, back: IMG2 });
    one.rate(card.id, 3);
    expect(storage.data.has(MY_CARDS_KEY)).toBe(true);

    const two = createMyCards(storage, c.now);
    expect(two.get(card.id)).toMatchObject({ back: IMG2, lastGrade: 3 });
    // Instances stay in step through storage.
    two.remove(card.id);
    expect(one.list()).toHaveLength(0);
  });

  it("update() edits allowed fields and clears optional ones", () => {
    const store = createMyCards(new FakeStorage());
    const card = store.add({ ...base, frontNote: "note", answer: "ans" });
    store.update(card.id, { title: "Renamed", course: "Micro", answer: "", frontNote: undefined, back: IMG2 });
    const got = store.get(card.id)!;
    expect(got).toMatchObject({ title: "Renamed", course: "Micro", back: IMG2 });
    expect(got.answer).toBeUndefined();
    expect(got.frontNote).toBeUndefined();
    store.update(card.id, { title: "   " });
    expect(store.get(card.id)!.title).toBe("Renamed");
    store.update(card.id, { back: undefined });
    expect(store.get(card.id)!.back).toBeUndefined();
    expect(() => store.update(card.id, { back: "file:///etc/passwd" })).toThrow();
    store.update("missing", { title: "x" }); // no-op
  });

  it("returns copies, so callers can't change stored cards by accident", () => {
    const store = createMyCards(new FakeStorage());
    const card = store.add(base);
    store.list()[0]!.sm2.due = 0;
    store.get(card.id)!.title = "hacked";
    expect(store.get(card.id)).toMatchObject({ title: base.title, sm2: { due: card.sm2.due } });
  });

  it("round-trips through exportJson / importJson and skips duplicates", () => {
    const c = clock();
    const src = createMyCards(new FakeStorage(), c.now);
    const a = src.add({ ...base, answer: "x", back: IMG2 });
    src.rate(a.id, 4);
    src.add({ ...base, title: "Second" });
    const json = src.exportJson();
    expect(JSON.parse(json)).toMatchObject({ format: "study-forge-my-cards", version: 1 });

    const dest = createMyCards(new FakeStorage(), c.now);
    expect(dest.importJson(json)).toBe(2);
    expect(dest.list()).toEqual(src.list());
    expect(dest.importJson(json)).toBe(0);
    expect(dest.list()).toHaveLength(2);
    // A bare array of cards works too.
    const other = createMyCards(new FakeStorage(), c.now);
    expect(other.importJson(JSON.stringify(src.list()))).toBe(2);
  });

  it("rejects bad import files and cleans up untrusted card fields", () => {
    const store = createMyCards(new FakeStorage());
    expect(() => store.importJson("{nope")).toThrow(/JSON/);
    expect(() => store.importJson('{"hello":1}')).toThrow(/cards/);
    expect(() => store.importJson('{"cards":[{"id":"x","front":"javascript:alert(1)"}]}')).toThrow(/usable/);
    expect(store.importJson('{"cards":[]}')).toBe(0);

    const n = store.importJson(
      JSON.stringify({ cards: [{ id: "ok", front: IMG, back: "javascript:x", sm2: { ef: "2" }, title: 7 }, { id: "bad" }] }),
    );
    expect(n).toBe(1);
    const card = store.get("ok")!;
    expect(card.back).toBeUndefined();
    expect(card.title).toBe("Untitled question");
    expect(card.sm2.ef).toBe(2.5);
  });

  it("tolerates corrupt storage", () => {
    const storage = new FakeStorage();
    storage.data.set(MY_CARDS_KEY, "{not json");
    const store = createMyCards(storage);
    expect(store.list()).toEqual([]);
    store.add(base);
    expect(createMyCards(storage).list()).toHaveLength(1);

    storage.data.set(MY_CARDS_KEY, JSON.stringify({ cards: [{ id: "a", front: IMG }, 42, null, { id: "b", front: "x" }] }));
    expect(createMyCards(storage).list().map((c) => c.id)).toEqual(["a"]);
  });

  it("works in memory when storage is missing or blocked", () => {
    const none = createMyCards(null);
    const a = none.add(base);
    expect(none.rate(a.id, 5).sm2.reps).toBe(1);
    expect(none.list()).toHaveLength(1);

    const storage = new FakeStorage();
    storage.blocked = true;
    const blocked = createMyCards(storage);
    blocked.add(base);
    expect(blocked.list()).toHaveLength(1);
    expect(blocked.due()).toHaveLength(1);
  });

  it("throws MyCardsFullError and keeps the old cards when storage is full", () => {
    const storage = new FakeStorage();
    const store = createMyCards(storage);
    const a = store.add(base);
    storage.limit = (storage.data.get(MY_CARDS_KEY) ?? "").length + 50;

    expect(() => store.add(base)).toThrow(MyCardsFullError);
    expect(store.list().map((c) => c.id)).toEqual([a.id]);
    expect(() => store.update(a.id, { answer: "x".repeat(500) })).toThrow(MyCardsFullError);
    expect(store.get(a.id)!.answer).toBeUndefined();
    expect(() => store.importJson(JSON.stringify({ cards: [{ id: "big", front: IMG, answer: "y".repeat(500) }] }))).toThrow(
      MyCardsFullError,
    );
    expect(store.get("big")).toBeUndefined();

    // Grading never throws: the schedule is kept in memory even if it can't be written.
    storage.limit = 0;
    expect(store.rate(a.id, 4).lastGrade).toBe(4);
    expect(store.get(a.id)!.lastGrade).toBe(4);

    // Deleting frees space again.
    storage.limit = Infinity;
    store.remove(a.id);
    expect(createMyCards(storage).list()).toHaveLength(0);
  });

  it("recognises quota errors by legacy codes too", () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw Object.assign(new Error("x"), { name: "NS_ERROR_DOM_QUOTA_REACHED", code: 1014 });
      },
    };
    expect(() => createMyCards(storage).add(base)).toThrow(/storage is full/);
  });
});
