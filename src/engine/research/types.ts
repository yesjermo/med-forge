export type ProviderName = "crossref" | "openalex" | "elicit" | "consensus" | "perplexity" | "manual";

/** A paper or web page found during research, before numbering. */
export interface SourceDraft {
  title: string;
  authors: string[];
  year?: number;
  doi?: string;
  url?: string;
  venue?: string;
  /** Abstract excerpt, takeaway or answer snippet. */
  snippet?: string;
  /** Extra study info such as "rct, n=123" (Consensus/Elicit). */
  studyInfo?: string;
}

/** A numbered source the writer may cite as [S#]. */
export interface Source extends SourceDraft {
  id: string;
  foundBy: ProviderName[];
}

export interface SearchOptions {
  limit: number;
  signal?: AbortSignal;
  fetch?: typeof fetch;
}

export interface ResearchProvider {
  readonly name: ProviderName;
  readonly label: string;
  /** True when the provider needs no key or its key is set. */
  readonly available: boolean;
  /** Why it is unavailable, shown in the UI. */
  readonly hint: string;
  search(query: string, opts: SearchOptions): Promise<SourceDraft[]>;
}

export class ProviderError extends Error {
  constructor(
    public readonly provider: ProviderName,
    message: string,
  ) {
    super(`${provider}: ${message}`);
  }
}

export const USER_AGENT = "MedForge/0.1 (study-blocks generator; +https://github.com)";

/** Identify ourselves from Node; browsers' CORS rules for Crossref/OpenAlex reject a User-Agent header. */
export function nodeOnlyHeaders(): Record<string, string> {
  return typeof window === "undefined" ? { "User-Agent": USER_AGENT } : {};
}

export function cleanDoi(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const m = /10\.\d{4,9}\/[^\s"<>]+/i.exec(raw);
  return m ? m[0].replace(/[.,;)\]]+$/, "").toLowerCase() : undefined;
}

export function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function clip(s: string | undefined, n = 600): string | undefined {
  if (!s) return undefined;
  const t = s.trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

export async function getJson<T>(
  provider: ProviderName,
  url: string,
  init: RequestInit & { fetch?: typeof fetch },
): Promise<T> {
  const { fetch: f = fetch, ...rest } = init;
  let res: Response;
  try {
    res = await f(url, rest);
  } catch (err) {
    if (rest.signal?.aborted) throw err;
    throw new ProviderError(provider, "network error");
  }
  if (res.status === 401 || res.status === 403) throw new ProviderError(provider, "API key rejected");
  if (res.status === 402) throw new ProviderError(provider, "plan quota used up");
  if (res.status === 429) throw new ProviderError(provider, "rate limited, try again shortly");
  if (!res.ok) throw new ProviderError(provider, `HTTP ${res.status}`);
  return (await res.json()) as T;
}
