import { parse, stringify } from "yaml";
import type { CaseStage, ClinicalCase, Concept, Course, InsightType, Lab, Lecture, Question, Skill } from "./types";
import { validateCourse } from "./validate";

/**
 * Course folders <-> Course objects. A course folder (courses/<CODE>/, git-ignored) holds plain
 * files, in the same spirit as course-noting:
 *
 *   course.json           id, code, title, description, topics
 *   concepts/<slug>.md    front matter (title, topic, summary, formulas?, model?, pearls) + body
 *   questions/<id>.md     front matter + prompt, <!-- split:hints -->, <!-- split:explanation -->
 *   lectures/<id>.md      front matter (week, title, topic, summary, insights, audio?, chapters?) + notes
 *                         (insights[].at and chapters[].at are seconds, or "m:ss" / "h:mm:ss")
 *   labs|cases|skills/<id>.yaml   the Lab / ClinicalCase / Skill object as YAML
 *
 * Every item may carry an optional `order` number; items are sorted by it, then by file name.
 * Pure (no fs), so it runs in Node (scripts/course.ts) and the browser alike.
 */

export const PACK_FORMAT = "study-forge-course";
export const PACK_VERSION = 1;

export interface CoursePack {
  format: typeof PACK_FORMAT;
  version: number;
  course: Course;
}

export function wrapPack(course: Course): CoursePack {
  return { format: PACK_FORMAT, version: PACK_VERSION, course };
}

const SPLIT_HINTS = "<!-- split:hints -->";
const SPLIT_EXPLANATION = "<!-- split:explanation -->";
const INSIGHT_TYPES: InsightType[] = ["exam_tip", "clinical_link", "intuition"];
const FOLDERS = ["concepts", "questions", "lectures", "labs", "cases", "skills"] as const;
type Folder = (typeof FOLDERS)[number];

type Obj = Record<string, unknown>;

/** Collects problems for one file; field readers return a safe default after recording an error. */
class FileReader {
  constructor(
    readonly path: string,
    readonly data: Obj,
    readonly errors: string[],
  ) {}
  err(msg: string) {
    this.errors.push(`${this.path}: ${msg}`);
  }
  has(key: string) {
    return this.data[key] !== undefined && this.data[key] !== null;
  }
  str(key: string, fallback?: string): string {
    const v = this.data[key];
    if (v === undefined || v === null) {
      if (fallback !== undefined) return fallback;
      this.err(`missing "${key}"`);
      return "";
    }
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    this.err(`"${key}" must be text`);
    return "";
  }
  num(key: string, fallback?: number): number {
    const v = this.data[key];
    if (v === undefined || v === null) {
      if (fallback !== undefined) return fallback;
      this.err(`missing "${key}"`);
      return NaN;
    }
    const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
    if (typeof n === "number" && Number.isFinite(n)) return n;
    this.err(`${key} must be a number`);
    return NaN;
  }
  strList(key: string, required = true): string[] {
    const v = this.data[key];
    if (v === undefined || v === null) {
      if (required) this.err(`missing "${key}" (a list)`);
      return [];
    }
    if (!Array.isArray(v)) {
      this.err(`"${key}" must be a list`);
      return [];
    }
    return v.map((x, i) => {
      if (typeof x === "string") return x;
      if (typeof x === "number" || typeof x === "boolean") return String(x);
      this.err(`${key}[${i}] must be text`);
      return "";
    });
  }
  objList(key: string): Obj[] {
    const v = this.data[key];
    if (v === undefined || v === null) {
      this.err(`missing "${key}" (a list)`);
      return [];
    }
    if (!Array.isArray(v) || v.some((x) => !isObj(x))) {
      this.err(`"${key}" must be a list of objects`);
      return [];
    }
    return v as Obj[];
  }
  /** Reader for a nested object, reporting errors as e.g. "labs/x.yaml: steps[2]: …". */
  child(where: string, data: Obj) {
    return new FileReader(`${this.path}: ${where}`, data, this.errors);
  }
}

const isObj = (x: unknown): x is Obj => typeof x === "object" && x !== null && !Array.isArray(x);

