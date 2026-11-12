import type { Writer } from "@/engine/llm/types";
import type { InsightType, LectureChapter, LectureInsight } from "../types";
import { formatTime, parseTimestamp, toWindows, transcriptRange, type Segment } from "./transcript";

/**
 * AI insight extraction from a lecture transcript. The writer gets the transcript as timed
 * windows ("[12:30] …") and answers with JSON; everything it returns is checked here before
 * the student sees it: types, timestamps inside the recording, no invented drug doses, no repeats.
 */

const TYPES: InsightType[] = ["exam_tip", "clinical_link", "intuition"];

/** Timestamps this far outside the transcript are pulled to its edge; further out, the item is dropped. */
const EDGE_SLACK = 30;
/** Characters of transcript per writer call. Long lectures are sent in parts so small local models cope. */
export const CHUNK_CHARS = 12000;

export const EXTRACT_SYSTEM = `You help a medical-science student revise a lecture from its transcript.
Pull out the high-yield points an examiner is likely to test. Classify each:
- exam_tip: a fact, definition, distinction or common mistake likely to be examined
- clinical_link: how the point shows up in patients, tests or practice
- intuition: a mental model or analogy that makes a mechanism click
Rules:
- Use only what the lecturer says. Never add facts that are not in the transcript.
- No drug doses, rates or regimens unless quoted word for word from the transcript.
- If the transcript is unclear (garbled captions, ambiguous wording), set "uncertain": true.
- Each transcript line starts with its number and time, like [3 | 1:10]. "seg" is the number of the line where the point is made.
- One or two sentences per point; LaTeX in $...$ is allowed.
- Optionally list chapters: the main sections of the lecture, each with the "seg" of the line where it starts.
Answer with JSON only, in this shape:
{"insights":[{"type":"exam_tip","text":"…","seg":2,"uncertain":false}],"chapters":[{"seg":1,"title":"…"}]}`;

export interface ExtractResult {
  insights: LectureInsight[];
  chapters: LectureChapter[];
}

/** The user message for one part of the transcript. */
export function buildExtractionPrompt(windows: Segment[], opts: { title?: string; part?: number; parts?: number; perPart?: number } = {}): string {
  const { title, part = 1, parts = 1, perPart = 8 } = opts;
  const head = [
    title ? `Lecture: ${title}` : "",
    parts > 1 ? `Part ${part} of ${parts} of the transcript.` : "",
    `Give up to ${perPart} insights${part === 1 ? " and the chapter list" : " and chapters that start in this part"}.`,
  ].filter(Boolean);
  const body = windows.map((w, i) => `[${i + 1} | ${formatTime(w.start)}] ${w.text}`).join("\n");
  return `${head.join("\n")}\n\nTranscript:\n${body}`;
}

