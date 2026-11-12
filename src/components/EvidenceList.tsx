import type { ResearchEvent } from "@/engine/research/pipeline";
import type { Source } from "@/engine/research/types";

const PROVIDER_LABEL: Record<string, string> = {
  crossref: "Crossref",
  openalex: "OpenAlex",
  elicit: "Elicit",
  consensus: "Consensus",
  perplexity: "Perplexity",
  manual: "Pasted",
};

function authorLine(authors: string[]): string {
  if (authors.length === 0) return "";
  return authors.length > 3 ? `${authors.slice(0, 3).join("; ")} et al.` : authors.join("; ");
}

export function EvidenceList({
  queries,
  research,
  sources,
}: {
  queries: string[];
  research: ResearchEvent[];
  sources: Source[];
}) {
  return (
    <details className="evidence" open>
      <summary>
        Evidence: {sources.length} source{sources.length === 1 ? "" : "s"}
      </summary>
      {queries.length > 0 && (
        <p className="hint">
          Searched: {queries.map((q, i) => (
            <code key={i}>{q}</code>
          ))}
        </p>
      )}
      {research.length > 0 && (
        <p className="hint">
          {research.map((r) => (
            <span key={r.provider} className={`tag ${r.ok ? "" : "tag-error"}`} title={r.error}>
              {PROVIDER_LABEL[r.provider] ?? r.provider}: {r.ok ? r.count : "failed"}
            </span>
          ))}
        </p>
      )}
      <ol className="sources">
        {sources.map((s) => {
          const href = s.doi ? `https://doi.org/${s.doi}` : s.url;
          return (
            <li key={s.id} id={`src-${s.id}`}>
              <span className="src-id">[{s.id}]</span>{" "}
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
              <div className="src-meta">
                {[authorLine(s.authors), s.venue, s.year].filter(Boolean).join(" · ")}
                {s.studyInfo && <> · {s.studyInfo}</>}
                {s.foundBy.map((p) => (
                  <span key={p} className="tag">
                    {PROVIDER_LABEL[p] ?? p}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </details>
  );
}