function splitFrontMatter(path: string, text: string, errors: string[]): { data: Obj; body: string } | null {
  const m = /^---[ \t]*\n([\s\S]*?)\n?---[ \t]*(?:\n|$)([\s\S]*)$/.exec(text);
  if (!m) {
    errors.push(`${path}: must start with YAML front matter between "---" lines`);
    return null;
  }
  const data = parseYaml(path, m[1] ?? "", errors);
  return data ? { data, body: (m[2] ?? "").trim() } : null;
}

function parseYaml(path: string, text: string, errors: string[]): Obj | null {
  try {
    const v: unknown = parse(text);
    if (v === null || v === undefined) return {};
    if (!isObj(v)) {
      errors.push(`${path}: YAML must be a mapping of fields (key: value)`);
      return null;
    }
    return v;
  } catch (e) {
    errors.push(`${path}: invalid YAML: ${(e as Error).message.split("\n")[0]}`);
    return null;
  }
}

/** Splits a "- " list; lines indented under an item continue it (joined with newlines). */
function parseBullets(text: string): string[] {
  const items: string[] = [];
  for (const line of text.split("\n")) {
    const m = /^\s*[-*]\s+(.*)$/.exec(line);
    if (m && !/^\s{2,}/.test(line)) items.push(m[1] ?? "");
    else if (items.length && line.trim()) items[items.length - 1] += "\n" + line.replace(/^ {2}/, "");
    else if (line.trim()) items.push(line.trim());
  }
  return items.map((s) => s.trimEnd());
}

const bullets = (items: string[]) => items.map((s) => `- ${s.replace(/\n/g, "\n  ")}`).join("\n");

const baseName = (path: string) => (path.split("/").pop() ?? path).replace(/\.(md|ya?ml|json)$/i, "");

interface Sorted<T> {
  item: T;
  order: number;
  file: string;
}

function sortItems<T>(xs: Sorted<T>[], tiebreak?: (a: T, b: T) => number): T[] {
  return xs
    .sort((a, b) => a.order - b.order || (tiebreak ? tiebreak(a.item, b.item) : 0) || (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))
    .map((x) => x.item);
}

function orderOf(r: FileReader): number {
  return r.has("order") ? r.num("order") : Number.POSITIVE_INFINITY;
}

function readConcept(r: FileReader, body: string): Concept {
  const c: Concept = {
    slug: r.str("slug", baseName(r.path)),
    title: r.str("title"),
    topic: r.str("topic"),
    summary: r.str("summary"),
    body,
    pearls: r.strList("pearls"),
  };
  if (r.has("formulas")) c.formulas = r.strList("formulas");
  if (r.has("model")) c.model = r.str("model");
  return c;
}

function readQuestion(r: FileReader, body: string): Question | null {
  const hi = body.indexOf(SPLIT_HINTS);
  const ei = body.indexOf(SPLIT_EXPLANATION);
  const split = hi >= 0 && ei > hi;
  const base = {
    id: r.str("id", baseName(r.path)),
    topic: r.str("topic"),
    difficulty: r.num("difficulty") as 1 | 2 | 3,
    prompt: (split ? body.slice(0, hi) : body).trim(),
    hints: split ? parseBullets(body.slice(hi + SPLIT_HINTS.length, ei).trim()) : [],
    explanation: split ? body.slice(ei + SPLIT_EXPLANATION.length).trim() : "",
    concepts: r.strList("concepts"),
  };
  if (Number.isFinite(base.difficulty) && ![1, 2, 3].includes(base.difficulty)) r.err("difficulty must be 1, 2 or 3");
  if (!split) {
    r.err(`body needs the prompt, then a "${SPLIT_HINTS}" line with a "- " list of hints, then a "${SPLIT_EXPLANATION}" line and the explanation`);
  } else {
    if (!base.prompt) r.err("the prompt (text before the hints marker) is empty");
    if (!base.explanation) r.err("the explanation is empty");
  }
  const type = r.str("type");
  let q: Question | null = null;
  if (type === "mcq") {
    const answer = r.num("answer");
    if (Number.isFinite(answer) && !Number.isInteger(answer)) r.err("answer must be the index (0, 1, 2…) of the correct option");
    q = { ...base, type: "mcq", options: r.strList("options"), answer };
  } else if (type === "numeric") {
    q = { ...base, type: "numeric", answer: r.num("answer"), tolerance: r.num("tolerance", 0), unit: r.str("unit", "") };
  } else if (type) r.err(`type must be "mcq" or "numeric", not "${type}"`);
  return split ? q : null;
}

