import { ADVICE_SECTIONS, normalizeAdvice, type AdviceCheck } from "@/engine/advise";
import { splitSections } from "@/engine/parser";
import { renderSection } from "@/components/markup";

const AREA_LABEL: Record<AdviceCheck["area"], string> = { sources: "Sources", thesis: "Thesis", idea: "Idea" };

/**
 * Shows advisor output: instant automatic checks, then the AI's four sections
 * (Sources / Thesis / Idea / Next searches). Safe: all text goes through renderSection.
 */
export function AdvicePanel({
  checks,
  text,
  running,
  error,
  knownIds,
  onUseSearch,
}: {
  checks: AdviceCheck[];
  text: string;
  running: boolean;
  error?: string | null;
  /** Source tags that really exist for this work; advice lines citing others are hidden. */
  knownIds?: string[];
  /** When given, each suggested search gets a button that uses it (e.g. as the research lead). */
  onUseSearch?: (query: string) => void;
}) {
  // Normalize while streaming too, so partial output already lands in the four sections.
  const { sections } = splitSections(normalizeAdvice(text, knownIds).split("\n"), 1);
  const named = ADVICE_SECTIONS.flatMap((name) => (sections[name]?.trim() ? [[name, sections[name]!] as const] : []));
  const searches = (sections["Next searches"] ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s+/, "").replace(/^["“]|["”]$/g, "").trim())
    .filter((l) => l.length > 2);

  return (
    <section className="advice" aria-live="polite">
      <h3>Advice</h3>
      {checks.length > 0 && (
        <ul className="advice-checks">
          {checks.map((c, i) => (
            <li key={i} className={`advice-check ${c.level}`}>
              <span className="tag">{AREA_LABEL[c.area]}</span>
              <span>{c.message}</span>
            </li>
          ))}
        </ul>
      )}
      {checks.length === 0 && !running && !text && !error && <p className="hint">No automatic issues found.</p>}

      {named.length > 0 ? (
        <div className="advice-sections">
          {named.map(([name, body]) => (
            <div key={name} className="advice-section">
              <h4>{name}</h4>
              {name === "Next searches" && onUseSearch && searches.length > 0 ? (
                <ul className="advice-searches">
                  {searches.map((q) => (
                    <li key={q}>
                      <code>{q}</code>
                      <button type="button" className="ghost small" onClick={() => onUseSearch(q)}>
                        Use as lead
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderSection(body) }} />
              )}
            </div>
          ))}
        </div>
      ) : (
        text && <div className="prose" dangerouslySetInnerHTML={{ __html: renderSection(normalizeAdvice(text, knownIds)) }} />
      )}
      {running && <p className="pulse">Thinking about your work…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
