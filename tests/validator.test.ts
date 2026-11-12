import { describe, expect, it } from "vitest";
import { lint } from "../src/engine/validator";
import { GOOD_PACK } from "./fixtures";

const codes = (text: string) => lint(text).issues.map((i) => i.code);

describe("lint", () => {
  it("accepts a well-formed pack", () => {
    const r = lint(GOOD_PACK);
    expect(r.issues).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.blocks).toHaveLength(3);
    expect(r.openQuestions).toEqual(["What Hill coefficient does the lecture use?"]);
  });

  it("flags unknown types, domains and missing attributes", () => {
    expect(codes(`::: tech_idea id="ENG-X-0001"\n:::`)).toContain("unknown-type");
    const c = codes(`::: proof id="ENG-ABC-0001" domain="MATH" title="t"\n:::`);
    expect(c).toContain("bad-domain");
    expect(codes(`::: proof domain="NURSING"\n:::`)).toContain("missing-attr");
  });

  it("flags bad IDs and prefix/domain mismatches", () => {
    expect(codes(`::: proof id="eng-1" domain="NURSING" title="t"\n:::`)).toContain("bad-id");
    expect(codes(`::: proof id="VET-BSM-0001" domain="NURSING" title="t"\n:::`)).toContain(
      "id-domain-mismatch",
    );
    expect(codes(`::: proof id="MED-BAU-0001" domain="PREMED" title="t"\n:::`)).toContain("id-domain-mismatch");
  });

  it("flags duplicate IDs and dangling refs", () => {
    const text = `::: exchange id="VET-BSM-0001" topic="a"\nProposed Solution:\nx\n\nStress Tests:\n- [ ] y\n:::\n::: exchange id="VET-BSM-0001" ref="VET-BSM-0099" topic="b"\nProposed Solution:\nx\n\nStress Tests:\n- [ ] y\n:::`;
    const c = codes(text);
    expect(c).toContain("duplicate-id");
    expect(c).toContain("dangling-ref");
  });

  it("requires the medical disclaimer", () => {
    const med = GOOD_PACK.split(":::\n\n::: idea")[0]!
      .replace(/PRE-OXYHB/g, "MED-SEPSIS")
      .replace(/PREMED/g, "MEDICINE");
    expect(codes(med + ":::")).toContain("missing-disclaimer");
    const withDisclaimer = med + "\n> Educational use only. Verify against current clinical guidelines.\n:::";
    expect(codes(withDisclaimer)).not.toContain("missing-disclaimer");
  });

  it("flags missing sections and unbalanced math", () => {
    const c = codes(`::: proof id="NUR-QFT-0001" domain="NURSING" title="t"\nSteps:\n$$ x\n:::`);
    expect(c).toContain("missing-section");
    expect(c).toContain("unbalanced-math");
  });

  it("warns when display math has no blank lines around it", () => {
    const c = codes(
      `::: exchange id="PRE-STROOP-0001" topic="t"\nProposed Solution:\ntext\n$$ d = 0.5 $$\nmore\n\nStress Tests:\n- [ ] a\n:::`,
    );
    expect(c.filter((x) => x === "math-spacing")).toHaveLength(2);
  });

  it("warns on citations without a year", () => {
    const text = GOOD_PACK.replace(
      "- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
      "- https://example.com/made-up-paper",
    );
    const r = lint(text);
    const issue = r.issues.find((i) => i.code === "citation-unverified");
    expect(issue).toBeDefined();
    expect(issue!.line).toBe(text.split("\n").indexOf("- https://example.com/made-up-paper") + 1);
  });

  it("wants the disclaimer on nursing and vet proofs but not pre-med", () => {
    const proof = (d: string, p: string) => `::: proof id="${p}-AKI-0001" domain="${d}" title="t"\n:::`;
    expect(codes(proof("NURSING", "NUR"))).toContain("missing-disclaimer");
    expect(codes(proof("VETERINARY", "VET"))).toContain("missing-disclaimer");
    expect(codes(proof("PREMED", "PRE"))).not.toContain("missing-disclaimer");
  });

  it("rejects the old non-health domains and moodboards", () => {
    expect(codes(`::: proof id="ENG-THERM-0001" domain="ENGINEERING" title="t"\n:::`)).toEqual(expect.arrayContaining(["bad-domain", "bad-id"]));
    expect(codes(`::: moodboard id="MED-BAU-0001" title="t"\n:::`)).toContain("unknown-type");
  });

  it("wants checklists in exchange stress tests", () => {
    expect(
      codes(`::: exchange id="PRE-RF-0001" topic="t"\nProposed Solution:\nx\n\nStress Tests:\n- just a bullet\n:::`),
    ).toContain("no-checkboxes");
  });
});

describe("lint with evidence", () => {
  const cited = GOOD_PACK.replace(
    "- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
    "- [S2] Incropera, Heat transfer, doi:10.1000/heat",
  );

  it("accepts known [S#] tags without a year", () => {
    const r = lint(cited, { sourceIds: ["S1", "S2"], allowedDois: ["10.1000/heat"] });
    expect(r.issues).toEqual([]);
  });

  it("errors on unknown tags and warns on unretrieved DOIs", () => {
    const r = lint(cited, { sourceIds: ["S1"], allowedDois: [] });
    expect(r.issues.map((i) => i.code).sort()).toEqual(["doi-not-in-evidence", "unknown-source"]);
  });
});
