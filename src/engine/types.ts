export const BLOCK_TYPES = ["proof", "idea", "exchange"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export const DOMAINS = ["MEDICINE", "NURSING", "PREMED", "VETERINARY"] as const;
export type Domain = (typeof DOMAINS)[number];

/** ID prefix for each domain, e.g. MEDICINE -> MED in `MED-SEPSIS-0001`. */
export const DOMAIN_PREFIX: Record<Domain, string> = { MEDICINE: "MED", NURSING: "NUR", PREMED: "PRE", VETERINARY: "VET" };

/** Clinical domains: their proof blocks must carry the educational-use disclaimer. */
export const CLINICAL_DOMAINS: readonly Domain[] = ["MEDICINE", "NURSING", "VETERINARY"];

export type Severity = "error" | "warning";

export interface Issue {
  /** 1-based line number in the source text. */
  line: number;
  severity: Severity;
  /** Stable machine-readable code, e.g. `nested-block`. */
  code: string;
  message: string;
  /** ID of the block the issue belongs to, when known. */
  blockId?: string;
}

export interface Block {
  /** Block type as written. May be a type outside BLOCK_TYPES; the validator flags that. */
  type: string;
  attrs: Record<string, string>;
  /** Raw body text between the opening and closing fences. */
  body: string;
  /** Body split by section headings such as `Steps:`. Keys are heading text without the colon. */
  sections: Record<string, string>;
  /** Line of the section heading, keyed like `sections`. */
  sectionLines: Record<string, number>;
  /** 1-based line of the opening fence. */
  startLine: number;
  /** 1-based line of the closing fence (or last line if unclosed). */
  endLine: number;
}

export interface ParseResult {
  blocks: Block[];
  /** Items listed under a top-level `Open Questions:` heading. */
  openQuestions: string[];
  /** `- [S1] ...` items under a top-level `References:` heading (added when a pack is shared or downloaded). */
  references: { id: string; text: string }[];
  issues: Issue[];
}
