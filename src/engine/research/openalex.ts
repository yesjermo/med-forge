import { nodeOnlyHeaders, cleanDoi, clip, getJson, type ResearchProvider, type SearchOptions, type SourceDraft } from "./types";

interface OpenAlexWork {
  doi?: string | null;
  display_name?: string | null;
  publication_year?: number | null;
  authorships?: { author?: { display_name?: string } }[];
  primary_location?: { source?: { display_name?: string } | null; landing_page_url?: string | null } | null;
  abstract_inverted_index?: Record<string, number[]> | null;
}

/** Rebuild an abstract from OpenAlex's inverted index. */
export function invertedToText(idx: Record<string, number[]> | null | undefined): string | undefined {
  if (!idx) return undefined;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(idx)) for (const p of positions) words[p] = word;
  return words.filter(Boolean).join(" ");
}

/** OpenAlex: open scholarly index. Enabled when OPENALEX_API_KEY is set (free key at openalex.org). */
export class OpenAlexProvider implements ResearchProvider {
  readonly name = "openalex" as const;
  readonly label = "OpenAlex";
  readonly available: boolean;
  readonly hint: string;

  constructor(private readonly apiKey: string | undefined) {
    this.available = Boolean(apiKey);
    this.hint = apiKey ? "Free key set." : "Set OPENALEX_API_KEY (free key from openalex.org/settings/api).";
  }

  async search(query: string, opts: SearchOptions): Promise<SourceDraft[]> {
    const params = new URLSearchParams({
      search: query,
      "per-page": String(opts.limit),
      select: "doi,display_name,publication_year,authorships,primary_location,abstract_inverted_index",
      api_key: this.apiKey ?? "",
    });
    const data = await getJson<{ results?: OpenAlexWork[] }>("openalex", `https://api.openalex.org/works?${params}`, {
      headers: nodeOnlyHeaders(),
      signal: opts.signal ?? null,
      fetch: opts.fetch,
    });
    return (data.results ?? []).flatMap((w): SourceDraft[] => {
      if (!w.display_name) return [];
      const doi = cleanDoi(w.doi);
      const venue = w.primary_location?.source?.display_name;
      const snippet = clip(invertedToText(w.abstract_inverted_index));
      const url = doi ? `https://doi.org/${doi}` : w.primary_location?.landing_page_url;
      return [
        {
          title: w.display_name,
          authors: (w.authorships ?? []).map((a) => a.author?.display_name ?? "").filter(Boolean),
          ...(w.publication_year ? { year: w.publication_year } : {}),
          ...(doi ? { doi } : {}),
          ...(url ? { url } : {}),
          ...(venue ? { venue } : {}),
          ...(snippet ? { snippet } : {}),
        },
      ];
    });
  }
}
