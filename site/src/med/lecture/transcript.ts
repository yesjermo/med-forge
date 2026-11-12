/**
 * Lecture transcripts: WebVTT and SRT caption files (what Echo360, Panopto, Kaltura, YouTube and
 * most lecture-capture systems export) and plain text, parsed into timed segments, then merged
 * into windows of a minute or two for the AI. Pure functions; no DOM.
 */

export interface Segment {
  /** Seconds. */
  start: number;
  end: number;
  text: string;
}

export type TranscriptFormat = "vtt" | "srt" | "text";

export interface Transcript {
  format: TranscriptFormat;
  segments: Segment[];
  /**
   * False when the text had no timestamps, so times are estimated from reading speed
   * (about 150 words a minute) and only roughly match the recording.
   */
  timed: boolean;
}

/** Speaking rate used to place untimed text: 150 words per minute. */
const WORDS_PER_SECOND = 2.5;

/** "01:02:03.456", "02:03.4", "00:00:01,000" (SRT comma) → seconds; NaN when it isn't a time. */
export function parseTimestamp(s: string): number {
  const m = /^\s*(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:[.,](\d{1,3}))?\s*$/.exec(s);
  if (!m) return NaN;
  const [, h, min, sec, frac] = m;
  if (Number(sec) > 59 || (h !== undefined && Number(min) > 59)) return NaN;
  return Number(h ?? 0) * 3600 + Number(min) * 60 + Number(sec) + (frac ? Number(frac.padEnd(3, "0")) / 1000 : 0);
}

/** Seconds → "m:ss", or "h:mm:ss" from an hour up. */
export function formatTime(seconds: number): string {
  const t = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

const TIMING = /^\s*((?:\d+:)?\d{1,2}:\d{1,2}(?:[.,]\d{1,3})?)\s*-->\s*((?:\d+:)?\d{1,2}:\d{1,2}(?:[.,]\d{1,3})?)(?:\s+.*)?$/;

/** Caption text without markup: <v Speaker>, <c.class>, <b>, <i>, inline <00:01.000> times, {\an8}. */
function cleanCueText(lines: string[]): string {
  return lines
    .join(" ")
    .replace(/<v(?:\.[^\s>]*)?\s+([^>]+)>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\{\\[^}]*\}/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Cue blocks (VTT or SRT): any block with a "start --> end" line; NOTE/STYLE/REGION blocks have none. */
function parseCues(text: string): Segment[] {
  const out: Segment[] = [];
  for (const block of text.split(/\n[ \t]*\n/)) {
    const lines = block.split("\n");
    const ti = lines.findIndex((l) => TIMING.test(l));
    if (ti < 0) continue;
    if (/^\s*(NOTE|STYLE|REGION)\b/.test(lines[0] ?? "")) continue;
    const m = TIMING.exec(lines[ti]!)!;
    const start = parseTimestamp(m[1]!);
    const end = parseTimestamp(m[2]!);
    const cue = cleanCueText(lines.slice(ti + 1));
    if (!Number.isFinite(start) || !cue) continue;
    out.push({ start, end: Number.isFinite(end) && end >= start ? end : start, text: cue });
  }
  // Rolling captions repeat the previous line; drop exact consecutive repeats.
  return out
    .sort((a, b) => a.start - b.start)
    .filter((s, i, xs) => i === 0 || s.text !== xs[i - 1]!.text || s.start - xs[i - 1]!.end > 1);
}

/**
 * Plain text. Lines that start with a time ("12:34", "[1:02:03]", "(00:05)") set the time for
 * what follows; with no times at all, times are estimated from word count.
 */
function parsePlain(text: string): { segments: Segment[]; timed: boolean } {
  const STAMP = /^\s*[[(]?((?:\d+:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?)[\])]?\s*(?:[-–—:]\s*)?(.*)$/;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const stamped = lines.filter((l) => {
    const m = STAMP.exec(l);
    return m && Number.isFinite(parseTimestamp(m[1]!));
  }).length;

  if (stamped >= Math.max(1, lines.length * 0.2)) {
    const segs: Segment[] = [];
    for (const l of lines) {
      const m = STAMP.exec(l);
      const t = m ? parseTimestamp(m[1]!) : NaN;
      if (Number.isFinite(t)) segs.push({ start: t, end: t, text: m![2]!.trim() });
      else if (segs.length) segs[segs.length - 1]!.text = `${segs[segs.length - 1]!.text} ${l}`.trim();
      else segs.push({ start: 0, end: 0, text: l });
    }
    const sorted = segs.filter((s) => s.text).sort((a, b) => a.start - b.start);
    sorted.forEach((s, i) => {
      const next = sorted[i + 1];
      s.end = next ? Math.max(s.start, next.start) : s.start + wordCount(s.text) / WORDS_PER_SECOND;
    });
    return { segments: sorted, timed: true };
  }

  // No times: split into sentences and pace them at speaking speed.
  const sentences = text.replace(/\s+/g, " ").trim().match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g) ?? [];
  const segments: Segment[] = [];
  let t = 0;
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    const d = Math.max(1, wordCount(s) / WORDS_PER_SECOND);
    segments.push({ start: round(t), end: round(t + d), text: s });
    t += d;
  }
  return { segments, timed: false };
}

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;
const round = (x: number) => Math.round(x * 1000) / 1000;

/** Parse a transcript. `filename` picks the format by extension; otherwise it's sniffed from the text. */
export function parseTranscript(input: string, filename = ""): Transcript {
  const text = input.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const ext = /\.([a-z0-9]+)$/i.exec(filename)?.[1]?.toLowerCase();
  const hasCueTiming = text.split("\n").some((l) => TIMING.test(l));
  const format: TranscriptFormat =
    ext === "vtt" || /^\s*WEBVTT/.test(text) ? "vtt" : ext === "srt" || hasCueTiming ? "srt" : "text";
  if (format !== "text") {
    const body = format === "vtt" ? text.replace(/^\s*WEBVTT[^\n]*\n?/, "") : text;
    return { format, segments: parseCues(body), timed: true };
  }
  return { format, ...parsePlain(text) };
}

/**
 * Merge segments into windows of about `target` seconds (never longer than `max` unless one
 * segment is), breaking at segment boundaries. Defaults: ~90 s, at most 120 s.
 */
export function toWindows(segments: Segment[], target = 90, max = 120): Segment[] {
  const out: Segment[] = [];
  let cur: Segment | null = null;
  for (const s of segments) {
    if (cur && (s.end - cur.start > max || cur.end - cur.start >= target)) {
      out.push(cur);
      cur = null;
    }
    if (!cur) cur = { start: s.start, end: s.end, text: s.text };
    else {
      cur.end = Math.max(cur.end, s.end);
      cur.text = `${cur.text} ${s.text}`;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** Start and end of a transcript in seconds ({0, 0} when empty). */
export function transcriptRange(segments: Segment[]): { start: number; end: number } {
  if (!segments.length) return { start: 0, end: 0 };
  return segments.reduce((r, s) => ({ start: Math.min(r.start, s.start), end: Math.max(r.end, s.end) }), { start: Infinity, end: -Infinity });
}
