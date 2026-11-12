import { afterEach, describe, expect, it } from "vitest";
import { ADVICE_SECTIONS, adviseStream, buildAdvicePrompt, sourceChecks } from "../src/engine/advise";
import { buildUserMessage } from "../src/engine/prompts";
import { heuristicQueries, planQueries } from "../src/engine/research/pipeline";
import { OpenAlexProvider } from "../src/engine/research/openalex";
import { runPack } from "../src/engine/run";
import type { CompleteRequest, Writer } from "../src/engine/llm/types";
import type { Source } from "../src/engine/research/types";
import { GOOD_PACK } from "./fixtures";

const NOTES = "Lecture 4: oxygen transport, the haemoglobin dissociation curve and the Bohr effect.";

function recordingWriter(replies: string[]) {
  const requests: CompleteRequest[] = [];
  const writer: Writer = {
    name: "ollama",
    model: "fake",
    async complete(req) {
      requests.push(req);
      const text = (replies.shift() ?? "").trim();
      req.onText?.(text);
      return { text, model: "fake", truncated: false };
    },
  };
  return { writer, requests };
}

describe("research lead", () => {
  it("is fenced into the writer prompt with instructions", () => {
    const msg = buildUserMessage("nursing", "notes", undefined, "Does early mobilisation reduce pressure injuries?");
    expect(msg).toContain("RESEARCH LEAD");
    expect(msg).toMatch(/<<<\nDoes early mobilisation reduce pressure injuries\?\n>>>/);
    expect(msg).toMatch(/Open Questions/);
    expect(buildUserMessage("nursing", "notes")).not.toContain("RESEARCH LEAD");
  });

  it("leads query planning and the heuristic fallback", async () => {
    const { writer, requests } = recordingWriter(['{"queries":["stroop response mode"]}']);
    await planQueries("lecture text", writer, undefined, "voice vs keypress Stroop");
    expect(requests[0]!.user).toMatch(/^RESEARCH LEAD: voice vs keypress Stroop/);
    expect(heuristicQueries("Lecture 1 — Intro\nwords words", 2, "my exact question here")[0]).toBe("my exact question here");
  });

  it("flows through runPack into both planning and writing", async () => {
    const { writer, requests } = recordingWriter(['{"queries":["thermal resistance"]}', GOOD_PACK]);
    const provider = { name: "crossref" as const, label: "", available: true, hint: "", search: async () => [] };
    await runPack({ pack: "premed", input: NOTES, writer, providers: [provider], lead: "Is derating enough?" });
    expect(requests[0]!.user).toContain("Is derating enough?");
    expect(requests[1]!.user).toContain("RESEARCH LEAD");
  });

  it("rejects an overlong lead", async () => {
    const { writer } = recordingWriter([GOOD_PACK]);
    await expect(runPack({ pack: "premed", input: NOTES, writer, lead: "a".repeat(2001) })).rejects.toThrow(/2,000/);
  });
});

const sources: Source[] = [
  { id: "S1", title: "Heat", authors: ["A"], year: 2007, doi: "10.1000/heat", foundBy: ["crossref"] },
  { id: "S2", title: "A blog", authors: [], url: "https://example.org", foundBy: ["perplexity"] },
  { id: "S3", title: "Unused paper", authors: ["B"], year: 2020, doi: "10.1000/unused", foundBy: ["crossref"] },
];
const cited = GOOD_PACK.replace(
  "- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
  "- [S1] A, Heat, 2007\n- [S2] A blog",
);

