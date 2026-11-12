import { afterEach, describe, expect, it } from "vitest";
import { fetchCitationData, formatAMA, formatAPA, type CitationData } from "../site/src/med/research/cite";
import { buildPubmedQuery, framePicoQuestion, pubmedUrl } from "../site/src/med/research/pico";
import { diagnostic, treatment, wilson } from "../site/src/med/research/stats";
import { TERMS } from "../site/src/med/terms";

const g = globalThis as unknown as { window?: unknown };
afterEach(() => {
  delete g.window;
});

describe("diagnostic()", () => {
  it("worked example: 90/10/10/90", () => {
    const r = diagnostic({ tp: 90, fp: 10, fn: 10, tn: 90 });
    expect(r.sensitivity).toBeCloseTo(0.9, 10);
    expect(r.specificity).toBeCloseTo(0.9, 10);
    expect(r.ppv).toBeCloseTo(0.9, 10);
    expect(r.npv).toBeCloseTo(0.9, 10);
    expect(r.lrPositive).toBeCloseTo(9, 10);
    expect(r.lrNegative).toBeCloseTo(0.111, 3);
    expect(r.accuracy).toBeCloseTo(0.9, 10);
    expect(r.prevalence).toBeCloseTo(0.5, 10);
    // Wilson 95% CI for 90/100 ≈ 0.826–0.945
    expect(r.sensitivityCI!.lower).toBeCloseTo(0.826, 3);
    expect(r.sensitivityCI!.upper).toBeCloseTo(0.945, 3);
  });

  it("returns null for measures with a zero denominator instead of Infinity/NaN", () => {
    const r = diagnostic({ tp: 0, fp: 0, fn: 0, tn: 0 });
    expect(r.sensitivity).toBeNull();
    expect(r.specificity).toBeNull();
    expect(r.ppv).toBeNull();
    expect(r.accuracy).toBeNull();
    expect(r.sensitivityCI).toBeNull();
    // Perfect specificity: LR+ divides by zero.
    const p = diagnostic({ tp: 5, fp: 0, fn: 5, tn: 10 });
    expect(p.specificity).toBe(1);
    expect(p.lrPositive).toBeNull();
    expect(p.lrNegative).toBeCloseTo(0.5);
  });

  it("rejects impossible counts", () => {
    expect(() => diagnostic({ tp: -1, fp: 0, fn: 0, tn: 0 })).toThrow(RangeError);
    expect(() => diagnostic({ tp: 1.5, fp: 0, fn: 0, tn: 0 })).toThrow(RangeError);
    expect(() => diagnostic({ tp: Number.NaN, fp: 0, fn: 0, tn: 0 })).toThrow(RangeError);
  });

  it("Wilson bounds stay within [0, 1], even at 0% and 100%", () => {
    for (const [k, n] of [
      [0, 1],
      [1, 1],
      [0, 20],
      [20, 20],
      [3, 7],
    ] as const) {
      const ci = wilson(k, n)!;
      expect(ci.lower).toBeGreaterThanOrEqual(0);
      expect(ci.upper).toBeLessThanOrEqual(1);
      expect(ci.lower).toBeLessThanOrEqual(k / n);
      expect(ci.upper).toBeGreaterThanOrEqual(k / n);
    }
    expect(wilson(0, 0)).toBeNull();
    expect(() => wilson(5, 4)).toThrow(RangeError);
  });
});

describe("treatment()", () => {
  it("worked example: 10/100 treated vs 20/100 control", () => {
    const r = treatment({ eventsTreated: 10, totalTreated: 100, eventsControl: 20, totalControl: 100 });
    expect(r.eer).toBeCloseTo(0.1);
    expect(r.cer).toBeCloseTo(0.2);
    expect(r.rr).toBeCloseTo(0.5, 10);
    expect(r.arr).toBeCloseTo(0.1, 10);
    expect(r.rrr).toBeCloseTo(0.5, 10);
    expect(r.nnt).toEqual({ label: "NNT", value: 10 });
    expect(r.oddsRatio).toBeCloseTo(0.444, 3);
    // log-method RR CI ≈ 0.247–1.017; Woolf OR CI ≈ 0.196–1.006
    expect(r.rrCI!.lower).toBeCloseTo(0.247, 3);
    expect(r.rrCI!.upper).toBeCloseTo(1.017, 2);
    expect(r.orCI!.lower).toBeCloseTo(0.196, 3);
    expect(r.orCI!.upper).toBeCloseTo(1.006, 3);
  });

  it("reports NNH when the treatment is harmful", () => {
    const r = treatment({ eventsTreated: 30, totalTreated: 100, eventsControl: 20, totalControl: 100 });
    expect(r.arr).toBeCloseTo(-0.1, 10);
    expect(r.nnt).toEqual({ label: "NNH", value: 10 });
  });

  it("handles zero events and zero denominators", () => {
    const none = treatment({ eventsTreated: 0, totalTreated: 50, eventsControl: 0, totalControl: 50 });
    expect(none.rr).toBeNull();
    expect(none.rrr).toBeNull();
    expect(none.nnt).toBeNull();
    expect(none.oddsRatio).toBeNull();
    expect(none.orCI).toBeNull();
    const zeroTreated = treatment({ eventsTreated: 0, totalTreated: 50, eventsControl: 5, totalControl: 50 });
    expect(zeroTreated.rr).toBe(0);
    expect(zeroTreated.rrCI).toBeNull();
    expect(() => treatment({ eventsTreated: 0, totalTreated: 0, eventsControl: 1, totalControl: 10 })).toThrow(RangeError);
    expect(() => treatment({ eventsTreated: 11, totalTreated: 10, eventsControl: 1, totalControl: 10 })).toThrow(RangeError);
  });
});

