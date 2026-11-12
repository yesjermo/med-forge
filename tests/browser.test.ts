import { afterEach, describe, expect, it } from "vitest";
import { CrossrefProvider } from "../src/engine/research/crossref";
import { OllamaWriter } from "../src/engine/llm/ollama";

const g = globalThis as unknown as { window?: unknown };
afterEach(() => {
  delete g.window;
});

describe("browser-safe engine", () => {
  it("Crossref sends no User-Agent header from a browser (its CORS rules reject it)", async () => {
    g.window = {};
    let headers: Record<string, string> = {};
    const f = (async (_url: string, init: RequestInit) => {
      headers = (init.headers ?? {}) as Record<string, string>;
      return new Response(JSON.stringify({ message: { items: [] } }));
    }) as unknown as typeof fetch;
    await new CrossrefProvider().search("stroop", { limit: 1, fetch: f });
    expect(Object.keys(headers).map((k) => k.toLowerCase())).not.toContain("user-agent");
  });

  it("Crossref still identifies itself from Node", async () => {
    let headers: Record<string, string> = {};
    const f = (async (_url: string, init: RequestInit) => {
      headers = (init.headers ?? {}) as Record<string, string>;
      return new Response(JSON.stringify({ message: { items: [] } }));
    }) as unknown as typeof fetch;
    await new CrossrefProvider().search("stroop", { limit: 1, fetch: f });
    expect(headers["User-Agent"]).toMatch(/MedForge/);
  });

  it("an Ollama CORS block from a website explains OLLAMA_ORIGINS with the exact origin", async () => {
    const blocked = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    const w = new OllamaWriter({ fetch: blocked, origin: "https://ada.github.io" });
    await expect(w.complete({ system: "", user: "" })).rejects.toThrow(/OLLAMA_ORIGINS.*https:\/\/ada\.github\.io/s);
  });

  it("Ollama answering 403 to a website is reported the same way", async () => {
    const forbidden = (async () => new Response("", { status: 403 })) as unknown as typeof fetch;
    const w = new OllamaWriter({ fetch: forbidden, origin: "https://ada.github.io" });
    await expect(w.complete({ system: "", user: "" })).rejects.toThrow(/OLLAMA_ORIGINS/);
  });
});

describe("page opened from a file (origin null)", () => {
  it("never suggests OLLAMA_ORIGINS=null (Ollama refuses to start with it) and offers working alternatives", async () => {
    const blocked = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    const w = new OllamaWriter({ fetch: blocked, origin: "null" });
    const err = await w.complete({ system: "", user: "" }).catch((e: Error) => e);
    expect(String(err)).not.toMatch(/OLLAMA_ORIGINS[= ]"?null/);
    expect(String(err)).toMatch(/opened as a file/);
    expect(String(err)).toMatch(/npm run preview|GitHub Pages/);
  });
});