describe("advisor checks", () => {
  it("flags unused sources, unverified citations and web-only sources", () => {
    const checks = sourceChecks(cited, sources);
    const text = checks.map((c) => c.message).join("\n");
    expect(text).toMatch(/\[S3\].*never cited/);
    expect(text).toMatch(/1 citation.*\[UNVERIFIED/);
    expect(text).toMatch(/\[S2\].*no DOI/);
    expect(checks.every((c) => ["sources", "thesis", "idea"].includes(c.area))).toBe(true);
  });

  it("flags a pack resting on a single source", () => {
    const one = GOOD_PACK.replace(
      "- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
      "- [S1] A, Heat, 2007",
    ).replace('- [UNVERIFIED — search: "oxygen dissociation curve undergraduate laboratory" on PubMed]', "- [S1] A, Heat, 2007");
    expect(sourceChecks(one, sources.slice(0, 1)).map((c) => c.message).join("\n")).toMatch(/single source/);
  });

  it("flags blocks with no real citation and format errors", () => {
    const bare = GOOD_PACK.replace(
      "- Input lecture notes\n- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
      "- Input",
    );
    const text = sourceChecks(bare, []).map((c) => c.message).join("\n");
    expect(text).toMatch(/PRE-OXYHB-0001.*only cites the input/);
    expect(sourceChecks("::: proof\n", []).some((c) => /format error/.test(c.message))).toBe(true);
  });
});

describe("advisor AI", () => {
  it("prompts with the work, the lead and the evidence, and returns checks + advice", async () => {
    const reply = "Sources:\n- Cite [S3]\n\nThesis:\n- Narrow it\n\nIdea:\n- Test at 85 °C\n\nNext searches:\n- thermal derating enclosure";
    const { writer, requests } = recordingWriter([reply]);
    const deltas: string[] = [];
    const r = await adviseStream({ text: cited, lead: "Is derating enough?", sources, writer, onText: (d) => deltas.push(d) });
    expect(requests[0]!.system).toMatch(/never name a paper/i);
    expect(requests[0]!.user).toContain("Is derating enough?");
    expect(requests[0]!.user).toContain("[S3] | B | Unused paper");
    expect(r.text).toBe(reply);
    expect(r.checks.length).toBeGreaterThan(0);
    expect(deltas.join("")).toBe(reply);
  });

  it("asks for exactly the four sections", () => {
    expect(ADVICE_SECTIONS).toEqual(["Sources", "Thesis", "Idea", "Next searches"]);
    const p = buildAdvicePrompt({ text: "plain post", sources: [] });
    expect(p).toContain("WORK TO REVIEW");
    expect(p).not.toContain("EVIDENCE");
  });

  it("rejects empty work", async () => {
    const { writer } = recordingWriter([""]);
    await expect(adviseStream({ text: "  ", writer })).rejects.toThrow(/Nothing to review/);
  });
});

const g = globalThis as unknown as { window?: unknown };
afterEach(() => {
  delete g.window;
});

describe("OpenAlex from a browser", () => {
  it("sends no User-Agent header (its CORS rules reject it)", async () => {
    g.window = {};
    let headers: Record<string, string> = {};
    const f = (async (_u: string, init: RequestInit) => {
      headers = (init.headers ?? {}) as Record<string, string>;
      return new Response(JSON.stringify({ results: [] }));
    }) as unknown as typeof fetch;
    await new OpenAlexProvider("k").search("q", { limit: 1, fetch: f });
    expect(Object.keys(headers).map((k) => k.toLowerCase())).not.toContain("user-agent");
  });
});

describe("advisor output from local models", () => {
  it("normalizes bold, markdown and echoed headings into the four sections", async () => {
    const { normalizeAdvice } = await import("../src/engine/advise");
    const messy = [
      "RESEARCH LEAD",
      "The work does not directly answer the lead.",
      "WORK TO REVIEW",
      "**Sources**: Some references are not relevant.",
      "- Cite [S3] for the voice condition",
      "## Thesis",
      "The claim is clear.",
      "**Idea:** Add emotional stimuli.",
      "Next Searches -",
      '1. "stroop response mode voice keypress"',
    ].join("\n");
    const out = normalizeAdvice(messy);
    const { splitSections } = await import("../src/engine/parser");
    const { sections } = splitSections(out.split("\n"), 1);
    expect(Object.keys(sections)).toEqual(["Sources", "Thesis", "Idea", "Next searches"]);
    expect(sections["Sources"]).toContain("Some references are not relevant.");
    expect(sections["Sources"]).toContain("Cite [S3]");
    expect(sections["Thesis"]).toContain("The work does not directly answer the lead.");
    expect(sections["Idea"]).toBe("- Add emotional stimuli.");
    expect(sections["Next searches"]).toBe("- stroop response mode voice keypress");
  });

  it("ends the prompt with the exact headings to use", () => {
    const p = buildAdvicePrompt({ text: "work", lead: "lead" });
    expect(p.trim().split("\n").pop()).toMatch(/Sources:.*Thesis:.*Idea:.*Next searches:/);
    expect(p).not.toMatch(/^RESEARCH LEAD/m);
  });
});

describe("advisor never shows invented source tags", () => {
  it("drops advice lines citing [S#] tags that aren't in the work or its evidence", async () => {
    const { normalizeAdvice, knownSourceIds } = await import("../src/engine/advise");
    const raw = "Sources:\n- [S1] Green's Theorem derivation\n- Add a textbook source\n\nThesis:\n- Clear claim";
    const known = knownSourceIds("Claim: area formula. No citations here.", []);
    expect(known).toEqual([]);
    const out = normalizeAdvice(raw, known);
    expect(out).not.toContain("[S1]");
    expect(out).toContain("Add a textbook source");
  });

  it("keeps tags that exist in the work's References list or evidence", async () => {
    const { normalizeAdvice, knownSourceIds } = await import("../src/engine/advise");
    const work = `${GOOD_PACK.trim()}\n\nReferences:\n- [S1] A | Heat | 2007`;
    const known = knownSourceIds(work, [sources[2]!]);
    expect(known.sort()).toEqual(["S1", "S3"]);
    const out = normalizeAdvice("Sources:\n- Lean more on [S1]\n- Also cite [S3]\n- And [S9]", known);
    expect(out).toContain("[S1]");
    expect(out).toContain("[S3]");
    expect(out).not.toContain("[S9]");
  });

  it("adviseStream applies the guard", async () => {
    const { writer } = recordingWriter(["Sources:\n- [S4] invented\n- Search for a review paper"]);
    const r = await adviseStream({ text: "a plain post about bounded sequences converging", writer });
    expect(r.text).not.toContain("[S4]");
    expect(r.knownIds).toEqual([]);
  });
});

describe("advisor input", () => {
  it("refuses to review a few characters instead of inventing advice", async () => {
    const { writer, requests } = recordingWriter(["Sources:\n- something"]);
    await expect(adviseStream({ text: "x", writer })).rejects.toThrow(/too short to review/i);
    expect(requests).toHaveLength(0);
  });
});