describe("PICO and PubMed", () => {
  it("builds a full query with synonyms and filters", () => {
    const q = buildPubmedQuery(
      {
        population: "heart failure",
        intervention: "SGLT2 inhibitor",
        comparison: "placebo",
        outcome: "hospitalisation",
        synonyms: { population: ["cardiac failure", "HFrEF"], intervention: ["dapagliflozin", "empagliflozin"], outcome: ["hospitalization"] },
        filters: { years: 5, studyTypes: ["randomized controlled trial", "meta-analysis"] },
      },
      2026,
    );
    expect(q).toBe(
      '("heart failure"[tiab] OR "cardiac failure"[tiab] OR "HFrEF"[tiab]) AND ' +
        '("SGLT2 inhibitor"[tiab] OR "dapagliflozin"[tiab] OR "empagliflozin"[tiab]) AND ' +
        '("placebo"[tiab]) AND ' +
        '("hospitalisation"[tiab] OR "hospitalization"[tiab]) AND ' +
        '("Randomized Controlled Trial"[pt] OR "Meta-Analysis"[pt]) AND ' +
        '("2021"[dp] : "3000"[dp])',
    );
  });

  it("skips empty elements (no comparison) and handles a single study type", () => {
    const q = buildPubmedQuery(
      { population: "older adults", intervention: "exercise", comparison: "  ", outcome: "", filters: { studyTypes: ["systematic review"] } },
      2026,
    );
    expect(q).toBe('("older adults"[tiab]) AND ("exercise"[tiab]) AND "Systematic Review"[pt]');
  });

  it("strips characters that would break the query", () => {
    expect(buildPubmedQuery({ population: 'say "hi" (now)', intervention: "", outcome: "" }, 2026)).toBe('("say hi now"[tiab])');
  });

  it("pubmedUrl encodes the query", () => {
    expect(pubmedUrl('("a b"[tiab]) AND "x"[pt]')).toBe(
      "https://pubmed.ncbi.nlm.nih.gov/?term=(%22a%20b%22%5Btiab%5D)%20AND%20%22x%22%5Bpt%5D",
    );
  });

  it("frames the clinical question with and without a comparison", () => {
    expect(framePicoQuestion({ population: "adults with asthma", intervention: "inhaled steroids", comparison: "placebo", outcome: "exacerbations." })).toBe(
      "In adults with asthma, does inhaled steroids compared with placebo change exacerbations?",
    );
    expect(framePicoQuestion({ population: "children", intervention: "zinc", outcome: "cold duration" })).toBe(
      "In children, does zinc change cold duration?",
    );
    expect(framePicoQuestion({ population: "children", intervention: "", outcome: "x" })).toBe("");
  });
});

const base: Omit<CitationData, "authors"> = {
  title: "A trial of something",
  journal: "N Engl J Med",
  year: 2020,
  volume: "383",
  issue: "27",
  pages: "2603-2615",
  doi: "10.1056/nejmoa2034577",
};
const people = [
  { given: "Fernando P.", family: "Polack" },
  { given: "Stephen J.", family: "Thomas" },
  { given: "Nicholas", family: "Kitchin" },
  { given: "Judith", family: "Absalon" },
  { given: "Alejandra", family: "Gurtman" },
  { given: "Stephen", family: "Lockhart" },
  { given: "John L.", family: "Perez" },
  { given: "Jean-Pierre", family: "Marc" },
];

