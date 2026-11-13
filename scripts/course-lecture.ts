/**
 * `course lecture`: turn a captions/transcript file the student downloaded themselves (Echo360,
 * Panopto, Kaltura… export .vtt / .srt / .txt) into lectures/<id>.md in a course folder.
 * Nothing here logs in to or scrapes a lecture-capture site.
 */
import fs from "node:fs";
import path from "node:path";
import { lectureFileName, lectureMarkdown, parseCourseFiles } from "../site/src/med/coursefiles";
import { extractInsights, type ExtractProgress } from "../site/src/med/lecture/extract";
import { formatTime, parseTranscript, toWindows, transcriptRange, type Segment } from "../site/src/med/lecture/transcript";
import type { Lecture, LectureChapter } from "../site/src/med/types";
import type { Writer } from "../src/engine/llm/types";

export interface LectureOptions {
  /** Lecture id; default `<code>-l<N>` with the next free N. */
  id?: string;
  title?: string;
  topic?: string;
  week?: number;
  audio?: string;
}

export interface CourseInfo {
  /** Folder name, e.g. "BIOL113" (ids start with it, lower-cased). */
  code: string;
  topics: string[];
  /** Lectures already in the folder (id and week are all that's used). */
  lectures: Pick<Lecture, "id" | "week">[];
  /** File names already in lectures/ (to find a free id). */
  files?: string[];
}

/** First `n` sentences of a text. */
export function firstSentences(text: string, n = 2): string {
  const parts = text.replace(/\s+/g, " ").trim().match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g) ?? [];
  return parts.slice(0, n).join("").trim();
}

/** Notes: one short timestamped paragraph (first sentences) per ~90 s window. */
export function notesFromSegments(segments: Segment[]): string {
  return toWindows(segments)
    .map((w) => `**[${formatTime(w.start)}]** ${firstSentences(w.text)}`)
    .join("\n\n");
}

/** Chapters without AI: one every ~5 minutes, titled with the start of what was said. */
export function chaptersFromSegments(segments: Segment[]): LectureChapter[] {
  return toWindows(segments, 300, 360).map((w) => {
    let title = firstSentences(w.text, 1).replace(/[.!?]+$/, "");
    if (title.length > 60) title = `${title.slice(0, 57).replace(/\s+\S*$/, "")}…`;
    return { at: Math.round(w.start), title: title || `From ${formatTime(w.start)}` };
  });
}

const idPrefix = (code: string) => code.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** The next unused `<code>-l<N>` id. */
export function nextLectureId(course: CourseInfo): string {
  const p = idPrefix(course.code);
  const taken = new Set([...course.lectures.map((l) => l.id), ...(course.files ?? []).map((f) => f.replace(/\.md$/, ""))]);
  let n = 1;
  while (taken.has(`${p}-l${n}`)) n++;
  return `${p}-l${n}`;
}

/** Problems with the options before any work is done (empty when fine). */
export function checkOptions(course: CourseInfo, opts: LectureOptions): string[] {
  const errs: string[] = [];
  if (opts.topic !== undefined && !course.topics.includes(opts.topic)) {
    errs.push(`Topic "${opts.topic}" isn't in course.json. Use one of: ${course.topics.map((t) => `"${t}"`).join(", ") || "(none listed)"}.`);
  }
  if (opts.topic === undefined && !course.topics.length) errs.push("course.json lists no topics; add one first.");
  if (opts.week !== undefined && !(Number.isInteger(opts.week) && opts.week >= 0)) errs.push("--week must be a whole number (0 or more).");
  if (opts.audio !== undefined && !/^https?:\/\/\S+$/i.test(opts.audio)) errs.push("--audio must be an http(s) URL to the recording (a direct media link).");
  if (opts.id !== undefined && !/^[a-z0-9][a-z0-9_-]*$/i.test(opts.id)) errs.push("--id should be letters, digits, - or _.");
  return errs;
}

export interface BuildResult {
  lecture: Lecture;
  /** Warnings from insight extraction (points dropped, answer cut off…). */
  problems: string[];
}

/**
 * Build a Lecture from captions text. With a writer, runs extractInsights (insights and
 * chapters cite transcript lines); with `writer: null`, notes and chapters only.
 * Throws on an empty transcript, bad options, or a writer error.
 */
