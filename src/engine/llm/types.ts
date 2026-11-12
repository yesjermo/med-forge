/** "ollama" or an API provider name such as "openrouter". */
export type WriterName = string;

export interface CompleteRequest {
  system: string;
  user: string;
  /** Called with each text delta as it streams. */
  onText?: (delta: string) => void;
  signal?: AbortSignal;
  /** Ask for a short JSON answer (query planning). Writers may ignore it. */
  json?: boolean;
  maxTokens?: number;
}

export interface CompleteResult {
  text: string;
  /** Model actually used. */
  model: string;
  /** Output hit the length limit. */
  truncated: boolean;
}

/** A model that writes text: a local model via Ollama, or an OpenAI-compatible API. */
export interface Writer {
  readonly name: WriterName;
  readonly model: string;
  complete(req: CompleteRequest): Promise<CompleteResult>;
}

export class WriterUnavailableError extends Error {}
