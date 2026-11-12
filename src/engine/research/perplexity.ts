import { clip, getJson, type ResearchProvider, type SearchOptions, type SourceDraft } from "./types";

interface SonarResponse {
  choices?: { message?: { content?: string } }[];
  citations?: string[];
  search_results?: { title?: string; url?: string; date?: string | null; snippet?: string }[];
}

/**
 * Perplexity Sonar web search (POST /v1/sonar) in academic mode.
 * Needs PERPLEXITY_API_KEY. Returns web/academic pages, not always papers with DOIs.
 */
export class PerplexityProvider implements ResearchProvider {
  readonly name = "perplexity" as const;
  readonly label = "Perplexity";
  readonly available: boolean;
  readonly hint: string;

  constructor(private readonly apiKey: string | undefined) {
    this.available = Boolean(apiKey);
    this.hint = apiKey ? "Key set." : "Set PERPLEXITY_API_KEY (pay-as-you-go, perplexity.ai/settings/api).";
  }

  async search(query: string, opts: SearchOptions): Promise<SourceDraft[]> {
    const data = await getJson<SonarResponse>("perplexity", "https://api.perplexity.ai/v1/sonar", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "sonar",
        search_mode: "academic",
        messages: [
          {
            role: "user",
            content: `Find the most relevant peer-reviewed or authoritative sources for: ${query}. Answer in 3 sentences.`,
          },
        ],
      }),
      signal: opts.signal ?? null,
      fetch: opts.fetch,
    });
    const results = data.search_results?.length
      ? data.search_results
      : (data.citations ?? []).map((url) => ({ url, title: url }));
    return results.slice(0, opts.limit).flatMap((r): SourceDraft[] => {
      if (!r.url) return [];
      const year = "date" in r && r.date ? Number(String(r.date).slice(0, 4)) || undefined : undefined;
      const snippet = clip("snippet" in r ? r.snippet : undefined);
      return [
        {
          title: r.title || r.url,
          authors: [],
          url: r.url,
          ...(year ? { year } : {}),
          ...(snippet ? { snippet } : {}),
        },
      ];
    });
  }
}