function readLecture(r: FileReader, body: string): Lecture {
  const insights = (r.has("insights") ? r.objList("insights") : []).map((o, i) => {
    const ir = r.child(`insights[${i}]`, o);
    const type = ir.str("type") as InsightType;
    if (type && !INSIGHT_TYPES.includes(type)) ir.err(`type must be one of ${INSIGHT_TYPES.join(", ")}`);
    const out: Lecture["insights"][number] = { type, text: ir.str("text") };
    if (ir.has("concept")) out.conceptSlug = ir.str("concept");
    if (ir.has("at")) out.at = readTime(ir, "at");
    return out;
  });
  const lecture: Lecture = {
    id: r.str("id", baseName(r.path)),
    week: r.num("week"),
    title: r.str("title"),
    topic: r.str("topic"),
    summary: r.str("summary"),
    notes: body,
    insights,
  };
  if (r.has("audio")) lecture.audio = r.str("audio");
  if (r.has("chapters")) {
    lecture.chapters = r.objList("chapters").map((o, i) => {
      const cr = r.child(`chapters[${i}]`, o);
      return { at: readTime(cr, "at"), title: cr.str("title") };
    });
  }
  return lecture;
}

/** A time in seconds, or "m:ss" / "h:mm:ss" text (easier to write by hand). */
function readTime(r: FileReader, key: string): number {
  const v = r.data[key];
  if (typeof v === "string" && /^\d+(:\d{1,2}){1,2}(\.\d+)?$/.test(v.trim())) {
    return v
      .trim()
      .split(":")
      .reduce((acc, part) => acc * 60 + Number(part), 0);
  }
  return r.num(key);
}

/** YAML items pass through as written (plus a default id) after a structural check. */
function readLab(r: FileReader): Lab {
  r.str("title");
  r.str("topic");
  r.str("objective");
  r.str("resultsGuide");
  r.strList("safety");
  r.strList("materials");
  r.objList("steps").forEach((s, i) => r.child(`steps[${i}]`, s).str("text"));
  (r.has("drills") ? r.objList("drills") : []).forEach((d, i) => {
    const dr = r.child(`drills[${i}]`, d);
    dr.str("id");
    dr.str("prompt");
    dr.num("answer");
    dr.num("tolerance");
    dr.str("unit", "");
    dr.str("working");
  });
  return { ...r.data, id: r.str("id", baseName(r.path)), drills: r.has("drills") ? r.data.drills : [] } as Lab;
}

function readCase(r: FileReader): ClinicalCase {
  r.str("title");
  r.str("topic");
  r.str("setting");
  r.str("presentation");
  r.strList("teachingPoints");
  r.objList("stages").forEach((s, i) => {
    const sr = r.child(`stages[${i}]`, s);
    sr.str("title");
    sr.str("prompt");
    sr.str("debrief");
    const mode = sr.str("mode") as CaseStage["mode"];
    if (mode && mode !== "multi" && mode !== "single") sr.err(`mode must be "multi" or "single"`);
    sr.objList("options").forEach((o, j) => {
      const or = sr.child(`options[${j}]`, o);
      or.str("text");
      or.str("feedback");
      if (typeof o.good !== "boolean") or.err(`"good" must be true or false`);
    });
  });
  return { ...r.data, id: r.str("id", baseName(r.path)) } as ClinicalCase;
}

function readSkill(r: FileReader): Skill {
  r.str("title");
  r.str("purpose");
  r.objList("items").forEach((it, i) => {
    const ir = r.child(`items[${i}]`, it);
    ir.str("text");
    if (it.critical !== undefined && typeof it.critical !== "boolean") ir.err(`"critical" must be true or false`);
  });
  return { ...r.data, id: r.str("id", baseName(r.path)) } as Skill;
}

