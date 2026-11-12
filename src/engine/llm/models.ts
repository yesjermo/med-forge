/**
 * Which models MedForge offers. Ollama is the free default; the API providers all speak the
 * OpenAI chat-completions format, so one writer (api.ts) covers them.
 * Model ids change often: these are suggestions, and every model field accepts any id.
 */

export interface ModelChoice {
  id: string;
  note: string;
}

/** Models to run with Ollama. "-cloud" models run on Ollama's servers after `ollama signin` (free, with hourly limits). */
export const OLLAMA_MODELS: ModelChoice[] = [
  { id: "qwen3", note: "Alibaba Qwen 3, 8B. Good all-rounder for a laptop" },
  { id: "qwen2.5", note: "Qwen 2.5, 7B. Smaller and faster" },
  { id: "gpt-oss", note: "OpenAI's open model, 20B. Needs about 16 GB of memory" },
  { id: "gemma3", note: "Google Gemma 3, 4B" },
  { id: "deepseek-r1", note: "DeepSeek R1, 8B. Reasons step by step, slower" },
  { id: "kimi-k2:1t-cloud", note: "Moonshot Kimi K2 on Ollama's cloud (ollama signin)" },
  { id: "gpt-oss:120b-cloud", note: "gpt-oss 120B on Ollama's cloud (ollama signin)" },
  { id: "deepseek-v3.1:671b-cloud", note: "DeepSeek V3.1 on Ollama's cloud (ollama signin)" },
];

export const API_PROVIDERS = {
  openrouter: {
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    env: "OPENROUTER_API_KEY",
    keyHref: "https://openrouter.ai/keys",
    keyHint: "One key for GPT, Sonnet, Gemini, Qwen, Kimi and more. Models ending in :free cost nothing (with daily limits).",
    defaultModel: "qwen/qwen3-235b-a22b:free",
    models: [
      { id: "qwen/qwen3-235b-a22b:free", note: "Qwen 3 235B, free" },
      { id: "moonshotai/kimi-k2:free", note: "Kimi K2, free" },
      { id: "deepseek/deepseek-r1:free", note: "DeepSeek R1, free" },
      { id: "openai/gpt-5", note: "GPT-5, paid" },
      { id: "anthropic/claude-sonnet-4.5", note: "Sonnet, paid" },
      { id: "google/gemini-2.5-pro", note: "Gemini 2.5 Pro, paid" },
    ],
  },
  gemini: {
    label: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    env: "GEMINI_API_KEY",
    keyHref: "https://aistudio.google.com/apikey",
    keyHint: "Free tier with daily limits from Google AI Studio.",
    defaultModel: "gemini-2.5-flash",
    models: [
      { id: "gemini-2.5-flash", note: "fast, free tier" },
      { id: "gemini-2.5-pro", note: "strongest, lower free limits" },
    ],
  },
  openai: {
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    env: "OPENAI_API_KEY",
    keyHref: "https://platform.openai.com/api-keys",
    keyHint: "Pay as you go.",
    defaultModel: "gpt-5-mini",
    models: [
      { id: "gpt-5-mini", note: "cheaper" },
      { id: "gpt-5", note: "strongest" },
    ],
  },
} as const;

export type ApiProvider = keyof typeof API_PROVIDERS;
export const API_PROVIDER_NAMES = Object.keys(API_PROVIDERS) as ApiProvider[];

export function isApiProvider(s: unknown): s is ApiProvider {
  return typeof s === "string" && Object.prototype.hasOwnProperty.call(API_PROVIDERS, s);
}

/** Drop a reasoning model's <think>…</think> preamble from its answer. */
export function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
}