export async function buildLecture(
  captions: string,
  filename: string,
  course: CourseInfo,
  opts: LectureOptions,
  writer: Writer | null,
  onProgress?: (p: ExtractProgress) => void,
): Promise<BuildResult> {
  const errs = checkOptions(course, opts);
  if (errs.length) throw new Error(errs.join("\n"));
  const { segments, timed } = parseTranscript(captions, filename);
  if (!segments.length) throw new Error(`No caption text found in ${filename || "the file"}.`);

  const week = opts.week ?? Math.max(0, ...course.lectures.map((l) => l.week)) + 1;
  const title = opts.title?.trim() || `Week ${week} lecture`;
  const problems: string[] = [];
  let insights: Lecture["insights"] = [];
  let chapters: LectureChapter[] = [];
  if (writer) {
    const r = await extractInsights(writer, segments, { title, ...(onProgress ? { onProgress } : {}) });
    insights = r.insights;
    chapters = r.chapters;
    problems.push(...r.problems);
  }
  if (!chapters.length) chapters = chaptersFromSegments(segments);

  const { end } = transcriptRange(segments);
  const minutes = Math.max(1, Math.round(end / 60));
  const summary = insights[0]?.text ?? `Notes from the ${timed ? `${minutes}-minute ` : ""}lecture captions${insights.length ? "" : " (no AI insights yet)"}.`;
  const lecture: Lecture = {
    id: opts.id ?? nextLectureId(course),
    week,
    title,
    topic: opts.topic ?? course.topics[0]!,
    summary,
    notes: notesFromSegments(segments),
    insights,
    ...(opts.audio ? { audio: opts.audio } : {}),
    chapters,
  };
  if (!timed) problems.push("The file had no timestamps, so times are estimated from reading speed.");
  return { lecture, problems };
}

/** Read courses/<CODE>/ enough to add a lecture: course.json topics, existing lectures and file names. */
export function readCourseInfo(dir: string, code: string): CourseInfo {
  const json = JSON.parse(fs.readFileSync(path.join(dir, "course.json"), "utf8")) as { topics?: unknown };
  const lecturesDir = path.join(dir, "lectures");
  const files = fs.existsSync(lecturesDir) ? fs.readdirSync(lecturesDir).filter((f) => f.endsWith(".md")) : [];
  const folder: Record<string, string> = { "course.json": fs.readFileSync(path.join(dir, "course.json"), "utf8") };
  for (const f of files) folder[`lectures/${f}`] = fs.readFileSync(path.join(lecturesDir, f), "utf8");
  const lectures = parseCourseFiles(folder).course.lectures.map((l) => ({ id: l.id, week: Number.isFinite(l.week) ? l.week : 0 }));
  const topics = Array.isArray(json.topics) ? json.topics.filter((t): t is string => typeof t === "string") : [];
  return { code, topics, lectures, files };
}

/** Write the lecture file; refuses to overwrite. Returns the path written. */
export function writeLecture(dir: string, lecture: Lecture): string {
  const file = path.join(dir, "lectures", lectureFileName(lecture));
  if (fs.existsSync(file)) throw new Error(`${file} already exists; not overwriting it. Pick another id with --id.`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lectureMarkdown(lecture), { flag: "wx" });
  return file;
}

export interface LectureArgs extends LectureOptions {
  code?: string;
  file?: string;
  ai: boolean;
  writer?: string;
  model?: string;
}

/** Parse `<CODE> <captions-file> [--title …] [--topic …] [--week N] [--audio url] [--id id] [--no-ai] [--writer w] [--model m]`. */
export function parseLectureArgs(argv: string[]): { args: LectureArgs; errors: string[] } {
  const args: LectureArgs = { ai: true };
  const errors: string[] = [];
  const positional: string[] = [];
  const valued = new Set(["--title", "--topic", "--week", "--audio", "--id", "--writer", "--model"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    const eq = a.startsWith("--") ? a.indexOf("=") : -1;
    const flag = eq > 0 ? a.slice(0, eq) : a;
    if (flag === "--no-ai") args.ai = false;
    else if (valued.has(flag)) {
      const v = eq > 0 ? a.slice(eq + 1) : argv[++i];
      if (v === undefined) {
        errors.push(`${flag} needs a value.`);
        continue;
      }
      if (flag === "--week") args.week = /^\d+$/.test(v) ? Number(v) : NaN;
      else (args as unknown as Record<string, string>)[flag.slice(2)] = v;
    } else if (a.startsWith("--")) errors.push(`Unknown option ${a}.`);
    else positional.push(a);
  }
  [args.code, args.file] = positional;
  if (positional.length > 2) errors.push(`Unexpected argument "${positional[2]}".`);
  return { args, errors };
}
