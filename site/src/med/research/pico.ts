/**
 * PICO question framing and PubMed query building. Pure string functions, no network.
 */

export type PicoElement = "population" | "intervention" | "comparison" | "outcome";

export const PICO_ELEMENTS: PicoElement[] = ["population", "intervention", "comparison", "outcome"];

export type StudyType = "randomized controlled trial" | "systematic review" | "meta-analysis";

export const STUDY_TYPES: StudyType[] = ["randomized controlled trial", "systematic review", "meta-analysis"];

const PUBLICATION_TYPE: Record<StudyType, string> = {
  "randomized controlled trial": "Randomized Controlled Trial",
  "systematic review": "Systematic Review",
  "meta-analysis": "Meta-Analysis",
};

export interface Pico {
  population: string;
  intervention: string;
  /** Optional: leave empty when there is no comparator. */
  comparison?: string;
  outcome: string;
}

export interface PicoQueryInput extends Pico {
  synonyms?: Partial<Record<PicoElement, string[]>>;
  filters?: {
    /** Limit to publications from the last N years. */
    years?: number;
    studyTypes?: StudyType[];
  };
}

/** Tidy one search term: drop characters that would break PubMed syntax, collapse spaces. */
function cleanTerm(t: string): string {
  return t.replace(/["[\]()]/g, " ").replace(/\s+/g, " ").trim();
}

/** Split a comma- or semicolon-separated list of synonyms. */
export const splitSynonyms = (raw: string): string[] => raw.split(/[,;]/).map(cleanTerm).filter(Boolean);

/** One OR group of quoted title/abstract terms, de-duplicated case-insensitively (first spelling wins). */
function group(main: string | undefined, extra: string[] | undefined): string | null {
  const terms = new Map<string, string>();
  for (const t of [main ?? "", ...(extra ?? [])].map(cleanTerm)) if (t && !terms.has(t.toLowerCase())) terms.set(t.toLowerCase(), `"${t}"[tiab]`);
  return terms.size ? `(${[...terms.values()].join(" OR ")})` : null;
}

/**
 * Build a PubMed query from a PICO question. Each element becomes an OR group of quoted
 * title/abstract terms; groups are joined with AND. Empty elements are skipped.
 *
 * The year filter starts at `currentYear − years` so a rolling "last N years" window is fully covered.
 *
 * @example buildPubmedQuery({ population: "heart failure", intervention: "SGLT2 inhibitor", outcome: "hospitalisation" })
 *   // ("heart failure"[tiab]) AND ("SGLT2 inhibitor"[tiab]) AND ("hospitalisation"[tiab])
 */
export function buildPubmedQuery(input: PicoQueryInput, currentYear: number = new Date().getFullYear()): string {
  const parts = PICO_ELEMENTS.map((el) => group(input[el], input.synonyms?.[el])).filter((g): g is string => g !== null);
  const types = [...new Set(input.filters?.studyTypes ?? [])];
  if (types.length) {
    const pt = types.map((t) => `"${PUBLICATION_TYPE[t]}"[pt]`);
    parts.push(pt.length === 1 ? pt[0]! : `(${pt.join(" OR ")})`);
  }
  const years = input.filters?.years;
  if (years !== undefined && Number.isFinite(years) && years > 0) {
    if (!Number.isInteger(currentYear)) throw new RangeError("currentYear must be a whole year");
    parts.push(`("${currentYear - Math.floor(years)}"[dp] : "3000"[dp])`);
  }
  return parts.join(" AND ");
}

/** Link that runs the query on PubMed. */
export function pubmedUrl(query: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}`;
}

const tidy = (s: string | undefined) => (s ?? "").trim().replace(/[\s.?!]+$/, "");

/**
 * Frame the PICO as one answerable clinical question.
 * Returns "" until population, intervention and outcome are all filled in.
 */
export function framePicoQuestion(pico: Pico): string {
  const [p, i, c, o] = PICO_ELEMENTS.map((el) => tidy(pico[el]));
  if (!p || !i || !o) return "";
  return c ? `In ${p}, does ${i} compared with ${c} change ${o}?` : `In ${p}, does ${i} change ${o}?`;
}
