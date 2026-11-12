import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "../src/engine/prompts";
import { normalizeOutput } from "../src/engine/normalize";
import { parseBlocks } from "../src/engine/parser";
import { lint } from "../src/engine/validator";
import { formatReferences, lintOptionsFor } from "../src/engine/evidence";
import type { Source } from "../src/engine/research/types";
import { GOOD_PACK } from "./fixtures";

describe("bug: template placeholders copied into ref attributes", () => {
  it("the prompt shows real example IDs, not {placeholders}, in ref attributes", () => {
    expect(SYSTEM_PROMPT).not.toMatch(/ref="\{/);
  });

  it("normalizeOutput repairs a copied placeholder around a real ID", () => {
    const out = normalizeOutput(`::: exchange id="PRE-STROOP-0003" ref="{proof id='PRE-STROOP-0001'}" topic="t"\n:::`);
    expect(out).toContain('ref="PRE-STROOP-0001"');
  });

  it("normalizeOutput drops a ref that is only a placeholder", () => {
    const out = normalizeOutput(`::: idea id="ENG-ABC-0002" ref="{proof id}" title="t"\n:::`);
    expect(out).toBe(`::: idea id="ENG-ABC-0002" title="t"\n:::`);
  });
});

const sources: Source[] = [
  { id: "S1", title: "Heat transfer", authors: ["Incropera, F."], year: 2007, doi: "10.1000/heat", foundBy: ["crossref"] },
  { id: "S2", title: "A web page", authors: [], url: "https://example.org/x", foundBy: ["manual"] },
];

describe("bug: shared packs lose their evidence list", () => {
  it("formatReferences writes a References list the parser reads back", () => {
    const text = `${GOOD_PACK.trim()}\n\n${formatReferences(sources)}`;
    const parsed = parseBlocks(text);
    expect(parsed.issues).toEqual([]);
    expect(parsed.references.map((r) => r.id)).toEqual(["S1", "S2"]);
    expect(parsed.references[0]!.text).toBe("Incropera, F. | Heat transfer | 2007 | doi:10.1000/heat");
    expect(parsed.openQuestions).toEqual(["What Hill coefficient does the lecture use?"]);
  });

  it("lint checks [S#] tags against an embedded References list", () => {
    const cited = GOOD_PACK.replace(
      "- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
      "- [S1] Incropera, Heat transfer, 2007\n- [S7] Made up",
    );
    const r = lint(`${cited}\n\n${formatReferences(sources)}`);
    expect(r.issues.filter((i) => i.code === "unknown-source")).toHaveLength(1);
  });
});

describe("bug: browser and server lint with different evidence options", () => {
  it("lintOptionsFor includes DOIs from the input as well as the sources", () => {
    expect(lintOptionsFor(sources, "see doi:10.2000/from-input")).toEqual({
      sourceIds: ["S1", "S2"],
      allowedDois: ["10.1000/heat", "10.2000/from-input"],
    });
  });
});

describe("bug: local models break block fences in repeatable ways", () => {
  const broken = [
    '::: proof id="PRE-STROOP-0001" domain="PREMED" title="t"',
    "Steps:",
    "1. a",
    "",
    '::: exchange id="EX-STROOP-0001" ref="PRE-STROOP-0001" topic="t"',
    "Stress Tests:",
    "- [ ] b",
    "",
    "::: Open Questions:",
    "- Why?",
    ":::",
  ].join("\n");

  it("closes a block before the next one opens", () => {
    const parsed = parseBlocks(normalizeOutput(broken));
    expect(parsed.issues.map((i) => i.code)).not.toContain("nested-block");
    expect(parsed.blocks.map((b) => b.type)).toEqual(["proof", "exchange"]);
  });

  it("turns a fenced Open Questions block back into the plain list", () => {
    const parsed = parseBlocks(normalizeOutput(broken));
    expect(parsed.openQuestions).toEqual(["Why?"]);
    expect(parsed.issues.map((i) => i.code)).not.toContain("stray-close");
  });

  it("gives an invented ID prefix the document's real prefix and keeps refs pointing at it", () => {
    const out = normalizeOutput(broken + '\n::: idea id="PRE-STROOP-0002" ref="EX-STROOP-0001" domain="PREMED" title="t"\n:::');
    expect(out).toContain('id="PRE-STROOP-0003"');
    expect(out).toContain('ref="PRE-STROOP-0003"');
    expect(out).not.toContain("EX-STROOP");
  });

  it("leaves a well-formed pack unchanged", () => {
    expect(normalizeOutput(GOOD_PACK)).toBe(GOOD_PACK.trim());
  });
});
