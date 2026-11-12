import { ID_RE, parseId } from "./ids";
import { parseBlocks } from "./parser";
import {
  BLOCK_TYPES,
  CLINICAL_DOMAINS,
  DOMAINS,
  DOMAIN_PREFIX,
  type Block,
  type BlockType,
  type Domain,
  type Issue,
  type ParseResult,
} from "./types";

export const REQUIRED_ATTRS: Record<BlockType, string[]> = {
  proof: ["id", "domain", "title"],
  idea: ["id", "domain", "subfield", "title"],
  exchange: ["id", "topic"],
};

export const REQUIRED_SECTIONS: Record<BlockType, string[]> = {
  proof: ["Assumptions & Constraints", "Steps", "Traps & Failure Modes", "Conclusion", "Sources"],
  idea: ["Problem / Gap", "Approach", "Trade-off", "Validation Plan", "Sources"],
  exchange: ["Proposed Solution", "Stress Tests"],
};

export const MEDICAL_DISCLAIMER = "Educational use only";

const YEAR_RE = /\b(1[89]\d{2}|20\d{2})\b/;

export interface LintOptions {
  /** Tags of retrieved sources (S1, S2, ...). When given, [S#] citations are checked against it. */
  sourceIds?: string[];
  /** DOIs that may appear (retrieved sources plus any in the input). When given, other DOIs are flagged. */
  allowedDois?: string[];
}

export interface LintResult extends ParseResult {
  /** True when there are no error-severity issues. */
  ok: boolean;
  errorCount: number;
  warningCount: number;
}

function isBlockType(t: string): t is BlockType {
  return (BLOCK_TYPES as readonly string[]).includes(t);
}

function isDomain(d: string): d is Domain {
  return (DOMAINS as readonly string[]).includes(d);
}

function bodyLines(block: Block): { text: string; line: number }[] {
  return block.body.split("\n").map((text, i) => ({ text, line: block.startLine + 1 + i }));
}

function checkMath(block: Block, push: (i: Omit<Issue, "blockId">) => void) {
  const lines = bodyLines(block);
  const displayCount = (block.body.match(/\$\$/g) ?? []).length;
  if (displayCount % 2 !== 0) {
    push({
      line: block.startLine,
      severity: "error",
      code: "unbalanced-math",
      message: "Odd number of `$$` delimiters; a display equation is never closed.",
    });
    return;
  }
  let inDisplay = false;
  lines.forEach(({ text }, i) => {
    const t = text.trim();
    if (!t.startsWith("$$")) {
      if (inDisplay && t.endsWith("$$")) inDisplay = false;
      return;
    }
    const opensAndCloses = t.length > 2 && t.endsWith("$$") && t !== "$$";
    if (!inDisplay) {
      const prev = lines[i - 1]?.text.trim();
      if (prev !== undefined && prev !== "") {
        push({
          line: lines[i]!.line,
          severity: "warning",
          code: "math-spacing",
          message: "Leave a blank line before a `$$` display equation so markdown parsers keep it intact.",
        });
      }
      if (!opensAndCloses) inDisplay = true;
    } else {
      inDisplay = false;
    }
    if (!inDisplay) {
      const next = lines[i + 1]?.text.trim();
      if (next !== undefined && next !== "") {
        push({
          line: lines[i]!.line,
          severity: "warning",
          code: "math-spacing",
          message: "Leave a blank line after a `$$` display equation.",
        });
      }
    }
  });
}

