import { useState } from "react";
import { API_PROVIDERS, API_PROVIDER_NAMES } from "@/engine/llm/models";
import { ModelPicker } from "./ModelPicker";
import { DEFAULT_SETTINGS, siteOrigin, type Settings, type WriterChoice } from "../settings";

const WRITERS: [WriterChoice, string][] = [
  ["ollama", "Ollama on this computer (free, default)"],
  ...API_PROVIDER_NAMES.map((p): [WriterChoice, string] => [p, `${API_PROVIDERS[p].label} with my own key`]),
  ["custom", "Another OpenAI-compatible API (Kimi, Qwen, Groq…)"],
];


export function SettingsPage({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => boolean }) {
  const [draft, setDraft] = useState(settings);
  const [status, setStatus] = useState<string | null>(null);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setStatus(null);
  };
  const origin = siteOrigin();

  return (
    <main className="shell narrow">
      <h1>Settings</h1>
      <p className="lede">Everything here is saved only in this browser.</p>

      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          setStatus(onSave(draft) ? "Saved." : "Couldn't save: this browser is blocking storage, so settings last until you close the tab.");
        }}
      >
        <label className="field">
          <span>Your name on posts (optional)</span>
          <input value={draft.name} onChange={(e) => set("name", e.target.value)} maxLength={40} placeholder="me" />
        </label>

        <fieldset className="field providers">
          <legend>Who writes the blocks</legend>
          {WRITERS.map(([w, label]) => (
            <label key={w} className="check">
              <input type="radio" name="writer" checked={draft.writer === w} onChange={() => set("writer", w)} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        {draft.writer === "ollama" ? (
          <>
            <div className="row">
              <label className="field">
                <span>Ollama address</span>
                <input value={draft.ollamaHost} onChange={(e) => set("ollamaHost", e.target.value)} />
              </label>
            </div>
            <ModelPicker writer="ollama" ollamaHost={draft.ollamaHost} value={draft.ollamaModel} onChange={(v) => set("ollamaModel", v)} />
            {origin === "null" ? (
              <div className="callout">
                <p>
                  <strong>This page was opened as a file.</strong> Ollama won't accept requests from file pages, so
                  generating with Ollama needs the web address instead:
                </p>
                <ul>
                  <li>the web edition on GitHub Pages, or</li>
                  <li>
                    <code>npm run preview</code>, then <code>http://localhost:4173/med-forge/</code> (Ollama already allows
                    localhost)
                  </li>
                </ul>
                <p className="hint">
                  Everything else works here: checking blocks, the notebook, and generating with an online model and your own key.
                </p>
              </div>
            ) : (
              <div className="callout">
                <p>
                  <strong>One-time setup.</strong> Install{" "}
                  <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
                    Ollama
                  </a>
                  , then download the model and allow this website to talk to it:
                </p>
                <pre>
                  <code>{`ollama pull ${draft.ollamaModel || DEFAULT_SETTINGS.ollamaModel}\nlaunchctl setenv OLLAMA_ORIGINS "${origin}"   # macOS, then restart Ollama`}</code>
                </pre>
                <p className="hint">
                  On Windows or Linux, set the environment variable <code>OLLAMA_ORIGINS={origin}</code> before starting Ollama.
                  Localhost addresses are allowed already.
                </p>
              </div>
            )}
          </>
        ) : (
          (() => {
            const w = draft.writer;
            const p = w === "custom" ? null : API_PROVIDERS[w];
            const setIn = (k: "apiKeys" | "apiModels", v: string) => set(k, { ...draft[k], [w]: v });
            return (
              <>
                {!p && (
                  <label className="field">
                    <span>API address</span>
                    <input value={draft.customBase} onChange={(e) => set("customBase", e.target.value)} placeholder="https://api.moonshot.ai/v1" spellCheck={false} />
                    <small className="hint">The base URL of an OpenAI-compatible API (it must allow requests from web pages).</small>
                  </label>
                )}
                <label className="field">
                  <span>{p?.label ?? "API"} key</span>
                  <input type="password" autoComplete="off" value={draft.apiKeys[w] ?? ""} onChange={(e) => setIn("apiKeys", e.target.value)} />
                  <small className="hint">
                    {p && (
                      <>
                        {p.keyHint}{" "}
                        <a href={p.keyHref} target="_blank" rel="noopener noreferrer">
                          Get a key
                        </a>
                        .{" "}
                      </>
                    )}
                    Stored in this browser and sent only to {p ? new URL(p.baseUrl).host : "that address"}. Anyone using this browser profile can read it, so
                    don't save it on a shared computer.
                  </small>
                </label>
                <ModelPicker writer={w} ollamaHost={draft.ollamaHost} value={draft.apiModels[w] || p?.defaultModel || ""} onChange={(v) => setIn("apiModels", v)} />
              </>
            );
          })()
        )}

        <fieldset className="field keys-group">
          <legend className="legend">Research keys (optional)</legend>
          <label className="field">
            <span>Perplexity API key</span>
            <input
              type="password"
              autoComplete="off"
              value={draft.perplexityKey}
              onChange={(e) => set("perplexityKey", e.target.value)}
              placeholder="pplx-…"
            />
            <small className="hint">Adds Perplexity academic search. Sent only to api.perplexity.ai.</small>
          </label>
          <label className="field">
            <span>OpenAlex API key</span>
            <input
              type="password"
              autoComplete="off"
              value={draft.openalexKey}
              onChange={(e) => set("openalexKey", e.target.value)}
              placeholder="free key from openalex.org"
            />
            <small className="hint">Adds OpenAlex paper search with abstracts. Sent only to api.openalex.org.</small>
          </label>
          <p className="hint">
            Elicit and Consensus block requests from web pages, so their keys only work in the command-line tool (npm run cli). Here, paste
            their results into the generator instead.
          </p>
        </fieldset>

        <div className="actions">
          <button type="submit">Save settings</button>
          {(Object.values(draft.apiKeys).some(Boolean) || draft.perplexityKey || draft.openalexKey) && (
            <button
              type="button"
              className="danger"
              onClick={() => setDraft((d) => ({ ...d, apiKeys: {}, perplexityKey: "", openalexKey: "" }))}
            >
              Remove all keys
            </button>
          )}
          {status && <span className="hint" role="status">{status}</span>}
        </div>
      </form>
    </main>
  );
}