/** Parse a course folder given as { "relative/path": text }. Errors name the file; validateCourse runs last. */
export function parseCourseFiles(files: Record<string, string>): { course: Course; errors: string[] } {
  const errors: string[] = [];
  const course: Course = { id: "", code: "", title: "", description: "", topics: [], concepts: [], lectures: [], questions: [], labs: [], cases: [], skills: [] };
  const buckets: Record<Folder, Sorted<unknown>[]> = { concepts: [], questions: [], lectures: [], labs: [], cases: [], skills: [] };
  const push = (folder: Folder, item: unknown, r: FileReader) => buckets[folder].push({ item, order: orderOf(r), file: r.path });

  let sawCourseJson = false;
  for (const rawPath of Object.keys(files).sort()) {
    const path = rawPath.replace(/\\/g, "/").replace(/^\.\//, "");
    const text = (files[rawPath] ?? "").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
    const name = path.split("/").pop() ?? path;
    if (!/\.(json|md|ya?ml)$/i.test(name) || /^readme\.md$/i.test(name)) continue;

    if (path === "course.json") {
      sawCourseJson = true;
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (e) {
        errors.push(`course.json: invalid JSON: ${(e as Error).message}`);
        continue;
      }
      if (!isObj(data)) {
        errors.push("course.json: must be a JSON object");
        continue;
      }
      const r = new FileReader(path, data, errors);
      course.id = r.str("id");
      course.code = r.str("code");
      course.title = r.str("title");
      course.description = r.str("description", "");
      course.topics = r.strList("topics");
      continue;
    }

    const parts = path.split("/");
    const folder = parts[0] as Folder;
    if (parts.length !== 2 || !FOLDERS.includes(folder)) {
      errors.push(`${path}: not part of the course format (expected course.json or a file in ${FOLDERS.map((f) => f + "/").join(", ")})`);
      continue;
    }
    const isMd = /\.md$/i.test(name);
    const wantMd = folder === "concepts" || folder === "questions" || folder === "lectures";
    if (isMd !== wantMd) {
      errors.push(`${path}: files in ${folder}/ must be ${wantMd ? ".md (front matter + text)" : ".yaml"}`);
      continue;
    }

    if (wantMd) {
      const fm = splitFrontMatter(path, text, errors);
      if (!fm) continue;
      const r = new FileReader(path, fm.data, errors);
      if (folder === "concepts") push(folder, readConcept(r, fm.body), r);
      else if (folder === "lectures") push(folder, readLecture(r, fm.body), r);
      else {
        const q = readQuestion(r, fm.body);
        if (q) push(folder, q, r);
      }
    } else {
      const data = parseYaml(path, text, errors);
      if (!data) continue;
      const order = data.order;
      delete data.order;
      const r = new FileReader(path, data, errors);
      const item = folder === "labs" ? readLab(r) : folder === "cases" ? readCase(r) : readSkill(r);
      if (order !== undefined && !Number.isFinite(Number(order))) errors.push(`${path}: order must be a number`);
      buckets[folder].push({ item, order: order === undefined ? Number.POSITIVE_INFINITY : Number(order), file: path });
    }
  }
  if (!sawCourseJson) errors.push("course.json: missing (it holds the course id, code, title, description and topics)");

  course.concepts = sortItems(buckets.concepts as Sorted<Concept>[]);
  course.questions = sortItems(buckets.questions as Sorted<Question>[]);
  course.lectures = sortItems(buckets.lectures as Sorted<Lecture>[], (a, b) => a.week - b.week);
  course.labs = sortItems(buckets.labs as Sorted<Lab>[]);
  course.cases = sortItems(buckets.cases as Sorted<ClinicalCase>[]);
  course.skills = sortItems(buckets.skills as Sorted<Skill>[]);

  // Only run the content rules once the structure is sound, so validateCourse never reads a missing field.
  if (!errors.length) {
    for (const e of validateCourse(course)) errors.push(`course: ${e}`);
  }
  return { course, errors };
}

// ---------------------------------------------------------------- course -> files

const fileSafe = (id: string) => id.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[-.]+|-+$/g, "") || "item";

const yaml = (data: unknown) => stringify(data, { lineWidth: 0 });

const md = (front: Obj, body: string) => `---\n${yaml(front)}---\n\n${body.trim()}\n`;

/**
 * Pick a file name per item, and an `order` value only when sorting by file name
 * wouldn't reproduce the original order.
 */