/** First balanced {...} (or [...]) in the text, skipping braces inside strings. */
export function firstJsonBlock(text: string): string | null {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  for (let i = 0; i < cleaned.length; i++) {
    const open = cleaned[i];
    if (open !== "{" && open !== "[") continue;
    let depth = 0;
    let inStr = false;
    for (let j = i; j < cleaned.length; j++) {
      const ch = cleaned[j];
      if (inStr) {
        if (ch === "\\") j++;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') inStr = true;
      else if (ch === "{" || ch === "[") depth++;
      else if (ch === "}" || ch === "]") {
        depth--;
        if (depth === 0) {
          const candidate = cleaned.slice(i, j + 1);
          try {
            JSON.parse(candidate);
            return candidate;
          } catch {
            break; // not valid JSON from here; try the next opening brace
          }
        }
      }
    }
  }
  return null;
}

/** A timestamp from the model: seconds (number or numeric text) or "m:ss" / "h:mm:ss". */
function toSeconds(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return NaN;
  const t = v.trim().replace(/^\[|\]$/g, "");
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  return parseTimestamp(t);
}

/** Pull a time into [start, end]; NaN when it's missing or too far outside. */
function placeInRange(v: unknown, range: { start: number; end: number }): number {
  const t = toSeconds(v);
  if (!Number.isFinite(t) || t < range.start - EDGE_SLACK || t > range.end + EDGE_SLACK) return NaN;
  return Math.round(Math.min(range.end, Math.max(range.start, t)));
}

const DOSE = /\b\d+(?:[.,]\d+)?\s?(?:mg|mcg|µg|ug|g|mmol|units?|IU|mL|ml|L)(?:\s?\/\s?(?:kg|day|d|h|hr|min|dose|m2|m²))*\b/gi;
const squash = (s: string) => s.toLowerCase().replace(/\s+/g, "");

/** Dose-like strings in `text` that don't appear in the transcript. */
export function unquotedDoses(text: string, transcript: string): string[] {
  const source = squash(transcript);
  return (text.match(DOSE) ?? []).filter((d) => !source.includes(squash(d)));
}

const words = (s: string) => new Set(s.toLowerCase().replace(/\$[^$]*\$/g, (m) => m.replace(/\s/g, "")).split(/[^a-z0-9$\\^_{}]+/).filter((w) => w.length > 2 || /\d/.test(w)));

function similar(a: string, b: string): boolean {
  const A = words(a);
  const B = words(b);
  if (!A.size || !B.size) return a.trim().toLowerCase() === b.trim().toLowerCase();
  let both = 0;
  for (const w of A) if (B.has(w)) both++;
  return both / (A.size + B.size - both) >= 0.75;
}

const UNSURE = " (Unsure: check the recording.)";

/**
 * Validate the writer's answer. `range` is the transcript's time span; `transcript` (the plain
 * transcript text) is used to keep only drug doses the lecturer actually said.
 */
/**
 * `segStarts[i]` is the start time of transcript line i + 1 in the prompt. Writers cite lines by number
 * ("seg"), which small models get right far more often than converting times; "at" (seconds or m:ss)
 * is still accepted.
 */
export function parseExtraction(raw: string, range: { start: number; end: number }, transcript = "", segStarts: number[] = []): ExtractResult & { problems: string[] } {
  const fromSeg = (v: unknown) => {
    const n = typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v.trim()) ? Number(v) : NaN;
    return Number.isInteger(n) && n >= 1 && n <= segStarts.length ? segStarts[n - 1]! : undefined;
  };
  const problems: string[] = [];
  const block = firstJsonBlock(raw);
  if (!block) return { insights: [], chapters: [], problems: ["The writer's answer had no JSON in it."] };
  const data: unknown = JSON.parse(block);
  const obj = (Array.isArray(data) ? { insights: data } : data) as { insights?: unknown; chapters?: unknown };

  const insights: LectureInsight[] = [];
  let dropped = 0;
  for (const x of Array.isArray(obj.insights) ? obj.insights : []) {
    if (typeof x !== "object" || x === null) continue;
    const it = x as Record<string, unknown>;
    const type = typeof it.type === "string" ? (it.type.trim().toLowerCase().replace(/[\s-]+/g, "_") as InsightType) : null;
    let text = typeof it.text === "string" ? it.text.replace(/\s+/g, " ").trim() : "";
    const at = placeInRange(fromSeg(it.seg) ?? it.at ?? it.time ?? it.timestamp, range);
    if (!type || !TYPES.includes(type) || !text || !Number.isFinite(at)) {
      dropped++;
      continue;
    }
    if (unquotedDoses(text, transcript).length) {
      problems.push(`Dropped a point with a dose the lecturer didn't say: “${text.slice(0, 80)}”`);
      continue;
    }
    if (it.uncertain === true && !text.endsWith(UNSURE.trim())) text += UNSURE;
    if (insights.some((y) => similar(y.text, text))) continue;
    insights.push({ type, text, at });
  }
  if (dropped) problems.push(`Skipped ${dropped} point${dropped === 1 ? "" : "s"} without a valid type, text or timestamp inside the recording.`);

  const chapters: LectureChapter[] = [];
  for (const x of Array.isArray(obj.chapters) ? obj.chapters : []) {
    if (typeof x !== "object" || x === null) continue;
    const c = x as Record<string, unknown>;
    const title = typeof c.title === "string" ? c.title.replace(/\s+/g, " ").trim() : "";
    const at = placeInRange(fromSeg(c.seg) ?? c.at ?? c.start ?? c.time, range);
    if (!title || !Number.isFinite(at)) continue;
    chapters.push({ at, title });
  }
  return { insights: sortByTime(insights), chapters: mergeChapters(chapters), problems };
}

