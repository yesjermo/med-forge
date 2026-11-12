import { isMajor, isPostKind, isReplyKind, type Major, type PostKind, type ReplyKind } from "@/taxonomy";
import { DEMO_POSTS } from "./demo";

/**
 * The GitHub Pages hub: a notebook kept in this browser, plus read-only demo posts.
 * Nothing here is shared; export/import a JSON file to swap posts by hand.
 */

export const STORAGE_KEY = "study-forge:notebook";
export const FORMAT = "study-forge-notebook";
const LIMITS = { title: 160, course: 40, body: 50_000, reply: 20_000, author: 40 } as const;

export interface NotebookReply {
  id: string;
  kind: ReplyKind;
  body: string;
  author: string;
  createdAt: number;
}

export interface NotebookPost {
  id: string;
  kind: PostKind;
  title: string;
  major: Major;
  course: string;
  body: string;
  author: string;
  createdAt: number;
  replies: NotebookReply[];
  acceptedReplyId: string | null;
  demo?: boolean;
}

export class NotebookError extends Error {}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export interface ListOptions {
  major?: string;
  kind?: string;
  q?: string;
  /** Only the visitor's own posts (no demos). */
  mine?: boolean;
}

const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function text(v: unknown, max: number, field: string, required = true): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (required && !s) throw new NotebookError(`${field} is required.`);
  if (s.length > max) throw new NotebookError(`${field} must be at most ${max.toLocaleString()} characters.`);
  return s;
}

function validReply(r: unknown): r is NotebookReply {
  const x = r as Partial<NotebookReply>;
  return (
    typeof x === "object" && x !== null && typeof x.id === "string" && isReplyKind(x.kind) &&
    typeof x.body === "string" && typeof x.author === "string" && typeof x.createdAt === "number"
  );
}

function validPost(p: unknown): p is NotebookPost {
  const x = p as Partial<NotebookPost>;
  return (
    typeof x === "object" && x !== null && typeof x.id === "string" && isPostKind(x.kind) &&
    typeof x.title === "string" && isMajor(x.major) && typeof x.body === "string" &&
    typeof x.author === "string" && typeof x.createdAt === "number" &&
    Array.isArray(x.replies) && x.replies.every(validReply) &&
    (x.acceptedReplyId === null || typeof x.acceptedReplyId === "string")
  );
}

function canUse(storage: StorageLike | null): boolean {
  if (!storage) return false;
  try {
    storage.setItem(`${STORAGE_KEY}:probe`, "1");
    return storage.getItem(`${STORAGE_KEY}:probe`) === "1";
  } catch {
    return false;
  }
}

export function createNotebook(storage: StorageLike | null) {
  const canSave = canUse(storage);
  let posts: NotebookPost[] = [];
  if (canSave) {
    try {
      const raw = storage!.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as { posts?: unknown[] }) : null;
      posts = (parsed?.posts ?? []).filter(validPost);
    } catch {
      posts = [];
    }
  }

  const save = () => {
    if (!canSave) return;
    try {
      storage!.setItem(STORAGE_KEY, JSON.stringify({ format: FORMAT, version: 1, posts }));
    } catch {
      // Quota or privacy mode: keep working in memory.
    }
  };

  const mine = (id: string) => {
    if (id.startsWith("demo-")) throw new NotebookError("Example posts are read-only. Write your own post to try it.");
    const p = posts.find((x) => x.id === id);
    if (!p) throw new NotebookError("That post isn't in this notebook.");
    return p;
  };

  return {
    canSave,

    list(opts: ListOptions = {}): NotebookPost[] {
      const q = opts.q?.trim().toLowerCase();
      return [...posts, ...(opts.mine ? [] : DEMO_POSTS)].filter(
        (p) =>
          (!opts.major || p.major === opts.major) &&
          (!opts.kind || p.kind === opts.kind) &&
          (!q || `${p.title}\n${p.body}\n${p.course}`.toLowerCase().includes(q)),
      );
    },

    get(id: string): NotebookPost | null {
      return posts.find((p) => p.id === id) ?? DEMO_POSTS.find((p) => p.id === id) ?? null;
    },

    addPost(input: { kind: unknown; title: unknown; major: unknown; course?: unknown; body: unknown; author: unknown }): string {
      if (!isPostKind(input.kind)) throw new NotebookError("Pick a post type.");
      if (!isMajor(input.major)) throw new NotebookError("Pick a major.");
      const post: NotebookPost = {
        id: newId("p"),
        kind: input.kind,
        title: text(input.title, LIMITS.title, "Title"),
        major: input.major,
        course: text(input.course, LIMITS.course, "Course", false),
        body: text(input.body, LIMITS.body, "Body"),
        author: text(input.author, LIMITS.author, "Name", false) || "me",
        createdAt: Date.now(),
        replies: [],
        acceptedReplyId: null,
      };
      posts = [post, ...posts];
      save();
      return post.id;
    },

    addReply(postId: string, input: { kind: unknown; body: unknown; author: unknown }): string {
      const p = mine(postId);
      if (!isReplyKind(input.kind)) throw new NotebookError("Pick a reply type.");
      const reply: NotebookReply = {
        id: newId("r"),
        kind: input.kind,
        body: text(input.body, LIMITS.reply, "Reply"),
        author: text(input.author, LIMITS.author, "Name", false) || "me",
        createdAt: Date.now(),
      };
      p.replies = [...p.replies, reply];
      save();
      return reply.id;
    },

    accept(postId: string, replyId: string): void {
      const p = mine(postId);
      if (!p.replies.some((r) => r.id === replyId)) throw new NotebookError("That reply isn't on this post.");
      p.acceptedReplyId = p.acceptedReplyId === replyId ? null : replyId;
      save();
    },

    removeReply(postId: string, replyId: string): void {
      const p = mine(postId);
      p.replies = p.replies.filter((r) => r.id !== replyId);
      if (p.acceptedReplyId === replyId) p.acceptedReplyId = null;
      save();
    },

    remove(postId: string): void {
      mine(postId);
      posts = posts.filter((p) => p.id !== postId);
      save();
    },

    exportJson(): string {
      return JSON.stringify({ format: FORMAT, version: 1, posts }, null, 2);
    },

    /** Add posts from an exported file. Existing ids and demo posts are skipped. All-or-nothing. */
    importJson(json: string): { added: number } {
      let data: { format?: unknown; posts?: unknown };
      try {
        data = JSON.parse(json) as typeof data;
      } catch {
        throw new NotebookError("That file isn't valid JSON.");
      }
      if (data?.format !== FORMAT || !Array.isArray(data.posts)) {
        throw new NotebookError("That file isn't a StudyForge notebook export.");
      }
      if (!data.posts.every(validPost)) throw new NotebookError("Some posts in that file are damaged, so nothing was imported.");
      const have = new Set(posts.map((p) => p.id));
      const incoming = (data.posts as NotebookPost[]).filter((p) => !have.has(p.id) && !p.id.startsWith("demo-"));
      posts = [...incoming.map((p) => ({ ...p, demo: false })), ...posts];
      save();
      return { added: incoming.length };
    },
  };
}

export type Notebook = ReturnType<typeof createNotebook>;
