import { describe, expect, it } from "vitest";
import { normalizeOutput } from "../src/engine/normalize";
import { lint } from "../src/engine/validator";

describe("normalizeOutput", () => {
  it("converts \\( \\) and \\[ \\] math to dollar delimiters", () => {
    const out = normalizeOutput("Steps:\n1. Power is \\( P \\):\n   \\[\n   P = \\frac{a}{b}\n   \\]\n2. Next");
    expect(out).toBe("Steps:\n1. Power is $P$:\n\n$$ P = \\frac{a}{b} $$\n\n2. Next");
  });

  it("removes a code fence around the whole answer", () => {
    expect(normalizeOutput("```markdown\n::: proof\n:::\n```")).toBe("::: proof\n:::");
  });

  it("produces lint-clean spacing around converted display math", () => {
    const body = `::: exchange id="ENG-ABC-0001" topic="t"\nProposed Solution:\nUse \\[ x = 1 \\] here\n\nStress Tests:\n- [ ] $y$\n:::`;
    const r = lint(normalizeOutput(body));
    expect(r.issues.map((i) => i.code)).not.toContain("math-spacing");
  });
});