describe("citation formatting", () => {
  it("AMA with 1, 3 and 8 authors", () => {
    expect(formatAMA({ ...base, authors: people.slice(0, 1) })).toBe(
      "Polack FP. A trial of something. N Engl J Med. 2020;383(27):2603-2615. doi:10.1056/nejmoa2034577",
    );
    expect(formatAMA({ ...base, authors: people.slice(0, 3) })).toBe(
      "Polack FP, Thomas SJ, Kitchin N. A trial of something. N Engl J Med. 2020;383(27):2603-2615. doi:10.1056/nejmoa2034577",
    );
    expect(formatAMA({ ...base, authors: people })).toBe(
      "Polack FP, Thomas SJ, Kitchin N, et al. A trial of something. N Engl J Med. 2020;383(27):2603-2615. doi:10.1056/nejmoa2034577",
    );
  });

  it("AMA lists all 6 authors when there are exactly 6", () => {
    expect(formatAMA({ ...base, authors: people.slice(0, 6) })).toMatch(/^Polack FP, Thomas SJ, Kitchin N, Absalon J, Gurtman A, Lockhart S\. /);
  });

  it("APA with 1, 3 and 8 authors", () => {
    expect(formatAPA({ ...base, authors: people.slice(0, 1) })).toBe(
      "Polack, F. P. (2020). A trial of something. N Engl J Med, 383(27), 2603–2615. https://doi.org/10.1056/nejmoa2034577",
    );
    expect(formatAPA({ ...base, authors: people.slice(0, 3) })).toBe(
      "Polack, F. P., Thomas, S. J., & Kitchin, N. (2020). A trial of something. N Engl J Med, 383(27), 2603–2615. https://doi.org/10.1056/nejmoa2034577",
    );
    expect(formatAPA({ ...base, authors: people })).toBe(
      "Polack, F. P., Thomas, S. J., Kitchin, N., Absalon, J., Gurtman, A., Lockhart, S., Perez, J. L., & Marc, J.-P. (2020). " +
        "A trial of something. N Engl J Med, 383(27), 2603–2615. https://doi.org/10.1056/nejmoa2034577",
    );
  });

  it("APA truncates 21+ authors to 19, ellipsis, last", () => {
    const many = Array.from({ length: 22 }, (_, i) => ({ given: "A", family: `Author${i + 1}` }));
    const s = formatAPA({ ...base, authors: many });
    expect(s).toContain("Author19, A., . . . Author22, A. (2020).");
    expect(s).not.toContain("Author20");
  });
});

const crossrefBody = {
  message: {
    DOI: "10.1056/NEJMoa2034577",
    title: ["Safety and Efficacy of the BNT162b2 mRNA <i>Covid-19</i> Vaccine"],
    author: [
      { given: "Fernando P.", family: "Polack" },
      { given: "Stephen J.", family: "Thomas" },
    ],
    "container-title": ["New England Journal of Medicine"],
    issued: { "date-parts": [[2020, 12, 31]] },
    volume: "383",
    issue: "27",
    page: "2603-2615",
  },
};

describe("fetchCitationData()", () => {
  it("parses a Crossref record, strips HTML from the title and keeps the journal name", async () => {
    let url = "";
    const f = (async (u: string) => {
      url = u;
      return new Response(JSON.stringify(crossrefBody));
    }) as unknown as typeof fetch;
    const d = await fetchCitationData("https://doi.org/10.1056/NEJMoa2034577", f);
    expect(url).toBe(`https://api.crossref.org/works/${encodeURIComponent("10.1056/nejmoa2034577")}`);
    expect(d).toEqual({
      authors: [
        { given: "Fernando P.", family: "Polack" },
        { given: "Stephen J.", family: "Thomas" },
      ],
      title: "Safety and Efficacy of the BNT162b2 mRNA Covid-19 Vaccine",
      journal: "New England Journal of Medicine",
      year: 2020,
      volume: "383",
      issue: "27",
      pages: "2603-2615",
      doi: "10.1056/nejmoa2034577",
    });
  });

  it("turns a 404 into a readable 'DOI not found' error", async () => {
    const f = (async () => new Response("Resource not found.", { status: 404 })) as unknown as typeof fetch;
    await expect(fetchCitationData("10.9999/nope", f)).rejects.toThrow(/DOI not found/);
  });

  it("rejects input that isn't a DOI without calling the network", async () => {
    let called = false;
    const f = (async () => {
      called = true;
      return new Response("{}");
    }) as unknown as typeof fetch;
    await expect(fetchCitationData("not a doi", f)).rejects.toThrow(/doesn't look like a DOI/);
    expect(called).toBe(false);
  });

  it("sends no User-Agent header from a browser", async () => {
    g.window = {};
    let headers: Record<string, string> = {};
    const f = (async (_u: string, init: RequestInit) => {
      headers = (init.headers ?? {}) as Record<string, string>;
      return new Response(JSON.stringify(crossrefBody));
    }) as unknown as typeof fetch;
    await fetchCitationData("10.1056/NEJMoa2034577", f);
    expect(Object.keys(headers).map((k) => k.toLowerCase())).not.toContain("user-agent");
  });
});

describe("TERMS", () => {
  it("has at least 70 entries with unique lowercase slug ids", () => {
    expect(TERMS.length).toBeGreaterThanOrEqual(70);
    const ids = TERMS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("every entry has a part, a kind, a meaning and an example", () => {
    for (const t of TERMS) {
      expect(t.part.trim()).not.toBe("");
      expect(["prefix", "root", "suffix"]).toContain(t.kind);
      expect(t.meaning.trim()).not.toBe("");
      expect(t.example.trim()).not.toBe("");
      expect(t.example).toContain(":");
    }
  });

  it("covers all three kinds", () => {
    for (const k of ["prefix", "root", "suffix"] as const) expect(TERMS.some((t) => t.kind === k)).toBe(true);
  });
});
