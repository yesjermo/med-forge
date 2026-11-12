import { stripThinking } from "./models";
import { WriterUnavailableError, type CompleteRequest, type CompleteResult, type Writer } from "./types";

export interface ApiWriterOptions {
  /** Shown in messages and summaries, e.g. "openrouter" or "custom". */
  name: string;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  fetch?: typeof fetch;
}

interface Chunk {
  choices?: { delta?: { content?: string | null }; finish_reason?: string | null }[];
  error?: { message?: string };
}

/**
 * Writes with any OpenAI-compatible chat-completions API: OpenRouter, Google Gemini, OpenAI,
 * or another endpoint that follows the same format. Streams over server-sent events.
 */
export class ApiWriter implements Writer {
  readonly name: string;
  readonly model: string;
  private readonly opts: ApiWriterOptions;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: ApiWriterOptions) {
    this.opts = { ...opts, baseUrl: opts.baseUrl.replace(/\/+$/, "") };
    this.name = opts.name;
    this.model = opts.model;
    this.fetchImpl = opts.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  }

  async complete(req: CompleteRequest): Promise<CompleteResult> {
    const { label, baseUrl, apiKey } = this.opts;
    let res: Response;
    try {
      res = await this.fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: this.model,
          stream: true,
          temperature: 0.2,
          max_tokens: req.maxTokens ?? 8192,
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: req.user },
          ],
        }),
        signal: req.signal ?? null,
      });
    } catch (err) {
      if (req.signal?.aborted) throw err;
      throw new WriterUnavailableError(`Can't reach ${label} at ${baseUrl}. Check your connection (a custom endpoint must allow requests from this site).`);
    }
    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      let msg = detail.slice(0, 200);
      try {
        msg = (JSON.parse(detail) as Chunk).error?.message ?? msg;
      } catch {
        /* not JSON */
      }
      if (res.status === 401 || res.status === 403) throw new WriterUnavailableError(`${label} rejected the API key. Check it in Settings.`);
      if (res.status === 404) throw new WriterUnavailableError(`${label} has no model "${this.model}". ${msg}`);
      if (res.status === 429) throw new WriterUnavailableError(`${label} is busy or you've reached the free limit. Wait a little, or pick another model. ${msg}`);
      throw new WriterUnavailableError(`${label} returned ${res.status}: ${msg}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let truncated = false;
    const handle = (line: string) => {
      const data = line.trim().replace(/^data:\s*/, "");
      if (!line.trim().startsWith("data:") || data === "[DONE]") return;
      const chunk = JSON.parse(data) as Chunk;
      if (chunk.error) throw new WriterUnavailableError(`${label} error: ${chunk.error.message ?? "unknown"}`);
      const choice = chunk.choices?.[0];
      const delta = choice?.delta?.content ?? "";
      if (delta) {
        text += delta;
        req.onText?.(delta);
      }
      if (choice?.finish_reason === "length") truncated = true;
    };
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        handle(buf.slice(0, nl));
        buf = buf.slice(nl + 1);
      }
    }
    handle(buf);
    return { text: stripThinking(text), model: this.model, truncated };
  }
}
