import { describe, expect, it } from "vitest";
import { ConsensusProvider } from "../src/engine/research/consensus";
import { CrossrefProvider } from "../src/engine/research/crossref";
import { ElicitProvider } from "../src/engine/research/elicit";
import { invertedToText, OpenAlexProvider } from "../src/engine/research/openalex";
import { PerplexityProvider } from "../src/engine/research/perplexity";
import { extractReferences, manualSources } from "../src/engine/research/manual";
import { formatEvidence, gatherEvidence, heuristicQueries, mergeSources, planQueries } from "../src/engine/research/pipeline";
import { providerStatus, selectProviders } from "../src/engine/research/registry";
import type { ResearchProvider } from "../src/engine/research/types";
import type { Writer } from "../src/engine/llm/types";

type Call = { url: string; init: RequestInit };
function jsonFetch(body: unknown, status = 200) {
  const calls: Call[] = [];
  const f = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(body), { status });
  }) as unknown as typeof fetch;
  return { f, calls };
}

describe("providers", () => {
  it("Crossref maps items and strips JATS abstracts", async () => {
    const { f, calls } = jsonFetch({
      message: {
        items: [
          {
            DOI: "10.1000/ABC.1",
            title: ["Thermal <i>resistance</i> of packages"],
            author: [{ given: "Ada", family: "Lovelace" }],
            issued: { "date-parts": [[2019, 3]] },
            "container-title": ["IEEE Trans"],
            abstract: "<jats:p>Abstract We measure θja.</jats:p>",
          },
          { title: [] },
        ],
      },
    });
    const r = await new CrossrefProvider().search("thermal", { limit: 3, fetch: f });
    expect(r).toEqual([
      {
        title: "Thermal resistance of packages",
        authors: ["Lovelace, Ada"],
        year: 2019,
        doi: "10.1000/abc.1",
        url: "https://doi.org/10.1000/abc.1",
        venue: "IEEE Trans",
        snippet: "We measure θja.",
      },
    ]);
    expect(calls[0]!.url).toContain("rows=3");
  });

  it("Elicit posts the query with a bearer key", async () => {
    const { f, calls } = jsonFetch({
      papers: [{ title: "P", authors: ["A"], year: 2020, doi: "10.1000/x", studyTypeTags: ["RCT"], abstract: "abs" }],
    });
    const r = await new ElicitProvider("elk").search("q", { limit: 5, fetch: f });
    expect(r[0]).toMatchObject({ title: "P", doi: "10.1000/x", studyInfo: "RCT", snippet: "abs" });
    expect(calls[0]!.url).toBe("https://elicit.com/api/v2/search/papers");
    expect((calls[0]!.init.headers as Record<string, string>).Authorization).toBe("Bearer elk");
    expect(JSON.parse(String(calls[0]!.init.body))).toEqual({ query: "q", maxResults: 5 });
  });

  it("Consensus uses x-api-key and maps takeaway and study info", async () => {
    const { f, calls } = jsonFetch({
      results: [{ title: "C", authors: ["B"], publish_year: 2023, doi: "10.2000/y", takeaway: "works", study_type: "rct", sample_size: 120 }],
    });
    const r = await new ConsensusProvider("ck").search("q", { limit: 4, fetch: f });
    expect(r[0]).toMatchObject({ title: "C", year: 2023, snippet: "works", studyInfo: "rct, n=120" });
    expect(calls[0]!.url).toContain("page_size=4");
    expect((calls[0]!.init.headers as Record<string, string>)["x-api-key"]).toBe("ck");
  });

  it("Perplexity maps search_results, falling back to citations", async () => {
    const a = jsonFetch({ search_results: [{ title: "Web", url: "https://x.org", date: "2024-05-01", snippet: "s" }] });
    expect((await new PerplexityProvider("pk").search("q", { limit: 3, fetch: a.f }))[0]).toEqual({
      title: "Web",
      authors: [],
      url: "https://x.org",
      year: 2024,
      snippet: "s",
    });
    expect(JSON.parse(String(a.calls[0]!.init.body)).search_mode).toBe("academic");
    const b = jsonFetch({ citations: ["https://y.org"] });
    expect((await new PerplexityProvider("pk").search("q", { limit: 3, fetch: b.f }))[0]!.url).toBe("https://y.org");
  });

  it("OpenAlex rebuilds abstracts", async () => {
    expect(invertedToText({ hello: [0], world: [1] })).toBe("hello world");
    const { f } = jsonFetch({ results: [{ display_name: "O", doi: "https://doi.org/10.3000/Z", publication_year: 2021, authorships: [] }] });
    expect((await new OpenAlexProvider("ok").search("q", { limit: 2, fetch: f }))[0]).toMatchObject({ doi: "10.3000/z" });
  });

  it("turns HTTP errors into readable provider errors", async () => {
    const { f } = jsonFetch({}, 402);
    await expect(new ElicitProvider("k").search("q", { limit: 1, fetch: f })).rejects.toThrow("elicit: plan quota used up");
  });

  it("only paid providers with keys are available", () => {
    expect(selectProviders(undefined, {}).map((p) => p.name)).toEqual(["crossref"]);
    expect(selectProviders(["elicit", "crossref"], { ELICIT_API_KEY: "k" }).map((p) => p.name)).toEqual(["crossref", "elicit"]);
    expect(selectProviders([], {})).toEqual([]);
    expect(providerStatus({}).find((p) => p.name === "consensus")).toMatchObject({ available: false });
  });
});

