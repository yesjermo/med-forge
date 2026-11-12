import { OllamaWriter, DEFAULT_OLLAMA_HOST, DEFAULT_OLLAMA_MODEL } from "@/engine/llm/ollama";
import { CrossrefProvider } from "@/engine/research/crossref";
import { OpenAlexProvider } from "@/engine/research/openalex";
import { PerplexityProvider } from "@/engine/research/perplexity";
import { ApiWriter } from "@/engine/llm/api";
import { API_PROVIDERS, isApiProvider, type ApiProvider } from "@/engine/llm/models";
import type { Writer } from "@/engine/llm/types";

/** Visitor settings, saved only in this browser. Keys go only to their own provider. */
/** "custom" is any other OpenAI-compatible endpoint (Moonshot Kimi, Alibaba Qwen, Groq, a local server…). */
export type WriterChoice = "ollama" | ApiProvider | "custom";
type Online = Exclude<WriterChoice, "ollama">;

export interface Settings {
  writer: WriterChoice;
  ollamaHost: string;
  ollamaModel: string;
  /** Keys and models for the online writers, saved per provider. */
  apiKeys: Partial<Record<Online, string>>;
  apiModels: Partial<Record<Online, string>>;
  customBase: string;
  /** Research keys usable from a browser (their APIs allow it). Elicit/Consensus block browsers. */
  perplexityKey: string;
  openalexKey: string;
  name: string;
}

export const SETTINGS_KEY = "study-forge:settings";

export const DEFAULT_SETTINGS: Settings = {
  writer: "ollama",
  ollamaHost: DEFAULT_OLLAMA_HOST,
  ollamaModel: DEFAULT_OLLAMA_MODEL,
  apiKeys: {},
  apiModels: {},
  customBase: "",
  perplexityKey: "",
  openalexKey: "",
  name: "",
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const s = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
    // The Claude writer was removed; fall back to the free default.
    if (s.writer !== "ollama" && s.writer !== "custom" && !isApiProvider(s.writer)) s.writer = "ollama";
    delete (s as Partial<Record<string, unknown>>).claudeKey;
    delete (s as Partial<Record<string, unknown>>).claudeModel;
    return s;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings): boolean {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

/** Research providers available with the visitor's keys: Crossref always, Perplexity/OpenAlex with a key. */
// These are small and Crossref is already in the main bundle (pasted-evidence lookups use it), so import directly.
export function makeProviders(s: Settings, enabled: { crossref: boolean; perplexity: boolean; openalex: boolean }) {
  return [
    ...(enabled.crossref ? [new CrossrefProvider()] : []),
    ...(enabled.perplexity && s.perplexityKey.trim() ? [new PerplexityProvider(s.perplexityKey.trim())] : []),
    ...(enabled.openalex && s.openalexKey.trim() ? [new OpenAlexProvider(s.openalexKey.trim())] : []),
  ];
}

/**
 * The origin Ollama will see. Pages opened from a file report location.origin as "file://"
 * in Chromium but send `Origin: null` on requests, so treat any file: page as "null".
 */
export function siteOrigin(): string {
  return window.location.protocol === "file:" ? "null" : window.location.origin;
}

/** Label for the current writer, e.g. "Ollama · qwen3" or "OpenRouter · moonshotai/kimi-k2:free". */
export function writerLabel(s: Settings): string {
  if (s.writer === "ollama") return `Ollama · ${s.ollamaModel || DEFAULT_OLLAMA_MODEL}`;
  return `${s.writer === "custom" ? "Custom API" : API_PROVIDERS[s.writer].label} · ${modelFor(s)}`;
}

function modelFor(s: Settings): string {
  if (s.writer === "ollama") return s.ollamaModel || DEFAULT_OLLAMA_MODEL;
  return s.apiModels[s.writer]?.trim() || (s.writer === "custom" ? "" : API_PROVIDERS[s.writer].defaultModel);
}

export async function makeWriter(s: Settings): Promise<Writer> {
  if (s.writer === "ollama") {
    return new OllamaWriter({ host: s.ollamaHost || DEFAULT_OLLAMA_HOST, model: modelFor(s), origin: siteOrigin() });
  }
  const p = s.writer === "custom" ? null : API_PROVIDERS[s.writer];
  const label = p?.label ?? "Your API";
  const apiKey = s.apiKeys[s.writer]?.trim();
  const baseUrl = p?.baseUrl ?? s.customBase.trim();
  const model = modelFor(s);
  if (!apiKey) throw new Error(`Add your ${label} key in Settings, or switch the writer to the free Ollama default.`);
  if (!/^https:\/\/|^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(baseUrl)) throw new Error("Set the API address in Settings (https://…).");
  if (!model) throw new Error("Set the model name in Settings.");
  return new ApiWriter({ name: s.writer, label, baseUrl, apiKey, model });
}
