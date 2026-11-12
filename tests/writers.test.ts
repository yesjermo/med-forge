import { describe, expect, it } from "vitest";
import { ApiWriter } from "../src/engine/llm/api";
import { stripThinking } from "../src/engine/llm/models";
import { OllamaWriter } from "../src/engine/llm/ollama";
import { availableWriters, createWriter } from "../src/engine/llm/select";
import { WriterUnavailableError } from "../src/engine/llm/types";
import { InputError, MAX_INPUT_CHARS, checkInput } from "../src/engine/run";

function sse(events: (object | string)[], status = 200): Response {
  const body = events.map((e) => (typeof e === "string" ? e : `data: ${JSON.stringify(e)}`)).join("\n\n");
  return new Response(body, { status });
}

const api = (fetch: typeof globalThis.fetch, model = "qwen/qwen3:free") =>
  new ApiWriter({ name: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1/", apiKey: "k", model, fetch });

describe("ApiWriter (OpenAI-compatible)", () => {
  it("streams server-sent events from /chat/completions with a bearer key", async () => {
    let sent: { url: string; init: RequestInit } | null = null;
    const fake = (async (url: string, init: RequestInit) => {
      sent = { url, init };
      return sse([
        ": OPENROUTER PROCESSING",
        { choices: [{ delta: { content: "<think>plan</think>::: proof" } }] },
        { choices: [{ delta: { content: " :::" }, finish_reason: "stop" }] },
        "data: [DONE]",
      ]);
    }) as unknown as typeof fetch;
    const deltas: string[] = [];
    const r = await api(fake).complete({ system: "S", user: "U", onText: (d) => deltas.push(d) });
    expect(r).toEqual({ text: "::: proof :::", model: "qwen/qwen3:free", truncated: false });
    expect(deltas).toHaveLength(2);
    expect(sent!.url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect((sent!.init.headers as Record<string, string>).Authorization).toBe("Bearer k");
    expect(JSON.parse(String(sent!.init.body)).messages).toEqual([
      { role: "system", content: "S" },
      { role: "user", content: "U" },
    ]);
  });

  it("reports truncation, bad keys, free-tier limits and network failures", async () => {
    const cut = (async () => sse([{ choices: [{ delta: { content: "a" }, finish_reason: "length" }] }])) as unknown as typeof fetch;
    expect((await api(cut).complete({ system: "", user: "" })).truncated).toBe(true);
    const status = (code: number) => (async () => new Response(JSON.stringify({ error: { message: "nope" } }), { status: code })) as unknown as typeof fetch;
    await expect(api(status(401)).complete({ system: "", user: "" })).rejects.toThrow(/rejected the API key/);
    await expect(api(status(429)).complete({ system: "", user: "" })).rejects.toThrow(/free limit/);
    await expect(api(status(404), "gone").complete({ system: "", user: "" })).rejects.toThrow(/no model "gone"/);
    const offline = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    await expect(api(offline).complete({ system: "", user: "" })).rejects.toBeInstanceOf(WriterUnavailableError);
  });

  it("sends OpenAI's reasoning-model parameters only to OpenAI", async () => {
    const bodies: Record<string, unknown>[] = [];
    const fake = (async (_url: string, init: RequestInit) => {
      bodies.push(JSON.parse(String(init.body)));
      return sse([{ choices: [{ delta: { content: "ok" } }] }]);
    }) as unknown as typeof fetch;
    await new ApiWriter({ name: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", apiKey: "k", model: "gpt-5-mini", fetch: fake }).complete({ system: "", user: "", maxTokens: 500 });
    await api(fake).complete({ system: "", user: "", maxTokens: 500 });
    expect(bodies[0]).toMatchObject({ max_completion_tokens: 500 });
    expect(bodies[0]).not.toHaveProperty("temperature");
    expect(bodies[0]).not.toHaveProperty("max_tokens");
    expect(bodies[1]).toMatchObject({ max_tokens: 500, temperature: 0.2 });
  });

  it("accepts a non-streamed JSON reply and skips non-JSON events", async () => {
    const json = (async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: "whole answer" }, finish_reason: "stop" }] }), {
        headers: { "content-type": "application/json" },
      })) as unknown as typeof fetch;
    expect((await api(json).complete({ system: "", user: "" })).text).toBe("whole answer");
    const pings = (async () => sse(["data: ping", { choices: [{ delta: { content: "hi" } }] }, "data: [DONE]"])) as unknown as typeof fetch;
    expect((await api(pings).complete({ system: "", user: "" })).text).toBe("hi");
  });

  it("strips reasoning preambles", () => {
    expect(stripThinking("<think>\nhmm\n</think>\n\nanswer")).toBe("answer");
  });
});