describe("manual evidence", () => {
  it("extracts DOIs and links from pasted text", () => {
    const text = `Perplexity says [1] https://doi.org/10.1186/S12916-023-03146-5. See also https://example.org/page,
doi: 10.1038/nature12373; and (https://arxiv.org/abs/2301.00001)`;
    expect(extractReferences(text)).toEqual({
      dois: ["10.1186/s12916-023-03146-5", "10.1038/nature12373"],
      urls: ["https://example.org/page", "https://arxiv.org/abs/2301.00001"],
    });
  });

  it("resolves DOIs through Crossref and keeps unresolved ones", async () => {
    const f = (async (url: string) =>
      url.includes("good")
        ? new Response(JSON.stringify({ message: { DOI: "10.1000/good", title: ["Good"], issued: { "date-parts": [[2020]] } } }))
        : new Response("{}", { status: 404 })) as unknown as typeof fetch;
    const r = await manualSources("10.1000/good and 10.1000/bad", { fetch: f });
    expect(r.map((s) => s.title)).toEqual(["Good", "DOI 10.1000/bad"]);
  });
});

describe("pipeline", () => {
  const fakeWriter = (text: string | Error): Writer => ({
    name: "ollama",
    model: "fake",
    async complete() {
      if (text instanceof Error) throw text;
      return { text, model: "fake", truncated: false };
    },
  });

  it("plans queries from JSON and falls back to a heuristic", async () => {
    expect(await planQueries("x", fakeWriter('{"queries":["junction temperature theta ja","heatsink derating"]}'))).toEqual([
      "junction temperature theta ja",
      "heatsink derating",
    ]);
    const fallback = await planQueries("Lecture 4 — Thermal design\nthermal thermal resistance", fakeWriter(new Error("down")));
    expect(fallback[0]).toBe("Thermal design");
    expect(heuristicQueries("")).toEqual([]);
  });

  it("merges by DOI, interleaves providers and numbers S1..Sn", () => {
    const merged = mergeSources([
      { provider: "crossref", drafts: [{ title: "A", authors: [], doi: "10.1000/a" }, { title: "B", authors: [] }] },
      { provider: "elicit", drafts: [{ title: "A (alt title)", authors: [], doi: "10.1000/a", studyInfo: "RCT" }, { title: "C", authors: [] }] },
    ]);
    expect(merged.map((s) => [s.id, s.title, s.foundBy.join("+")])).toEqual([
      ["S1", "A", "crossref+elicit"],
      ["S2", "B", "crossref"],
      ["S3", "C", "elicit"],
    ]);
    expect(merged[0]!.studyInfo).toBe("RCT");
    expect(formatEvidence(merged)).toContain("[S1] | A | doi:10.1000/a");
  });

  it("keeps going when one provider fails", async () => {
    const ok: ResearchProvider = {
      name: "crossref",
      label: "",
      available: true,
      hint: "",
      search: async (q) => [{ title: `paper for ${q}`, authors: [] }],
    };
    const bad: ResearchProvider = { ...ok, name: "consensus", search: async () => Promise.reject(new Error("consensus: API key rejected")) };
    const r = await gatherEvidence({ queries: ["q1"], providers: [ok, bad] });
    expect(r.sources.map((s) => s.title)).toEqual(["paper for q1"]);
    expect(r.events).toEqual([
      { provider: "crossref", ok: true, count: 1 },
      { provider: "consensus", ok: false, count: 0, error: "consensus: API key rejected" },
    ]);
  });
});
