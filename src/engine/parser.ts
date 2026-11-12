import type { Block, Issue, ParseResult } from "./types";

const OPEN_RE = /^:::[ \t]*([A-Za-z_][\w-]*)(.*)$/;
const CLOSE_RE = /^:::[ \t]*$/;
const ATTR_RE = /([A-Za-z_][\w-]*)="([^"]*)"/g;
const SECTION_RE = /^([A-Z][A-Za-z0-9 &/()'-]*):[ \t]*$/;
const FENCE_RE = /^```/;
const OPEN_QUESTIONS_RE = /^open questions:\s*$/i;
const REFERENCES_RE = /^references:\s*$/i;
const REFERENCE_ITEM_RE = /^[-*]\s+\[(S\d{1,3})\]\s*(.*)$/;

/** Parse `key="value"` pairs from the remainder of an opening fence line. */
export function parseAttrs(
  raw: string,
  line: number,
): { attrs: Record<string, string>; issues: Issue[] } {
  const attrs: Record<string, string> = {};
  const issues: Issue[] = [];
  for (const m of raw.matchAll(ATTR_RE)) {
    const key = m[1]!;
    if (key in attrs) {
      issues.push({
        line,
        severity: "warning",
        code: "duplicate-attr",
        message: `Attribute "${key}" appears more than once; the last value wins.`,
      });
    }
    attrs[key] = m[2]!;
  }
  const leftover = raw.replace(ATTR_RE, "").trim();
  if (leftover.length > 0) {
    issues.push({
      line,
      severity: "error",
      code: "malformed-attr",
      message: `Could not read "${leftover}". Attributes must be key="value" with double quotes.`,
    });
  }
  return { attrs, issues };
}

/** Split a block body into sections keyed by `Heading:` lines. */
export function splitSections(
  bodyLines: string[],
  firstLine: number,
): { sections: Record<string, string>; sectionLines: Record<string, number> } {
  const sections: Record<string, string> = {};
  const sectionLines: Record<string, number> = {};
  let current: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (current !== null) sections[current] = buf.join("\n").trim();
  };
  bodyLines.forEach((text, i) => {
    const m = SECTION_RE.exec(text);
    if (m) {
      flush();
      current = m[1]!.trim();
      sectionLines[current] = firstLine + i;
      buf = [];
    } else if (current !== null) {
      buf.push(text);
    }
  });
  flush();
  return { sections, sectionLines };
}

/**
 * Parse med-forge block markup.
 *
 * The parser is lenient: it always returns every block it can find and reports
 * structural problems (nesting, unclosed blocks, stray text) as issues instead of throwing.
 */
export function parseBlocks(text: string): ParseResult {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  const issues: Issue[] = [];
  const openQuestions: string[] = [];
  const references: { id: string; text: string }[] = [];

  let open: { type: string; attrs: Record<string, string>; startLine: number; body: string[] } | null =
    null;
  let trailer: "questions" | "references" | null = null;

  const closeBlock = (endLine: number) => {
    if (!open) return;
    const { sections, sectionLines } = splitSections(open.body, open.startLine + 1);
    blocks.push({
      type: open.type,
      attrs: open.attrs,
      body: open.body.join("\n"),
      sections,
      sectionLines,
      startLine: open.startLine,
      endLine,
    });
    open = null;
  };

  lines.forEach((text, i) => {
    const lineNo = i + 1;

    if (open) {
      if (CLOSE_RE.test(text)) {
        closeBlock(lineNo);
        return;
      }
      const nested = OPEN_RE.exec(text);
      if (nested) {
        issues.push({
          line: lineNo,
          severity: "error",
          code: "nested-block",
          message: `Block "${nested[1]}" opens inside "${open.type}" (started line ${open.startLine}). Blocks cannot be nested; close the first block with ":::" before opening another.`,
        });
        closeBlock(lineNo - 1);
        // fall through and open the new block below
      } else {
        open.body.push(text);
        return;
      }
    }

    const m = OPEN_RE.exec(text);
    if (m) {
      trailer = null;
      const { attrs, issues: attrIssues } = parseAttrs(m[2] ?? "", lineNo);
      issues.push(...attrIssues);
      open = { type: m[1]!, attrs, startLine: lineNo, body: [] };
      return;
    }

    if (CLOSE_RE.test(text)) {
      issues.push({
        line: lineNo,
        severity: "error",
        code: "stray-close",
        message: 'Closing ":::" with no open block.',
      });
      return;
    }

    const trimmed = text.trim();
    if (trimmed === "" || FENCE_RE.test(trimmed)) return;

    if (OPEN_QUESTIONS_RE.test(trimmed)) {
      trailer = "questions";
      return;
    }
    if (REFERENCES_RE.test(trimmed)) {
      trailer = "references";
      return;
    }
    if (trailer === "questions" && /^[-*]\s+/.test(trimmed)) {
      openQuestions.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }
    const ref = trailer === "references" ? REFERENCE_ITEM_RE.exec(trimmed) : null;
    if (ref) {
      references.push({ id: ref[1]!, text: ref[2]!.trim() });
      return;
    }

    issues.push({
      line: lineNo,
      severity: "warning",
      code: "stray-text",
      message: "Text outside a block. Only blocks, an `Open Questions:` list and a `References:` list are allowed.",
    });
  });

  if (open) {
    const startLine = (open as { startLine: number }).startLine;
    issues.push({
      line: startLine,
      severity: "error",
      code: "unclosed-block",
      message: `Block opened on line ${startLine} is never closed with ":::".`,
    });
    closeBlock(lines.length);
  }

  return { blocks, openQuestions, references, issues };
}
