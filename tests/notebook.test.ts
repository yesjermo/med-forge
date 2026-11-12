import { describe, expect, it } from "vitest";
import { createNotebook, NotebookError } from "../site/src/notebook";

function memoryStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

const post = { kind: "question", title: "Why θja?", major: "Nursing", course: "ELEC2134", body: "Explain." };

describe("notebook", () => {
  it("starts with read-only demo posts", () => {
    const nb = createNotebook(memoryStorage());
    const demos = nb.list();
    expect(demos.length).toBeGreaterThanOrEqual(3);
    expect(demos.every((p) => p.demo && p.id.startsWith("demo-"))).toBe(true);
    expect(new Set(demos.map((p) => p.kind)).size).toBeGreaterThanOrEqual(3);
    expect(demos.some((p) => p.acceptedReplyId)).toBe(true);
    expect(() => nb.remove(demos[0]!.id)).toThrow(NotebookError);
    expect(() => nb.addReply(demos[0]!.id, { kind: "comment", body: "x", author: "me" })).toThrow(NotebookError);
  });

  it("adds, lists, filters and searches posts, newest first, demos last", () => {
    const nb = createNotebook(memoryStorage());
    const a = nb.addPost({ ...post, author: "ada" });
    const b = nb.addPost({ ...post, kind: "proof", title: "Green's theorem", major: "Pre-med", author: "ada" });
    expect(nb.list().slice(0, 2).map((p) => p.id)).toEqual([b, a]);
    expect(nb.list({ major: "Pre-med", mine: true }).map((p) => p.id)).toEqual([b]);
    expect(nb.list({ major: "Pre-med" }).map((p) => p.id)).toContain("demo-proof");
    expect(nb.list({ kind: "question" }).map((p) => p.id)).toContain(a);
    expect(nb.list({ q: "elec2134" }).map((p) => p.id)).toContain(a);
    expect(nb.list({ mine: true }).map((p) => p.id)).toEqual([b, a]);
  });

  it("validates posts with the hub's rules", () => {
    const nb = createNotebook(memoryStorage());
    expect(() => nb.addPost({ ...post, kind: "nope", author: "a" })).toThrow("post type");
    expect(() => nb.addPost({ ...post, major: "Astrology", author: "a" })).toThrow("major");
    expect(() => nb.addPost({ ...post, title: "  ", author: "a" })).toThrow("Title");
  });

  it("handles replies, accepting and deleting", () => {
    const nb = createNotebook(memoryStorage());
    const id = nb.addPost({ ...post, author: "ada" });
    const r = nb.addReply(id, { kind: "solution", body: "junction to case only", author: "bob" });
    nb.accept(id, r);
    expect(nb.get(id)).toMatchObject({ acceptedReplyId: r });
    expect(nb.get(id)!.replies).toHaveLength(1);
    nb.removeReply(id, r);
    expect(nb.get(id)).toMatchObject({ acceptedReplyId: null, replies: [] });
    nb.remove(id);
    expect(nb.get(id)).toBeNull();
  });

  it("persists to storage", () => {
    const s = memoryStorage();
    const id = createNotebook(s).addPost({ ...post, author: "ada" });
    expect(createNotebook(s).get(id)?.title).toBe("Why θja?");
  });

  it("exports and imports posts between notebooks, skipping duplicates and demos", () => {
    const from = createNotebook(memoryStorage());
    const id = from.addPost({ ...post, author: "ada" });
    from.addReply(id, { kind: "solution", body: "s", author: "bob" });
    const json = from.exportJson();
    const to = createNotebook(memoryStorage());
    expect(to.importJson(json)).toEqual({ added: 1 });
    expect(to.importJson(json)).toEqual({ added: 0 });
    expect(to.list({ mine: true })[0]).toMatchObject({ title: "Why θja?", replies: [{ body: "s" }] });
    expect(to.list().filter((p) => p.demo)).toHaveLength(from.list().filter((p) => p.demo).length);
  });

  it("rejects bad imports and leaves the notebook untouched", () => {
    const nb = createNotebook(memoryStorage());
    nb.addPost({ ...post, author: "ada" });
    const before = nb.exportJson();
    expect(() => nb.importJson("not json")).toThrow(NotebookError);
    expect(() => nb.importJson(JSON.stringify({ format: "other", posts: [] }))).toThrow("StudyForge notebook");
    expect(() => nb.importJson(JSON.stringify({ format: "study-forge-notebook", version: 1, posts: [{ id: "x" }] }))).toThrow(
      NotebookError,
    );
    expect(nb.exportJson()).toBe(before);
  });

  it("works in memory when storage is unavailable", () => {
    const nb = createNotebook(null);
    expect(nb.canSave).toBe(false);
    const id = nb.addPost({ ...post, author: "ada" });
    expect(nb.get(id)).not.toBeNull();
  });

  it("survives storage that throws", () => {
    const broken = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceeded");
      },
    };
    const nb = createNotebook(broken);
    expect(nb.canSave).toBe(false);
    expect(() => nb.addPost({ ...post, author: "ada" })).not.toThrow();
  });
});
