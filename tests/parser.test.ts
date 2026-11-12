import { describe, expect, it } from "vitest";
import { parseBlocks, parseAttrs } from "../src/engine/parser";

const PROOF = `::: proof id="PRE-OXYHB-0001" domain="PREMED" title="Junction temperature"
Assumptions & Constraints:
- Steady state

Steps:
1. $T_j = T_a + P\\,\\theta_{ja}$

Traps & Failure Modes:
- Ignoring derating

Conclusion:

$$ T_j \\le T_{max} $$

Sources:
- Datasheet, 2024
:::`;

describe("parseBlocks", () => {
  it("parses a single block with attributes and sections", () => {
    const r = parseBlocks(PROOF);
    expect(r.issues).toEqual([]);
    expect(r.blocks).toHaveLength(1);
    const b = r.blocks[0]!;
    expect(b.type).toBe("proof");
    expect(b.attrs).toEqual({ id: "PRE-OXYHB-0001", domain: "PREMED", title: "Junction temperature" });
    expect(Object.keys(b.sections)).toEqual([
      "Assumptions & Constraints",
      "Steps",
      "Traps & Failure Modes",
      "Conclusion",
      "Sources",
    ]);
    expect(b.sections["Steps"]).toContain("T_j");
    expect(b.startLine).toBe(1);
    expect(b.sectionLines["Steps"]).toBe(5);
  });

  it("does not treat '- Gain: x' bullets as headings", () => {
    const r = parseBlocks(`::: idea id="ENG-X-0001" title="t"
Trade-off:
- Gain: speed
- Cost: power
:::`);
    expect(Object.keys(r.blocks[0]!.sections)).toEqual(["Trade-off"]);
  });

  it("collects Open Questions after the blocks", () => {
    const r = parseBlocks(`${PROOF}

Open Questions:
- What ambient temperature?
- Which package?`);
    expect(r.openQuestions).toEqual(["What ambient temperature?", "Which package?"]);
    expect(r.issues).toEqual([]);
  });

  it("reports nested blocks and keeps both", () => {
    const r = parseBlocks(`::: proof id="A" title="a"
Steps:
::: exchange id="B" topic="b"
Stress Tests:
- [ ] x
:::`);
    expect(r.blocks.map((b) => b.attrs.id)).toEqual(["A", "B"]);
    expect(r.issues.map((i) => i.code)).toEqual(["nested-block"]);
    expect(r.issues[0]!.line).toBe(3);
  });

  it("reports unclosed blocks", () => {
    const r = parseBlocks(`::: proof id="A"\nSteps:\n1. x`);
    expect(r.blocks).toHaveLength(1);
    expect(r.issues[0]).toMatchObject({ code: "unclosed-block", line: 1, severity: "error" });
  });

  it("reports a stray closing fence and stray prose", () => {
    const r = parseBlocks(`Here are your notes!\n:::`);
    expect(r.issues.map((i) => i.code)).toEqual(["stray-text", "stray-close"]);
  });

  it("ignores markdown code fences around the output", () => {
    const r = parseBlocks("```\n" + PROOF + "\n```");
    expect(r.issues).toEqual([]);
    expect(r.blocks).toHaveLength(1);
  });

  it("handles CRLF line endings", () => {
    const r = parseBlocks(PROOF.replace(/\n/g, "\r\n"));
    expect(r.issues).toEqual([]);
    expect(r.blocks[0]!.sections["Sources"]).toBe("- Datasheet, 2024");
  });
});

describe("parseAttrs", () => {
  it("flags unquoted values", () => {
    const r = parseAttrs(` id=ENG-X-0001 title="ok"`, 4);
    expect(r.attrs).toEqual({ title: "ok" });
    expect(r.issues[0]).toMatchObject({ code: "malformed-attr", line: 4 });
  });

  it("warns on duplicate attributes", () => {
    const r = parseAttrs(` id="a" id="b"`, 1);
    expect(r.attrs.id).toBe("b");
    expect(r.issues[0]!.code).toBe("duplicate-attr");
  });
});
