import { CrossrefProvider } from "./crossref";
import { cleanDoi, type SourceDraft } from "./types";

const DOI_RE = /10\.\d{4,9}\/[^\s"<>,;\])]+/gi;
const URL_RE = /https?:\/\/[^\s"<>\])]+/gi;

/**
 * Pull DOIs and links out of text pasted from Perplexity, Elicit or Consensus
 * (answers, exported CSV/RIS/BibTeX, or a plain list of links).
 */
export function extractReferences(text: string): { dois: string[]; urls: string[] } {
  const dois = new Set<string>();
  for (const m of text.matchAll(DOI_RE)) {
    const d = cleanDoi(m[0]);
    if (d) dois.add(d);
  }
  const urls = new Set<string>();
  for (const m of text.matchAll(URL_RE)) {
    const u = m[0].replace(/[.,;:]+$/, "");
    if (/doi\.org\/10\./i.test(u)) continue; // already captured as a DOI
    urls.add(u);
  }
  return { dois: [...dois], urls: [...urls] };
}

/** Turn pasted evidence into sources. DOIs are resolved through Crossref (free); links are kept as-is. */
export async function manualSources(
  text: string,
  opts: { signal?: AbortSignal; fetch?: typeof fetch; max?: number } = {},
): Promise<SourceDraft[]> {
  const { dois, urls } = extractReferences(text);
  const max = opts.max ?? 15;
  const crossref = new CrossrefProvider();
  const resolved = await Promise.all(
    dois.slice(0, max).map(async (doi): Promise<SourceDraft> => {
      const found = await crossref.lookup(doi, { ...(opts.signal ? { signal: opts.signal } : {}), ...(opts.fetch ? { fetch: opts.fetch } : {}) });
      return found ?? { title: `DOI ${doi}`, authors: [], doi, url: `https://doi.org/${doi}` };
    }),
  );
  const links = urls
    .slice(0, Math.max(0, max - resolved.length))
    .map((url): SourceDraft => ({ title: url, authors: [], url }));
  return [...resolved, ...links];
}
