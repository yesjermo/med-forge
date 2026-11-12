import { describe, expect, it } from "vitest";
import type { CompleteRequest, Writer } from "../src/engine/llm/types";
import type { ResearchProvider } from "../src/engine/research/types";
import { runPack, type RunEvent } from "../src/engine/run";
import { GOOD_PACK } from "./fixtures";

const NOTES = "Lecture 4: oxygen transport, the haemoglobin dissociation curve and the Bohr effect.";

function scriptedWriter(replies: string[]) {
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

const provider: ResearchProvider = {
  name: "crossref",
  label: "Crossref",
  available: true,
  hint: "",
  search: async () => [{ title: "Heat transfer", authors: ["Incropera"], year: 2007, doi: "10.1000/heat" }],
};

const CITED = GOOD_PACK.replace(
  "- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020",
  "- [S1] Incropera, Heat transfer, 2007, doi:10.1000/heat",
);

describe("runPack", () => {
  it("plans, researches, writes with evidence and lints against it", async () => {
    const { writer, requests } = scriptedWriter(['{"queries":["thermal resistance"]}', CITED]);
    const events: RunEvent[] = [];
    const r = await runPack({ pack: "premed", input: NOTES, writer, providers: [provider], emit: (e) => events.push(e) });

    expect(r.queries).toEqual(["thermal resistance"]);
    expect(r.sources.map((s) => s.id)).toEqual(["S1"]);
    expect(requests[1]!.user).toContain("EVIDENCE");
    expect(requests[1]!.user).toContain("[S1] | Incropera | Heat transfer | 2007 | doi:10.1000/heat");
    expect(r.lint.ok).toBe(true);
    expect(events.map((e) => e.type)).toEqual(["stage", "queries", "stage", "research", "sources", "stage", "text", "final", "done"]);
  });

  it("skips research when no providers or evidence are given", async () => {
    const { writer, requests } = scriptedWriter([GOOD_PACK]);
    const r = await runPack({ pack: "premed", input: NOTES, writer });
    expect(requests).toHaveLength(1);
    expect(requests[0]!.user).not.toContain("EVIDENCE");
    expect(r.sources).toEqual([]);
  });

  it("flags [S#] tags when research ran but found nothing", async () => {
    const empty: ResearchProvider = { ...provider, search: async () => [] };
    const { writer } = scriptedWriter(['{"queries":["thermal resistance"]}', CITED, CITED]);
    const r = await runPack({ pack: "premed", input: NOTES, writer, providers: [empty] });
    expect(r.lint.issues.map((i) => i.code)).toContain("unknown-source");
  });

  it("flags invented [S#] tags and repairs them in one extra pass", async () => {
    const invented = CITED.replace("[S1]", "[S9]");
    const { writer, requests } = scriptedWriter(['{"queries":["thermal resistance"]}', invented, CITED]);
    const events: RunEvent[] = [];
    const r = await runPack({ pack: "premed", input: NOTES, writer, providers: [provider], emit: (e) => events.push(e) });
    expect(requests[2]!.user).toContain("unknown-source");
    expect(events.some((e) => e.type === "reset")).toBe(true);
    expect(r.summary.repaired).toBe(true);
    expect(r.lint.ok).toBe(true);
  });

  it("keeps the first answer if the repair is worse", async () => {
    const oneError = CITED.replace("[S1]", "[S9]");
    const { writer } = scriptedWriter(['{"queries":["thermal resistance"]}', oneError, "garbage :::"]);
    const r = await runPack({ pack: "premed", input: NOTES, writer, providers: [provider] });
    expect(r.text).toBe(oneError.trim());
    expect(r.summary.repaired).toBe(false);
    expect(r.lint.issues.map((i) => i.code)).toContain("unknown-source");
  });
});
