import { useEffect, useState } from "react";
import { PostBody } from "@/components/PostBody";
import { MAJORS, PACK_TO_MAJOR, POST_KINDS, POST_TEMPLATES, type PostKind } from "@/taxonomy";
import { NotebookError, type Notebook } from "../notebook";
import type { Settings } from "../settings";

export function NewPost({
  notebook,
  settings,
  refresh,
  fromGenerator,
}: {
  notebook: Notebook;
  settings: Settings;
  refresh: () => void;
  fromGenerator: boolean;
}) {
  const [kind, setKind] = useState<PostKind>("question");
  const [title, setTitle] = useState("");
  const [major, setMajor] = useState("");
  const [course, setCourse] = useState("");
  const [body, setBody] = useState(POST_TEMPLATES.question ?? "");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fromGenerator) return;
    try {
      const raw = sessionStorage.getItem("study-forge:share");
      if (!raw) return;
      const shared = JSON.parse(raw) as { body?: string; title?: string; pack?: string };
      setKind("pack");
      if (shared.body) setBody(shared.body);
      if (shared.title) setTitle(shared.title);
      const m = shared.pack ? PACK_TO_MAJOR[shared.pack] : undefined;
      if (m) setMajor(m);
      setTouched(true);
    } catch {}
  }, [fromGenerator]);

  return (
    <main className="shell">
      <h1>New post</h1>
      <p className="lede">Write in plain text with $math$, or paste ::: blocks from the generator. Saved to this browser.</p>
      <form
        className="layout"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const id = notebook.addPost({ kind, title, major, course, body, author: settings.name });
            try {
              sessionStorage.removeItem("study-forge:share");
            } catch {}
            refresh();
            window.location.hash = `/hub/${encodeURIComponent(id)}`;
          } catch (err) {
            setError(err instanceof NotebookError ? err.message : "Couldn't save the post.");
          }
        }}
      >
        <section className="panel">
          <label className="field">
            <span>Type</span>
            <select
              value={kind}
              onChange={(e) => {
                const k = e.target.value as PostKind;
                setKind(k);
                if (!touched) setBody(POST_TEMPLATES[k] ?? "");
              }}
            >
              {(Object.keys(POST_KINDS) as PostKind[]).map((k) => (
                <option key={k} value={k}>
                  {POST_KINDS[k].label}
                </option>
              ))}
            </select>
            <small className="hint">{POST_KINDS[kind].hint}</small>
          </label>
          <label className="field">
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} required />
          </label>
          <div className="row">
            <label className="field">
              <span>Major</span>
              <select value={major} onChange={(e) => setMajor(e.target.value)} required>
                <option value="" disabled>
                  Choose…
                </option>
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Course (optional)</span>
              <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. NURS 320" maxLength={40} />
            </label>
          </div>
          <label className="field">
            <span>Body</span>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setTouched(true);
              }}
              rows={16}
              className="mono"
              required
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="actions">
            <button type="submit">Save post</button>
            <a href="#/hub" className="hint">
              Cancel
            </a>
          </div>
        </section>
        <section className="panel">
          <h2>Preview</h2>
          {body.trim() ? <PostBody body={body} /> : <p className="empty">Your post preview appears here.</p>}
        </section>
      </form>
    </main>
  );
}