const SOURCE_TAG_RE = /\[(S\d+)\]/g;
const DOI_IN_TEXT_RE = /10\.\d{4,9}\/[^\s"<>,;\])]+/gi;

function lineOf(block: Block, needle: string): number {
  const idx = block.body.split("\n").findIndex((l) => l.includes(needle));
  return idx >= 0 ? block.startLine + 1 + idx : block.startLine;
}

function checkEvidence(block: Block, opts: LintOptions, push: (i: Omit<Issue, "blockId">) => void) {
  if (opts.sourceIds) {
    const known = new Set(opts.sourceIds);
    for (const m of block.body.matchAll(SOURCE_TAG_RE)) {
      if (!known.has(m[1]!)) {
        push({
          line: lineOf(block, m[0]),
          severity: "error",
          code: "unknown-source",
          message: `${m[0]} is not in the evidence list${opts.sourceIds.length ? ` (S1–S${opts.sourceIds.length})` : " (no sources were retrieved)"}. It may be invented.`,
        });
      }
    }
  }
  if (opts.allowedDois) {
    const allowed = new Set(opts.allowedDois.map((d) => d.toLowerCase()));
    for (const m of block.body.matchAll(DOI_IN_TEXT_RE)) {
      const doi = m[0].replace(/[.]+$/, "").toLowerCase();
      if (!allowed.has(doi)) {
        push({
          line: lineOf(block, m[0]),
          severity: "warning",
          code: "doi-not-in-evidence",
          message: `DOI ${doi} is not in the retrieved evidence or the input. Check that it exists.`,
        });
      }
    }
  }
}

function checkSources(block: Block, push: (i: Omit<Issue, "blockId">) => void) {
  const src = block.sections["Sources"];
  if (src === undefined) return;
  const startLine = (block.sectionLines["Sources"] ?? block.startLine) + 1;
  const items = src.split("\n").filter((l) => /^\s*[-*]\s+/.test(l));
  if (items.length === 0) {
    push({
      line: startLine - 1,
      severity: "warning",
      code: "empty-sources",
      message: "Sources section has no list items. Cite the input, a verified work, or mark `[UNVERIFIED — search: ...]`.",
    });
  }
  const sectionLines = block.body.split("\n");
  for (const item of items) {
    if (item.includes("[UNVERIFIED") || /\bnot reported\b/i.test(item) || /\[S\d+\]/.test(item)) continue;
    if (/^\s*[-*]\s+(input|the input|provided input)\b/i.test(item)) continue;
    if (!YEAR_RE.test(item)) {
      const idx = sectionLines.indexOf(item);
      push({
        line: idx >= 0 ? block.startLine + 1 + idx : startLine,
        severity: "warning",
        code: "citation-unverified",
        message:
          "Citation has no year. Give full title, authors and year, or tag it `[UNVERIFIED — search: ...]`.",
      });
    }
  }
}

function checkBlock(block: Block, opts: LintOptions, push: (i: Omit<Issue, "blockId">) => void) {
  if (!isBlockType(block.type)) {
    push({
      line: block.startLine,
      severity: "error",
      code: "unknown-type",
      message: `Unknown block type "${block.type}". Use one of: ${BLOCK_TYPES.join(", ")}.`,
    });
    return;
  }
  const type = block.type;

  for (const attr of REQUIRED_ATTRS[type]) {
    if (!block.attrs[attr]) {
      push({
        line: block.startLine,
        severity: "error",
        code: "missing-attr",
        message: `${type} block is missing required attribute "${attr}".`,
      });
    }
  }

  const domain = block.attrs.domain;
  if (domain !== undefined && !isDomain(domain)) {
    push({
      line: block.startLine,
      severity: "error",
      code: "bad-domain",
      message: `Unknown domain "${domain}". Use one of: ${DOMAINS.join(", ")}.`,
    });
  }

  const id = block.attrs.id;
  if (id) {
    if (!ID_RE.test(id)) {
      push({
        line: block.startLine,
        severity: "error",
        code: "bad-id",
        message: `ID "${id}" must look like MED-SEPSIS-0001 (prefix ${Object.values(DOMAIN_PREFIX).join("|")}, 3–6 letter topic, 4 digits).`,
      });
    } else {
      const parsed = parseId(id)!;
      const expected = domain && isDomain(domain) ? DOMAIN_PREFIX[domain] : undefined;
      if (expected && parsed.prefix !== expected) {
        push({
          line: block.startLine,
          severity: "error",
          code: "id-domain-mismatch",
          message: `ID prefix ${parsed.prefix} does not match domain ${domain} (${expected}).`,
        });
      }
    }
  }

  for (const section of REQUIRED_SECTIONS[type]) {
    const content = block.sections[section];
    if (content === undefined) {
      push({
        line: block.startLine,
        severity: "error",
        code: "missing-section",
        message: `${type} block is missing the "${section}:" section.`,
      });
    } else if (content.trim() === "") {
      push({
        line: block.sectionLines[section] ?? block.startLine,
        severity: "warning",
        code: "empty-section",
        message: `"${section}:" is empty.`,
      });
    }
  }

  if (type === "proof" && domain && isDomain(domain) && CLINICAL_DOMAINS.includes(domain) && !block.body.includes(MEDICAL_DISCLAIMER)) {
    push({
      line: block.endLine,
      severity: "error",
      code: "missing-disclaimer",
      message: `${domain} blocks must end with "> ${MEDICAL_DISCLAIMER}. Verify against current clinical guidelines."`,
    });
  }

  if (type === "exchange") {
    const tests = block.sections["Stress Tests"] ?? "";
    if (tests && !/^\s*-\s+\[[ xX]\]\s+\S/m.test(tests)) {
      push({
        line: block.sectionLines["Stress Tests"] ?? block.startLine,
        severity: "warning",
        code: "no-checkboxes",
        message: "Stress Tests should be a checklist: `- [ ] ...`.",
      });
    }
  }

  checkMath(block, push);
  if (type === "proof" || type === "idea") checkSources(block, push);
  checkEvidence(block, opts, push);
}

/** Validate already-parsed blocks against the v2 format rules. */
export function validate(parsed: ParseResult, options: LintOptions = {}): LintResult {
  // A pack that carries its own References list is checked against it (e.g. a pack shared to the hub).
  const opts: LintOptions =
    options.sourceIds === undefined && parsed.references.length > 0
      ? { ...options, sourceIds: parsed.references.map((r) => r.id) }
      : options;
  const issues: Issue[] = [...parsed.issues];
  const ids = new Map<string, number>();

  for (const block of parsed.blocks) {
    const blockId = block.attrs.id;
    const push = (i: Omit<Issue, "blockId">) => issues.push(blockId ? { ...i, blockId } : i);
    checkBlock(block, opts, push);
    if (blockId) {
      const firstLine = ids.get(blockId);
      if (firstLine !== undefined) {
        push({
          line: block.startLine,
          severity: "error",
          code: "duplicate-id",
          message: `ID "${blockId}" is already used by the block on line ${firstLine}.`,
        });
      } else {
        ids.set(blockId, block.startLine);
      }
    }
  }

  for (const block of parsed.blocks) {
    const ref = block.attrs.ref;
    if (ref && !ids.has(ref)) {
      issues.push({
        line: block.startLine,
        severity: "warning",
        code: "dangling-ref",
        message: `ref="${ref}" does not match any block in this document.`,
        ...(block.attrs.id ? { blockId: block.attrs.id } : {}),
      });
    }
  }

  issues.sort((a, b) => a.line - b.line);
  const errorCount = issues.filter((i) => i.severity === "error").length;
  return {
    ...parsed,
    issues,
    ok: errorCount === 0,
    errorCount,
    warningCount: issues.length - errorCount,
  };
}

/** Parse and validate block markup in one step. */
export function lint(text: string, opts: LintOptions = {}): LintResult {
  return validate(parseBlocks(text), opts);
}

/** Render issues as `file:line severity code message` lines for terminals and CI. */
export function formatIssues(issues: Issue[], file = "<input>"): string {
  return issues
    .map((i) => `${file}:${i.line}  ${i.severity.padEnd(7)}  ${i.code.padEnd(20)}  ${i.message}`)
    .join("\n");
}
