import { BlockCard } from "@/components/BlockCard";
import { lint } from "@/engine/validator";
import { renderInline, renderSection } from "@/components/markup";

/**
 * Renders a hub post or reply. Text with ::: blocks is shown as block cards with a
 * format check and its References list (so [S#] links work); anything else is rendered
 * as safe text with math, lists and checklists.
 */
export function PostBody({ body, showLint = true }: { body: string; showLint?: boolean }) {
  const result = lint(body);
  if (result.blocks.length === 0) {
    return <div className="prose" dangerouslySetInnerHTML={{ __html: renderSection(body) }} />;
  }
  return (
    <div>
      {showLint && (
        <p className={`hint ${result.ok ? "lint-ok" : ""}`}>
          Format check: {result.errorCount} error(s), {result.warningCount} warning(s)
        </p>
      )}
      {result.blocks.map((b) => (
        <BlockCard
          key={b.startLine}
          block={b}
          issues={result.issues.filter((i) => i.line >= b.startLine && i.line <= b.endLine)}
        />
      ))}
      {result.openQuestions.length > 0 && (
        <div className="open-questions">
          <h3>Open questions</h3>
          <ul>
            {result.openQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
      {result.references.length > 0 && (
        <div className="references">
          <h3>References</h3>
          <ol className="sources">
            {result.references.map((r) => (
              <li key={r.id} id={`src-${r.id}`}>
                <span className="src-id">[{r.id}]</span>{" "}
                <span dangerouslySetInnerHTML={{ __html: linkDoi(renderInline(r.text)) }} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/** Turn an escaped `doi:10.x/y` into a link. Input is already HTML-escaped by renderInline. */
function linkDoi(html: string): string {
  return html.replace(
    /doi:(10\.\d{4,9}\/[^\s<|]+)/g,
    (_m, doi: string) => `<a href="https://doi.org/${doi}" target="_blank" rel="noopener noreferrer">doi:${doi}</a>`,
  );
}
