import { Icon } from "@/components/Icon";
import type { Block, Issue } from "@/engine/types";
import { renderInline, renderSection } from "@/components/markup";

const TYPE_LABEL: Record<string, string> = {
  proof: "Proof",
  idea: "Idea",
  exchange: "Exchange",
};

export function BlockCard({ block, issues }: { block: Block; issues: Issue[] }) {
  const { id, title, topic, domain, subfield, ref } = block.attrs;
  const errors = issues.filter((i) => i.severity === "error").length;
  const heading = title ?? topic ?? "(untitled)";
  const sections = Object.entries(block.sections);

  return (
    <article className={`block block-${block.type}`} id={id}>
      <header className="block-head">
        <span className="block-type">{TYPE_LABEL[block.type] ?? block.type}</span>
        {id && <code className="block-id">{id}</code>}
        {domain && <span className="tag">{domain}</span>}
        {subfield && <span className="tag">{subfield}</span>}
        {ref && (
          <a className="tag tag-ref" href={`#${ref}`}>
            <Icon name="corner-down-right" size={12} /> {ref}
          </a>
        )}
        {errors > 0 && <span className="tag tag-error">{errors} error{errors > 1 ? "s" : ""}</span>}
      </header>
      <h3 dangerouslySetInnerHTML={{ __html: renderInline(heading) }} />
      {sections.length > 0 ? (
        sections.map(([name, content]) => (
          <section key={name} className="block-section">
            <h4>{name}</h4>
            <div dangerouslySetInnerHTML={{ __html: renderSection(content) }} />
          </section>
        ))
      ) : (
        <div dangerouslySetInnerHTML={{ __html: renderSection(block.body) }} />
      )}
    </article>
  );
}