function layout<T>(items: T[], id: (x: T) => string, naturalCmp?: (a: T, b: T) => number) {
  const used = new Set<string>();
  const names = items.map((x) => {
    let n = fileSafe(id(x));
    for (let k = 2; used.has(n.toLowerCase()); k++) n = `${fileSafe(id(x))}-${k}`;
    used.add(n.toLowerCase());
    return n;
  });
  const idx = items.map((_, i) => i);
  const sorted = [...idx].sort((a, b) => (naturalCmp ? naturalCmp(items[a]!, items[b]!) : 0) || (names[a]! < names[b]! ? -1 : names[a]! > names[b]! ? 1 : 0));
  const needOrder = sorted.some((v, i) => v !== i);
  return items.map((x, i) => ({ item: x, name: names[i]!, order: needOrder ? i + 1 : undefined, idFromName: names[i] === id(x) }));
}

/** The inverse of parseCourseFiles: a course as folder files ({ path: text }). */
export function courseToFiles(course: Course): Record<string, string> {
  const files: Record<string, string> = {};
  files["course.json"] =
    JSON.stringify({ id: course.id, code: course.code, title: course.title, description: course.description, topics: course.topics }, null, 2) + "\n";

  for (const { item: c, name, order, idFromName } of layout(course.concepts, (c) => c.slug)) {
    const front: Obj = {};
    if (!idFromName) front.slug = c.slug;
    if (order !== undefined) front.order = order;
    Object.assign(front, { title: c.title, topic: c.topic, summary: c.summary });
    if (c.formulas) front.formulas = c.formulas;
    if (c.model) front.model = c.model;
    front.pearls = c.pearls;
    files[`concepts/${name}.md`] = md(front, c.body);
  }

  for (const { item: q, name, order, idFromName } of layout(course.questions, (q) => q.id)) {
    const front: Obj = {};
    if (!idFromName) front.id = q.id;
    if (order !== undefined) front.order = order;
    Object.assign(front, { type: q.type, topic: q.topic, difficulty: q.difficulty, concepts: q.concepts });
    if (q.type === "mcq") Object.assign(front, { options: q.options, answer: q.answer });
    else Object.assign(front, { answer: q.answer, tolerance: q.tolerance, unit: q.unit });
    const body = `${q.prompt.trim()}\n\n${SPLIT_HINTS}\n\n${bullets(q.hints)}\n\n${SPLIT_EXPLANATION}\n\n${q.explanation.trim()}`;
    files[`questions/${name}.md`] = md(front, body);
  }

  for (const { item: l, name, order, idFromName } of layout(course.lectures, (l) => l.id, (a, b) => a.week - b.week)) {
    files[`lectures/${name}.md`] = lectureMarkdown(l, { withId: !idFromName, ...(order !== undefined ? { order } : {}) });
  }

  const yamlItems = <T extends { id: string }>(folder: string, items: T[]) => {
    for (const { item, name, order } of layout(items, (x) => x.id)) {
      const { id, ...rest } = item;
      files[`${folder}/${name}.yaml`] = yaml({ id, ...(order !== undefined ? { order } : {}), ...rest });
    }
  };
  yamlItems("labs", course.labs);
  yamlItems("cases", course.cases);
  yamlItems("skills", course.skills);
  return files;
}

/**
 * One lecture as a course-folder file (lectures/<id>.md): front matter with week, title, topic,
 * summary, insights (with `at` seconds), audio and chapters, then the notes. `withId` writes the
 * id into the front matter (needed when the file name differs from the id).
 */
export function lectureMarkdown(l: Lecture, opts: { withId?: boolean; order?: number } = {}): string {
  const front: Obj = {};
  if (opts.withId) front.id = l.id;
  if (opts.order !== undefined) front.order = opts.order;
  Object.assign(front, {
    week: l.week,
    title: l.title,
    topic: l.topic,
    summary: l.summary,
    insights: l.insights.map((i) => {
      const o: Obj = { type: i.type, text: i.text };
      if (i.conceptSlug) o.concept = i.conceptSlug;
      if (i.at !== undefined) o.at = i.at;
      return o;
    }),
  });
  if (l.audio !== undefined) front.audio = l.audio;
  if (l.chapters) front.chapters = l.chapters.map((c) => ({ at: c.at, title: c.title }));
  return md(front, l.notes);
}

/** File name (without folder) for a lecture: the id made file-safe. */
export const lectureFileName = (l: Pick<Lecture, "id">) => `${fileSafe(l.id)}.md`;
