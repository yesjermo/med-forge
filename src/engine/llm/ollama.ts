import { stripThinking } from "./models";
import { WriterUnavailableError, type CompleteRequest, type CompleteResult, type Writer } from "./types";

export const DEFAULT_OLLAMA_HOST = "http://127.0.0.1:11434";
export const DEFAULT_OLLAMA_MODEL = "qwen2.5";

export interface OllamaWriterOptions {
  host?: string;
  model?: string;
  /** Context window in tokens. Ollama's default (2048–4096) is too small for papers. */
  numCtx?: number;
  fetch?: typeof fetch;
  /** The website origin calling Ollama from a browser (e.g. https://you.github.io), for CORS help. */
  origin?: string;
}

interface OllamaChunk {
  message?: { content?: string };
  done?: boolean;
  done_reason?: string;
  error?: string;
}

/** Writes with a local model through Ollama's /api/chat. Free and offline; quality depends on the model. */
export class OllamaWriter implements Writer {
  readonly name = "ollama" as const;
  readonly model: string;
  private readonly host: string;
  private readonly numCtx: number;
  private readonly fetchImpl: typeof fetch;
  private readonly origin: string | undefined;

  constructor(opts: OllamaWriterOptions = {}) {
    this.host = (opts.host ?? DEFAULT_OLLAMA_HOST).replace(/\/+$/, "");
    this.model = opts.model ?? DEFAULT_OLLAMA_MODEL;
    this.numCtx = opts.numCtx ?? 16384;
    this.fetchImpl = opts.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
    this.origin = opts.origin;
  }

  private corsHelp(): string {
    if (this.origin === "null") {
      // A page opened from a file has origin "null"; Ollama only accepts it via OLLAMA_ORIGINS="*",
      // which would let every website use this Ollama. (OLLAMA_ORIGINS="null" makes Ollama fail to start.)
      return (
        "This page was opened as a file, and Ollama won't accept requests from file pages. " +
        "Open the web edition from its GitHub Pages address, or run `npm run preview` and use http://localhost:4173/study-forge/, " +
        "or switch the writer to an online model (OpenRouter or Gemini, both with free tiers) in Settings."
      );
    }
    return `Ollama at ${this.host} didn't accept a request from this website. Allow it once, then restart Ollama: ` +
      `launchctl setenv OLLAMA_ORIGINS "${this.origin}" (macOS) or set OLLAMA_ORIGINS=${this.origin} (Windows/Linux). ` +
      `Also check Ollama is running and has the model: ollama pull ${this.model}`;
  }

  async complete(req: CompleteRequest): Promise<CompleteResult> {
    let res: Response;
    try {
      res = await this.fetchImpl(`${this.host}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          stream: true,
          ...(req.json ? { format: "json" } : {}),
          options: { temperature: 0.2, num_ctx: this.numCtx, num_predict: req.maxTokens ?? 8192 },
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: req.user },
          ],
        }),
        signal: req.signal ?? null,
      });
    } catch (err) {
      if (req.signal?.aborted) throw err;
      if (this.origin) throw new WriterUnavailableError(this.corsHelp());
      throw new WriterUnavailableError(
        `Can't reach Ollama at ${this.host}. Install it from ollama.com, start it, and run "ollama pull ${this.model}".`,
      );
    }
    if (res.status === 403 && this.origin) throw new WriterUnavailableError(this.corsHelp());
    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 404) {
        throw new WriterUnavailableError(`Ollama has no model "${this.model}". Run: ollama pull ${this.model}`);
      }
      throw new WriterUnavailableError(`Ollama returned ${res.status}: ${detail.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let truncated = false;
    const handle = (line: string) => {
      if (!line.trim()) return;
      const chunk = JSON.parse(line) as OllamaChunk;
      if (chunk.error) throw new WriterUnavailableError(`Ollama error: ${chunk.error}`);
      const delta = chunk.message?.content ?? "";
      if (delta) {
        text += delta;
        req.onText?.(delta);
      }
      if (chunk.done && chunk.done_reason === "length") truncated = true;
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
