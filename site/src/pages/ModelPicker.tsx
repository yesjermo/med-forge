import { useCallback, useEffect, useId, useRef, useState } from "react";
import { API_PROVIDERS, OLLAMA_MODELS, type ModelChoice } from "@/engine/llm/models";
import { DEFAULT_OLLAMA_HOST, listOllamaModels, sameModel, type InstalledModel } from "@/engine/llm/ollama";
import { siteOrigin, type WriterChoice } from "../settings";

const OTHER = "__other__";
const isLocal = (origin: string) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);

/**
 * Why Ollama can't be reached. A browser can't tell "not running" apart from "running but this
 * website isn't allowed" (both are a failed request), so on a published site we say both.
 */
function OllamaHelp({ host }: { host: string }) {
  const origin = siteOrigin();
  if (origin === "null") {
    return <>This page was opened as a file, and Ollama doesn't accept requests from files. Open MedForge from its website or run <code>npm run dev</code>.</>;
  }
  if (isLocal(origin)) {
    return <>Can't reach Ollama at {host}. Start the Ollama app (or run <code>ollama serve</code>), then check again.</>;
  }
  return (
    <>
      Can't reach Ollama at {host}. Either it isn't running, or it hasn't allowed this website yet. Start Ollama, then allow this
      site once and quit and reopen Ollama: <code>launchctl setenv OLLAMA_ORIGINS "{origin}"</code> on macOS, or set{" "}
      <code>OLLAMA_ORIGINS={origin}</code> on Windows or Linux. Use Chrome, Edge or Firefox (Safari blocks it).
    </>
  );
}
const gb = (bytes: number) => (bytes ? `${(bytes / 1e9).toFixed(1)} GB` : "cloud");

type Status = { kind: "loading" } | { kind: "ok"; installed: InstalledModel[] } | { kind: "offline"; message: string };

/** Ask Ollama which models are installed; refresh() asks again (e.g. after `ollama pull`). */
export function useOllamaModels(host: string, enabled = true) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (!enabled) return;
    setStatus({ kind: "loading" });
    const ctrl = new AbortController();
    // Ask straight away the first time (and on "Check again"); while the address is being typed,
    // wait for a pause. Give up after 5 s: an unreachable LAN host would otherwise hang for minutes.
    const delay = first.current ? 0 : 400;
    first.current = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const start = setTimeout(() => {
      timeout = setTimeout(() => ctrl.abort("timeout"), 5000);
      listOllamaModels(host || DEFAULT_OLLAMA_HOST, undefined, ctrl.signal).then(
        (installed) => !ctrl.signal.aborted && setStatus({ kind: "ok", installed }),
        (e: unknown) => {
          if (ctrl.signal.aborted && ctrl.signal.reason !== "timeout") return; // a newer request replaced this one
          setStatus({ kind: "offline", message: e instanceof Error ? e.message : String(e) });
        },
      );
    }, delay);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
      ctrl.abort("superseded");
    };
  }, [host, enabled, attempt]);
  const refresh = useCallback(() => {
    first.current = true;
    setAttempt((n) => n + 1);
  }, []);
  return { status, refresh };
}

/**
 * Choose the writer's model from a list instead of typing it. For Ollama it lists the models
 * installed on this computer first, then free ones to download; "Other…" takes any model id.
 */
export function ModelPicker({
  writer,
  value,
  onChange,
  ollamaHost,
  label = "Model",
}: {
  writer: WriterChoice;
  value: string;
  onChange: (model: string) => void;
  ollamaHost: string;
  label?: string;
}) {
  const id = useId();
  const isOllama = writer === "ollama";
  const { status, refresh } = useOllamaModels(ollamaHost, isOllama);
  const suggestions: readonly ModelChoice[] = isOllama ? OLLAMA_MODELS : writer === "custom" ? [] : API_PROVIDERS[writer].models;
  const installed = isOllama && status.kind === "ok" ? status.installed : [];
  const toDownload = suggestions.filter((m) => !installed.some((i) => sameModel(i.name, m.id)));
  const known = [...installed.map((m) => m.name), ...suggestions.map((m) => m.id)];
  const match = known.find((k) => sameModel(k, value));
  // "Other…" is a choice the student makes for one writer; a saved model that isn't in the list
  // (or isn't loaded yet) is shown as its own option instead of switching to the text box.
  const [otherFor, setOtherFor] = useState<WriterChoice | null>(null);
  const showOther = writer === "custom" || otherFor === writer;
  const current = value && !match ? value : null;
  const selected = showOther ? OTHER : (match ?? current ?? "");
  const missing = isOllama && status.kind === "ok" && value && !installed.some((i) => sameModel(i.name, value));

  return (
    <div className="field model-picker">
      <label htmlFor={id}>{label}</label>
      {writer !== "custom" && (
        <select
          id={id}
          value={selected}
          onChange={(e) => {
            if (e.target.value === OTHER) {
              setOtherFor(writer);
              return;
            }
            setOtherFor(null);
            onChange(e.target.value);
          }}
        >
          {!selected && <option value="">Choose a model…</option>}
          {current && (
            <option value={current}>
              {current}
              {isOllama && status.kind === "loading" ? "" : " (current)"}
            </option>
          )}
          {installed.length > 0 && (
            <optgroup label="Installed on this computer">
              {installed.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name.replace(/:latest$/, "")} · {gb(m.size)}
                </option>
              ))}
            </optgroup>
          )}
          {toDownload.length > 0 && (
            <optgroup label={isOllama ? "Free to download" : "Suggested"}>
              {toDownload.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} · {m.note}
                </option>
              ))}
            </optgroup>
          )}
          <option value={OTHER}>Other model id…</option>
        </select>
      )}
      {showOther && (
        <input
          aria-label={`${label} id`}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder={isOllama ? "e.g. llama3.2 or mistral" : "model id"}
          spellCheck={false}
          autoFocus={otherFor === writer}
        />
      )}
      {isOllama && (
        <small className="hint" role="status">
          {status.kind === "loading" && "Checking which models Ollama has…"}
          {status.kind === "ok" &&
            (installed.length ? `Ollama is running · ${installed.length} model${installed.length === 1 ? "" : "s"} installed.` : "Ollama is running but has no models yet.")}
          {status.kind === "offline" && <OllamaHelp host={ollamaHost || DEFAULT_OLLAMA_HOST} />}{" "}
          {missing && (
            <>
              <strong>{value}</strong> isn't downloaded yet: run <code>ollama pull {value}</code>
              {/-cloud$/.test(value) ? " after ollama signin" : ""}, then check again.{" "}
            </>
          )}
          {status.kind !== "loading" && (
            <button type="button" className="link-button" onClick={refresh}>
              Check again
            </button>
          )}
        </small>
      )}
    </div>
  );
}
