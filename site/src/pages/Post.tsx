import { useState } from "react";
import { Icon } from "@/components/Icon";
import { AdvicePanel } from "@/components/AdvicePanel";
import { PostBody } from "@/components/PostBody";
import { POST_KINDS, REPLY_KINDS, type ReplyKind } from "@/taxonomy";
import { NotebookError, type Notebook } from "../notebook";
import type { Settings } from "../settings";
import { useAdvisor } from "@/components/useAdvisor";
import { browserAdvisor } from "../advise";

export function Post({
  id,
  notebook,
  settings,
  refresh,
}: {
  id: string;
  notebook: Notebook;
  settings: Settings;
  refresh: () => void;
}) {
  const post = notebook.get(id);
  const [kind, setKind] = useState<ReplyKind>(post?.kind === "question" ? "solution" : "critique");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const advisor = useAdvisor(browserAdvisor(settings));

  if (!post) {
    return (
      <main className="shell narrow">
        <h1>Post not found</h1>
        <p className="lede">
          It may have been deleted, or it was saved in a different browser. <a href="#/hub">Back to the Study Hub</a>.
        </p>
      </main>
    );
  }

  const act = (fn: () => void) => {
    try {
      fn();
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof NotebookError ? err.message : "Something went wrong.");
    }
  };

  return (
    <main className="shell narrow">
      <p className="hint">
        <a href="#/hub" className="back">
          <Icon name="arrow-left" size={14} /> Study Hub
        </a>{" "}
        / <a href={`#/hub?major=${encodeURIComponent(post.major)}`}>{post.major}</a>
      </p>

      <article className="panel post">
        <div className="post-top">
          <div className="post-main">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span className={`tag kind-${post.kind}`}>{POST_KINDS[post.kind].label}</span>
              <span className="tag">{post.major}</span>
              {post.course && <span className="tag">{post.course}</span>}
              {post.acceptedReplyId && <span className="tag tag-ok">Solved</span>}
              {post.demo && <span className="tag kind-discussion">Example</span>}
              <span>
                by {post.author} · {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <PostBody body={post.body} />
        <div className="advice-wrap">
          <button
            type="button"
            className="secondary"
            disabled={advisor.running}
            onClick={() => void advisor.advise({ text: post.body, lead: post.title })}
          >
            <Icon name="message" /> {advisor.open ? "Ask again" : "Get advice"}
          </button>
          {advisor.open && (
            <AdvicePanel checks={advisor.checks} text={advisor.text} running={advisor.running} error={advisor.error}
              knownIds={advisor.knownIds} />
          )}
        </div>
        {!post.demo && (
          <div className="actions">
            <button
              className="secondary danger"
              onClick={() => {
                if (window.confirm("Delete this post from your notebook? This can't be undone.")) {
                  act(() => notebook.remove(post.id));
                  window.location.hash = "/hub";
                }
              }}
            >
              Delete post
            </button>
          </div>
        )}
      </article>

      <h2 className="replies-head">
        {post.replies.length} repl{post.replies.length === 1 ? "y" : "ies"}
      </h2>
      {[...post.replies]
        .sort((a, b) => Number(b.id === post.acceptedReplyId) - Number(a.id === post.acceptedReplyId))
        .map((r) => {
          const accepted = r.id === post.acceptedReplyId;
          return (
            <article key={r.id} className={`panel reply ${accepted ? "accepted" : ""}`}>
              <div className="post-meta">
                <span className={`tag reply-${r.kind}`}>{REPLY_KINDS[r.kind]}</span>
                {accepted && (
                  <span className="tag tag-ok">
                    <Icon name="check" size={12} /> Accepted solution
                  </span>
                )}
                <span>
                  {r.author} · {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <PostBody body={r.body} showLint={false} />
              {!post.demo && (
                <div className="actions">
                  {post.kind === "question" && r.kind === "solution" && (
                    <button className="secondary" onClick={() => act(() => notebook.accept(post.id, r.id))}>
                      {accepted ? "Unaccept" : "Accept solution"}
                    </button>
                  )}
                  <button className="secondary danger" onClick={() => act(() => notebook.removeReply(post.id, r.id))}>
                    Delete
                  </button>
                </div>
              )}
            </article>
          );
        })}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {post.demo ? (
        <p className="panel hint">
          This is an example post, so replies are switched off. <a href="#/hub/new">Write your own post</a> to try
          replying and accepting a solution.
        </p>
      ) : (
        <form
          className="panel reply-form"
          onSubmit={(e) => {
            e.preventDefault();
            act(() => {
              notebook.addReply(post.id, { kind, body, author: settings.name });
              setBody("");
            });
          }}
        >
          <h2>Add a reply</h2>
          <p className="hint">Paste a classmate's answer here, or write your own working.</p>
          <label className="field">
            <span>Type</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as ReplyKind)}>
              {(Object.keys(REPLY_KINDS) as ReplyKind[]).map((k) => (
                <option key={k} value={k}>
                  {REPLY_KINDS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Reply ($math$ works; - [ ] makes a checklist)</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={7} required />
          </label>
          {body.trim() && (
            <details>
              <summary className="hint">Preview</summary>
              <PostBody body={body} showLint={false} />
            </details>
          )}
          <div className="actions">
            <button type="submit">Post reply</button>
          </div>
        </form>
      )}
    </main>
  );
}
