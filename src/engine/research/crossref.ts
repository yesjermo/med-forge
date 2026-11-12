import { nodeOnlyHeaders, cleanDoi, clip, getJson, stripTags, type ResearchProvider, type SearchOptions, type SourceDraft } from "./types";

interface CrossrefItem {
  DOI?: string;
  title?: string[];
  author?: { given?: string; family?: string; name?: string }[];
  issued?: { "date-parts"?: (number | null)[][] };
  "container-title"?: string[];
  abstract?: string;
  URL?: string;
}

export function crossrefItemToDraft(it: CrossrefItem): SourceDraft | null {
  const title = it.title?.[0]?.trim();
  if (!title) return null;
  const year = it.issued?.["date-parts"]?.[0]?.[0] ?? undefined;
  const doi = cleanDoi(it.DOI);
  const venue = it["container-title"]?.[0];
  const snippet = clip(it.abstract ? stripTags(it.abstract).replace(/^Abstract\s*/i, "") : undefined);
  return {
    title: stripTags(title),
    authors: (it.author ?? [])
      .map((a) => a.name ?? [a.family, a.given].filter(Boolean).join(", "))
      .filter(Boolean),
    ...(year ? { year } : {}),
    ...(doi ? { doi, url: `https://doi.org/${doi}` } : it.URL ? { url: it.URL } : {}),
    ...(venue ? { venue } : {}),
    ...(snippet ? { snippet } : {}),
  };
}

/** Crossref: free, no key. Good metadata and DOIs; abstracts only for some papers. */
export class CrossrefProvider implements ResearchProvider {
  readonly name = "crossref" as const;
  readonly label = "Crossref (free)";
  readonly available = true;
  readonly hint = "Free, no key needed.";

  async search(query: string, opts: SearchOptions): Promise<SourceDraft[]> {
    const params = new URLSearchParams({
      query,
      rows: String(opts.limit),
      select: "DOI,title,author,issued,container-title,abstract,URL",
      filter: "type:journal-article",
    });
    const data = await getJson<{ message?: { items?: CrossrefItem[] } }>(
      "crossref",
      `https://api.crossref.org/works?${params}`,
      { headers: nodeOnlyHeaders(), signal: opts.signal ?? null, fetch: opts.fetch },
    );
    return (data.message?.items ?? []).map(crossrefItemToDraft).filter((d): d is SourceDraft => d !== null);
  }

  /** Look up one DOI (used to resolve DOIs pasted by the user). */
  async lookup(doi: string, opts: Omit<SearchOptions, "limit">): Promise<SourceDraft | null> {
    try {
      const data = await getJson<{ message?: CrossrefItem }>(
        "crossref",
        `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
        { headers: nodeOnlyHeaders(), signal: opts.signal ?? null, fetch: opts.fetch },
      );
      return data.message ? crossrefItemToDraft(data.message) : null;
    } catch {
      return null;
    }
  }
}
