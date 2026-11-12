import { ApiWriter } from "./api";
import { API_PROVIDERS, API_PROVIDER_NAMES, isApiProvider, type ApiProvider } from "./models";
import { OllamaWriter } from "./ollama";
import type { Writer } from "./types";

type Env = Record<string, string | undefined>;

/** Writers that can run with the current environment: Ollama always, an API provider when its key is set. */
export function availableWriters(env: Env = process.env): string[] {
  return ["ollama", ...API_PROVIDER_NAMES.filter((p) => env[API_PROVIDERS[p].env])];
}

const MODEL_RE = /^[\w.:/@-]{1,120}$/;

/**
 * Pick the writer: explicit choice, then STUDYFORGE_WRITER, then the free local default (Ollama).
 * `model` (e.g. from the page) overrides OLLAMA_MODEL / STUDYFORGE_MODEL when it looks like a model id.
 */
export function createWriter(choice?: string, env: Env = process.env, model?: string): Writer {
  const name = choice || env.STUDYFORGE_WRITER || "ollama";
  const picked = model && MODEL_RE.test(model) ? model : undefined;
  if (name === "ollama") {
    const m = picked || env.OLLAMA_MODEL;
    return new OllamaWriter({ ...(env.OLLAMA_HOST ? { host: env.OLLAMA_HOST } : {}), ...(m ? { model: m } : {}) });
  }
  if (!isApiProvider(name)) throw new Error(`Unknown writer "${name}". Use one of: ${["ollama", ...API_PROVIDER_NAMES].join(", ")}.`);
  const p: (typeof API_PROVIDERS)[ApiProvider] = API_PROVIDERS[name];
  const apiKey = env[p.env];
  if (!apiKey) throw new Error(`${p.label} needs an API key: add yours on the Keys page (or set ${p.env}), or use the free Ollama writer.`);
  return new ApiWriter({ name, label: p.label, baseUrl: p.baseUrl, apiKey, model: picked || env.STUDYFORGE_MODEL || p.defaultModel });
}
