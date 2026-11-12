import { describe, expect, it } from "vitest";
import { escapeHtml, renderInline, renderSection } from "../src/components/markup";

describe("markup", () => {
  it("escapes HTML in text", () => {
    expect(escapeHtml(`<img src=x onerror="alert(1)">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
    expect(renderSection("<script>alert(1)</script>")).toBe(
      "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
    );
  });

  it("does not let math carry raw HTML", () => {
    const html = renderInline("$\\href{javascript:alert(1)}{x}$");
    // KaTeX with trust:false renders \\href as red error text; no link is created.
    expect(html).not.toMatch(/<a\b|href=/);
  });

  it("renders inline and display math with KaTeX", () => {
    expect(renderInline("energy $E=mc^2$ ok")).toContain('class="katex"');
    const html = renderSection("$$\nP = \\frac{a}{b}\n$$");
    expect(html).toContain('class="math-display"');
    expect(html).toContain("katex-display");
  });

  it("renders lists, checklists and quotes", () => {
    const html = renderSection("1. one\n2. two\n\n- a\n- [ ] test\n- [x] done\n> note");
    expect(html).toBe(
      '<ol><li>one</li><li>two</li></ol><ul><li>a</li><li class="check"><input type="checkbox" disabled aria-label="stress test"> test</li><li class="check"><input type="checkbox" disabled checked aria-label="stress test"> done</li></ul><blockquote>note</blockquote>',
    );
  });
});

describe("source tags", () => {
  it("links [S#] tags to the evidence list", () => {
    expect(renderInline("see [S2] and [x]")).toBe('see <a class="src-tag" href="#src-S2">[S2]</a> and [x]');
  });
});
