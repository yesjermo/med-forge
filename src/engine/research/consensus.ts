import { cleanDoi, clip, getJson, type ResearchProvider, type SearchOptions, type SourceDraft } from "./types";

interface ConsensusResult {
  title?: string;
  authors?: string[];
  publish_year?: number | null;
  doi?: string | null;
  journal_name?: string | null;
  takeaway?: string | null;
  abstract?: string | null;
  url?: string | null;
  study_type?: string | null;
  sample_size?: number | null;
}

/** Consensus search (GET /v1/search). Needs CONSENSUS_API_KEY; the free plan includes 30 calls a month. */
export class ConsensusProvider implements ResearchProvider {
  readonly name = "consensus" as const;
  readonly label = "Consensus";
  readonly available: boolean;
  readonly hint: string;

  constructor(private readonly apiKey: string | undefined) {
    this.available = Boolean(apiKey);
    this.hint = apiKey ? "Key set." : "Set CONSENSUS_API_KEY (free plan: 30 calls/month, consensus.app/api-mcp).";
  }

  async search(query: string, opts: SearchOptions): Promise<SourceDraft[]> {
    const params = new URLSearchParams({ query, page_size: String(opts.limit) });
    const data = await getJson<{ results?: ConsensusResult[] }>(
      "consensus",
      `https://api.consensus.app/v1/search?${params}`,
      { headers: { "x-api-key": this.apiKey ?? "" }, signal: opts.signal ?? null, fetch: opts.fetch },
    );
    return (data.results ?? []).flatMap((r): SourceDraft[] => {
      if (!r.title) return [];
      const doi = cleanDoi(r.doi);
      const info = [r.study_type, r.sample_size ? `n=${r.sample_size}` : null].filter(Boolean).join(", ");
      const snippet = clip(r.takeaway ?? r.abstract ?? undefined);
      const url = doi ? `https://doi.org/${doi}` : r.url;
      return [
        {
          title: r.title,
          authors: r.authors ?? [],
          ...(r.publish_year ? { year: r.publish_year } : {}),
          ...(doi ? { doi } : {}),
          ...(url ? { url } : {}),
          ...(r.journal_name ? { venue: r.journal_name } : {}),
          ...(snippet ? { snippet } : {}),
          ...(info ? { studyInfo: info } : {}),
        },
      ];
    });
  }
}