const sortByTime = <T extends { at?: number }>(xs: T[]) => [...xs].sort((a, b) => (a.at ?? 0) - (b.at ?? 0));

/** Sorted chapters without near-duplicates (same title, or starting within 10 s of the previous one). */
export function mergeChapters(chapters: LectureChapter[]): LectureChapter[] {
  const out: LectureChapter[] = [];
  for (const c of sortByTime(chapters)) {
    const prev = out[out.length - 1];
    if (prev && (c.at - prev.at < 10 || prev.title.toLowerCase() === c.title.toLowerCase())) continue;
    out.push(c);
  }
  return out;
}

export interface ExtractProgress {
  part: number;
  parts: number;
  /** Characters the writer has sent for this part so far. */
  chars: number;
  /** The last part of what it sent, for a live preview. */
  tail: string;
}

/** Split windows into parts of at most CHUNK_CHARS transcript characters. */
export function chunkWindows(windows: Segment[], maxChars = CHUNK_CHARS): Segment[][] {
  const parts: Segment[][] = [];
  let cur: Segment[] = [];
  let size = 0;
  for (const w of windows) {
    if (cur.length && size + w.text.length > maxChars) {
      parts.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(w);
    size += w.text.length + 10;
  }
  if (cur.length) parts.push(cur);
  return parts;
}

/** Run extraction over the whole transcript, part by part, streaming progress. */
export async function extractInsights(
  writer: Writer,
  segments: Segment[],
  opts: { title?: string; signal?: AbortSignal; onProgress?: (p: ExtractProgress) => void } = {},
): Promise<ExtractResult & { problems: string[] }> {
  if (!segments.length) throw new Error("The transcript is empty.");
  const range = transcriptRange(segments);
  const transcript = segments.map((s) => s.text).join(" ");
  const parts = chunkWindows(toWindows(segments, 30, 45));
  const insights: LectureInsight[] = [];
  const chapters: LectureChapter[] = [];
  const problems: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    let streamed = "";
    opts.onProgress?.({ part: i + 1, parts: parts.length, chars: 0, tail: "" });
    const res = await writer.complete({
      system: EXTRACT_SYSTEM,
      user: buildExtractionPrompt(part, { ...(opts.title ? { title: opts.title } : {}), part: i + 1, parts: parts.length }),
      json: true,
      maxTokens: 2000,
      ...(opts.signal ? { signal: opts.signal } : {}),
      onText: (d) => {
        streamed += d;
        opts.onProgress?.({ part: i + 1, parts: parts.length, chars: streamed.length, tail: streamed.slice(-240) });
      },
    });
    // Each part may only place items inside its own stretch of the recording.
    const partRange = { start: part[0]!.start, end: part[part.length - 1]!.end };
    const r = parseExtraction(res.text, { start: Math.max(range.start, partRange.start), end: Math.min(range.end, partRange.end) }, transcript, part.map((w) => w.start));
    const tag = parts.length > 1 ? `Part ${i + 1}: ` : "";
    problems.push(...r.problems.map((p) => tag + p));
    if (res.truncated) problems.push(`${tag}the writer's answer was cut off at the length limit; some points may be missing.`);
    for (const x of r.insights) if (!insights.some((y) => similar(y.text, x.text))) insights.push(x);
    chapters.push(...r.chapters);
  }
  return { insights: sortByTime(insights), chapters: mergeChapters(chapters), problems };
}
