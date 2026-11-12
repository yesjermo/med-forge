/**
 * Look up a DOI on Crossref and format the reference in AMA (11th ed.) and APA (7th ed.) style.
 */
import { cleanDoi, nodeOnlyHeaders, stripTags } from "@/engine/research/types";

export interface CitationAuthor {
  given?: string;
  family?: string;
}

export interface CitationData {
  authors: CitationAuthor[];
  title: string;
  journal: string;
  year?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi: string;
}

interface CrossrefWork {
  DOI?: string;
  title?: string[];
  author?: { given?: string; family?: string; name?: string }[];
  "container-title"?: string[];
  issued?: { "date-parts"?: (number | null)[][] };
  "published-print"?: { "date-parts"?: (number | null)[][] };
  "published-online"?: { "date-parts"?: (number | null)[][] };
  volume?: string;
  issue?: string;
  page?: string;
  "article-number"?: string;
}

const ENTITIES: Record<string, string> = { lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };

/** Strip tags and decode common entities (&amp; last, so "&amp;lt;" stays "&lt;"). */
const clean = (s: string | undefined) =>
  s ? stripTags(s).replace(/&(lt|gt|quot|#39|apos|nbsp);/g, (_, e: string) => ENTITIES[e]!).replace(/&amp;/g, "&") : "";

/** Turn a Crossref work record into citation data. Exported for tests. */
export function crossrefToCitation(w: CrossrefWork, fallbackDoi: string): CitationData {
  const year = [w.issued, w["published-print"], w["published-online"]].map((d) => d?.["date-parts"]?.[0]?.[0]).find((y) => y != null);
  const pages = w.page ?? w["article-number"];
  return {
    authors: (w.author ?? [])
      .map((a) => (a.family || a.given ? { ...(a.given ? { given: a.given } : {}), ...(a.family ? { family: a.family } : {}) } : a.name ? { family: a.name } : null))
      .filter((a): a is CitationAuthor => a !== null),
    title: clean(w.title?.[0]),
    journal: clean(w["container-title"]?.[0]),
    ...(year ? { year } : {}),
    ...(w.volume ? { volume: w.volume } : {}),
    ...(w.issue ? { issue: w.issue } : {}),
    ...(pages ? { pages } : {}),
    doi: cleanDoi(w.DOI) ?? fallbackDoi,
  };
}

/**
 * Fetch metadata for a DOI from Crossref. Accepts a bare DOI, "doi:…" or a doi.org link.
 * Sends no User-Agent from a browser (Crossref's CORS rules reject it).
 * @throws Error with a readable message: not a DOI, DOI not found, network or HTTP error.
 */
export async function fetchCitationData(doi: string, fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis)): Promise<CitationData> {
  const id = cleanDoi(doi);
  if (!id) throw new Error("That doesn't look like a DOI. DOIs start with 10. followed by a slash, e.g. 10.1056/NEJMoa2034577.");
  let res: Response;
  try {
    res = await fetchImpl(`https://api.crossref.org/works/${encodeURIComponent(id)}`, { headers: nodeOnlyHeaders() });
  } catch {
    throw new Error("Couldn't reach Crossref. Check your connection and try again.");
  }
  if (res.status === 404) throw new Error(`DOI not found: ${id}. Check it for typos; some DOIs (e.g. DataCite) aren't in Crossref.`);
  if (res.status === 429) throw new Error("Crossref is rate limiting requests. Try again in a minute.");
  if (!res.ok) throw new Error(`Crossref returned an error (HTTP ${res.status}).`);
  const body = (await res.json()) as { message?: CrossrefWork };
  if (!body.message) throw new Error("Crossref returned no record for this DOI.");
  return crossrefToCitation(body.message, id);
}

/** Name parts of a given name, e.g. "Jean-Pierre A." → [["Jean","Pierre"],["A"]]. */
function givenParts(given: string | undefined): string[][] {
  return (given ?? "")
    .replace(/\./g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.split("-").filter(Boolean));
}

/** AMA initials: no periods or spaces ("Jean-Pierre Andrew" → "JPA"). */
function amaInitials(given: string | undefined): string {
  return givenParts(given)
    .flat()
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** APA initials: "Jean-Pierre Andrew" → "J.-P. A." */
function apaInitials(given: string | undefined): string {
  return givenParts(given)
    .map((parts) => parts.map((w) => `${w[0]!.toUpperCase()}.`).join("-"))
    .join(" ");
}

const pageRange = (p: string, dash: string) => p.replace(/\s*[-–—]\s*/, dash);

/** Add a full stop unless the text already ends with terminal punctuation. */
const stop = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`);

/**
 * AMA 11th edition: up to 6 authors listed; more than 6 → first 3 then "et al."
 * "Surname AB, Surname C. Title. Journal. Year;Vol(Issue):pages. doi:10.x/y"
 */
export function formatAMA(d: CitationData): string {
  const names = d.authors.map((a) => [a.family, amaInitials(a.given)].filter(Boolean).join(" "));
  const shown = names.length > 6 ? [...names.slice(0, 3), "et al"] : names;
  const out: string[] = [];
  if (shown.length) out.push(stop(shown.join(", ")));
  if (d.title) out.push(stop(d.title));
  if (d.journal) out.push(stop(d.journal));
  let loc = d.year ? String(d.year) : "";
  if (d.volume) loc += `${loc ? ";" : ""}${d.volume}${d.issue ? `(${d.issue})` : ""}`;
  else if (d.issue) loc += `${loc ? ";" : ""}(${d.issue})`;
  if (d.pages) loc += `:${pageRange(d.pages, "-")}`;
  if (loc) out.push(`${loc}.`);
  out.push(`doi:${d.doi}`);
  return out.join(" ");
}

/**
 * APA 7th edition: up to 20 authors; 21 or more → first 19, an ellipsis, then the last author.
 * "Surname, I. I., & Surname, I. (Year). Title. Journal, Vol(Issue), pages. https://doi.org/10.x/y"
 */
export function formatAPA(d: CitationData): string {
  const names = d.authors.map((a) => {
    const init = apaInitials(a.given);
    return a.family ? (init ? `${a.family}, ${init}` : a.family) : init;
  });
  const last = names[names.length - 1];
  const authors =
    names.length > 20 ? `${names.slice(0, 19).join(", ")}, . . . ${last}` : names.length > 1 ? `${names.slice(0, -1).join(", ")}, & ${last}` : (last ?? "");

  const date = `(${d.year ?? "n.d."}).`;
  const title = d.title ? stop(d.title) : "";
  let source = d.journal;
  if (d.volume) source += `${source ? ", " : ""}${d.volume}${d.issue ? `(${d.issue})` : ""}`;
  if (d.pages) source += `${source ? ", " : ""}${pageRange(d.pages, "–")}`;
  const out = authors ? [stop(authors), date, title] : [title, date];
  if (source) out.push(stop(source));
  out.push(`https://doi.org/${d.doi}`);
  return out.filter(Boolean).join(" ");
}
