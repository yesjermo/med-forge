import { cleanDoi, clip, getJson, type ResearchProvider, type SearchOptions, type SourceDraft } from "./types";

interface ElicitPaper {
  title?: string;
  authors?: string[] | { name?: string }[];
  year?: number | null;
  doi?: string | null;
  abstract?: string | null;
  venue?: string | null;
  urls?: string[] | null;
  studyTypeTags?: string[] | null;
  citedByCount?: number | null;
}

/** Elicit paper search (POST /api/v2/search/papers). Needs ELICIT_API_KEY on a Pro plan or above. */
export class ElicitProvider implements ResearchProvider {
  readonly name = "elicit" as const;
  readonly label = "Elicit";
  readonly available: boolean;
  readonly hint: string;

  constructor(private readonly apiKey: string | undefined) {
    this.available = Boolean(apiKey);
    this.hint = apiKey ? "Key set." : "Set ELICIT_API_KEY (Elicit Pro plan or above, elicit.com/developer).";
  }

  async search(query: string, opts: SearchOptions): Promise<SourceDraft[]> {
    const data = await getJson<{ papers?: ElicitPaper[] }>("elicit", "https://elicit.com/api/v2/search/papers", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, maxResults: opts.limit }),
      signal: opts.signal ?? null,
      fetch: opts.fetch,
    });
    return (data.papers ?? []).flatMap((p): SourceDraft[] => {
      if (!p.title) return [];
      const doi = cleanDoi(p.doi);
      const authors = (p.authors ?? []).map((a) => (typeof a === "string" ? a : (a.name ?? ""))).filter(Boolean);
      const url = doi ? `https://doi.org/${doi}` : p.urls?.[0];
      const studyInfo = p.studyTypeTags?.length ? p.studyTypeTags.join(", ") : undefined;
      const snippet = clip(p.abstract ?? undefined);
      return [
        {
          title: p.title,
          authors,
          ...(p.year ? { year: p.year } : {}),
          ...(doi ? { doi } : {}),
          ...(url ? { url } : {}),
          ...(p.venue ? { venue: p.venue } : {}),
          ...(snippet ? { snippet } : {}),
          ...(studyInfo ? { studyInfo } : {}),
        },
      ];
    });
  }
}
