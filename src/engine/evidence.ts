import { extractReferences } from "./research/manual";
import type { Source } from "./research/types";
import type { LintOptions } from "./validator";

/** One line describing a source: authors | title | venue | year | doi-or-url. */
export function sourceLine(s: Pick<Source, "authors" | "title" | "venue" | "year" | "doi" | "url">): string {
  const authors = s.authors.length > 3 ? `${s.authors.slice(0, 3).join("; ")} et al.` : s.authors.join("; ");
  return [authors || null, s.title, s.venue ?? null, s.year ? String(s.year) : null, s.doi ? `doi:${s.doi}` : (s.url ?? null)]
    .filter(Boolean)
    .join(" | ");
}

/**
 * A `References:` list appended after the blocks when a pack leaves the generator
 * (download, share to hub), so its [S#] tags still resolve. The parser reads it back.
 */
export function formatReferences(sources: Source[]): string {
  if (sources.length === 0) return "";
  return ["References:", ...sources.map((s) => `- [${s.id}] ${sourceLine(s)}`)].join("\n");
}

/** Lint options for a researched run. Used by both the server pipeline and the browser, so they agree. */
export function lintOptionsFor(sources: Source[], input: string): Required<LintOptions> {
  const dois = [...sources.flatMap((s) => (s.doi ? [s.doi] : [])), ...extractReferences(input).dois];
  return { sourceIds: sources.map((s) => s.id), allowedDois: [...new Set(dois)] };
}