function ndjsonResponse(lines: object[], status = 200): Response {
  const body = lines.map((l) => JSON.stringify(l)).join("\n");
  return new Response(body, { status });
}

describe("OllamaWriter", () => {
  it("streams NDJSON chunks from /api/chat", async () => {
    let sent: { url: string; body: Record<string, unknown> } | null = null;
    const fakeFetch = (async (url: string, init: RequestInit) => {
      sent = { url, body: JSON.parse(String(init.body)) };
      return ndjsonResponse([
        { message: { content: "::: proof" }, done: false },
        { message: { content: " :::" }, done: false },
        { done: true, done_reason: "stop" },
      ]);
    }) as unknown as typeof fetch;
    const deltas: string[] = [];
    const w = new OllamaWriter({ host: "http://ollama:11434/", model: "qwen2.5", fetch: fakeFetch });
    const r = await w.complete({ system: "S", user: "U", onText: (d) => deltas.push(d) });
    expect(r).toEqual({ text: "::: proof :::", model: "qwen2.5", truncated: false });
    expect(deltas).toEqual(["::: proof", " :::"]);
    expect(sent!.url).toBe("http://ollama:11434/api/chat");
    expect(sent!.body.messages).toEqual([
      { role: "system", content: "S" },
      { role: "user", content: "U" },
    ]);
  });

  it("reports truncation, missing models and an offline server", async () => {
    const cut = (async () => ndjsonResponse([{ message: { content: "a" } }, { done: true, done_reason: "length" }])) as unknown as typeof fetch;
    expect((await new OllamaWriter({ fetch: cut }).complete({ system: "", user: "" })).truncated).toBe(true);

    const missing = (async () => new Response("model not found", { status: 404 })) as unknown as typeof fetch;
    await expect(new OllamaWriter({ fetch: missing, model: "nope" }).complete({ system: "", user: "" })).rejects.toThrow(
      /ollama pull nope/,
    );

    const offline = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    await expect(new OllamaWriter({ fetch: offline }).complete({ system: "", user: "" })).rejects.toBeInstanceOf(
      WriterUnavailableError,
    );
  });
});

describe("writer selection", () => {
  it("defaults to the free Ollama writer and offers API providers with a key", () => {
    expect(availableWriters({})).toEqual(["ollama"]);
    expect(availableWriters({ OPENROUTER_API_KEY: "k", GEMINI_API_KEY: "g" })).toEqual(["ollama", "openrouter", "gemini"]);
    expect(createWriter(undefined, { OPENROUTER_API_KEY: "k" }).name).toBe("ollama");
    expect(createWriter(undefined, { OLLAMA_MODEL: "llama3.1" }).model).toBe("llama3.1");
    expect(createWriter("ollama", {}, "qwen3").model).toBe("qwen3");
    const w = createWriter("openrouter", { OPENROUTER_API_KEY: "k" }, "moonshotai/kimi-k2:free");
    expect([w.name, w.model]).toEqual(["openrouter", "moonshotai/kimi-k2:free"]);
    expect(createWriter("gemini", { GEMINI_API_KEY: "g" }).model).toBe("gemini-2.5-flash");
    expect(createWriter("openai", { OPENAI_API_KEY: "o" }, "bad model!").model).toBe("gpt-5-mini");
    expect(() => createWriter("openai", {})).toThrow(/OPENAI_API_KEY/);
    expect(() => createWriter("claude", {})).toThrow(/Unknown writer/);
  });
});

describe("checkInput", () => {
  it("rejects empty and oversized input", () => {
    expect(() => checkInput("  ")).toThrow(InputError);
    expect(() => checkInput("a".repeat(MAX_INPUT_CHARS + 1))).toThrow(InputError);
    expect(checkInput("  one two three four five ")).toBe("one two three four five");
  });
});
