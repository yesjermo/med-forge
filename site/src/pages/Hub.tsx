import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { PostRow, timeAgo } from "@/components/PostRow";
import { MAJORS, POST_KINDS, type PostKind } from "@/taxonomy";
import { NotebookError, type Notebook } from "../notebook";
import type { Route } from "../router";

function hrefWith(q: URLSearchParams, patch: Record<string, string | undefined>): string {
  const next = new URLSearchParams(q);
  for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
  const qs = next.toString();
  return qs ? `#/hub?${qs}` : "#/hub";
}

export function Hub({ notebook, route, refresh }: { notebook: Notebook; route: Route; refresh: () => void }) {
  const q = route.query;
  const major = q.get("major") ?? "";
  const kind = q.get("kind") ?? "";
  const search = q.get("q") ?? "";
  const posts = notebook.list({ major, kind, q: search });
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const mineCount = notebook.list({ mine: true }).length;

  function exportFile() {
    const url = URL.createObjectURL(new Blob([notebook.exportJson()], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-forge-notebook-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importFile(file: File) {
    try {
      const { added } = notebook.importJson(await file.text());
      setMessage({ ok: true, text: added ? `Imported ${added} post${added === 1 ? "" : "s"}.` : "Nothing new: those posts are already here." });
      refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof NotebookError ? err.message : "Couldn't read that file." });
    }
  }

  return (
    <main className="shell">
      <div className="hub-head">
        <div>
          <h1>Study Hub</h1>
          <p className="lede">
            Your notebook of proofs, ideas and solutions, saved in this browser. Swap posts with classmates by exporting
            and importing a file.
          </p>
        </div>
        <a className="button" href="#/hub/new">
          <Icon name="plus" /> New post
        </a>
      </div>

      <div className="notice">
        <p>
          Posts marked <span className="tag kind-discussion">Example</span> show how the hub
          works; yours stay on this device{notebook.canSave ? "" : " only until you close the tab, because this browser is blocking storage"}.
          To share with classmates, export your posts and send them the file.
        </p>
        <div className="actions">
          <button className="secondary small" onClick={exportFile} disabled={mineCount === 0}>
            <Icon name="download" /> Export my posts
          </button>
          <button className="secondary small" onClick={() => fileRef.current?.click()}>
            <Icon name="share" /> Import a file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importFile(f);
              e.target.value = "";
            }}
          />
          {message && (
            <span className={message.ok ? "lint-ok" : "error-inline"} role="status">
              {message.text}
            </span>
          )}
        </div>
      </div>

      <div className="hub-layout">
        <aside className="hub-side">
          <h2>Tracks</h2>
          <ul>
            <li>
              <a className={!major ? "active" : ""} href={hrefWith(q, { major: undefined })}>
                All tracks
              </a>
            </li>
            {MAJORS.map((m) => (
              <li key={m}>
                <a className={major === m ? "active" : ""} href={hrefWith(q, { major: m })}>
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <section>
          <form
            className="hub-filters"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              window.location.hash = hrefWith(q, {
                q: String(f.get("q") ?? "").trim() || undefined,
                kind: String(f.get("kind") ?? "") || undefined,
              }).slice(1);
            }}
          >
            <input name="q" defaultValue={search} placeholder="Search titles, courses, content…" aria-label="Search" />
            <select name="kind" defaultValue={kind} aria-label="Post type">
              <option value="">All types</option>
              {(Object.keys(POST_KINDS) as PostKind[]).map((k) => (
                <option key={k} value={k}>
                  {POST_KINDS[k].label}
                </option>
              ))}
            </select>
            <button type="submit" className="secondary">
              <Icon name="search" /> Filter
            </button>
          </form>

          {posts.length === 0 ? (
            <div className="panel empty-state">
              <p>Nothing here yet.</p>
              <p className="hint">
                Write a <a href="#/hub/new">new post</a>, or generate a pack on the <a href="#/generate">generator</a> and save it.
              </p>
            </div>
          ) : (
            <ul className="post-list">
              {posts.map((p) => (
                <PostRow
                  key={p.id}
                  href={`#/hub/${encodeURIComponent(p.id)}`}
                  title={p.title}
                  kind={p.kind}
                  major={p.major}
                  course={p.course}
                  solved={Boolean(p.acceptedReplyId)}
                  example={p.demo}
                  count={p.replies.length}
                  countLabel="replies"
                  meta={`${p.author} · ${timeAgo(p.createdAt)}`}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
