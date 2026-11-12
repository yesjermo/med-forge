import { checkNumber } from "./labmath";
import { hasModel, MODEL_IDS } from "./model3d/models";
import type { Course, Lecture } from "./types";

/**
 * Check a course pack is internally consistent. Used by the tests, the course bundler
 * (npm run course:bundle) and the in-app pack import. Returns a list of problems (empty = valid).
 */
export function validateCourse(c: Course): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  const unique = (kind: string, id: string) => {
    if (ids.has(id)) errs.push(`${kind} id "${id}" is not unique`);
    ids.add(id);
  };
  const topic = (where: string, t: string) => {
    if (!c.topics.includes(t)) errs.push(`${where}: topic "${t}" is not in course.topics`);
  };
  const slugs = new Set(c.concepts.map((x) => x.slug));

  if (!/^[a-z0-9-]+$/.test(c.id)) errs.push(`course id "${c.id}" must be a lowercase slug`);
  if (c.concepts.length < 4) errs.push("needs at least 4 concepts");
  if (c.questions.length < 6) errs.push("needs at least 6 questions");
  if (c.lectures.length < 2) errs.push("needs at least 2 lectures");
  if (!c.labs.length || !c.cases.length || !c.skills.length) errs.push("needs a lab, a case and a skill");

  for (const x of c.concepts) {
    unique("concept", x.slug);
    topic(`concept ${x.slug}`, x.topic);
    if (!x.pearls.length) errs.push(`concept ${x.slug} has no pearls`);
    if ((x.body.match(/\$\$/g) ?? []).length % 2) errs.push(`concept ${x.slug} has unbalanced $$`);
    if (x.model !== undefined && !hasModel(x.model)) errs.push(`concept ${x.slug}: unknown model "${x.model}" (known: ${MODEL_IDS.join(", ")})`);
  }
  for (const l of c.lectures) {
    unique("lecture", l.id);
    topic(`lecture ${l.id}`, l.topic);
    for (const i of l.insights) if (i.conceptSlug && !slugs.has(i.conceptSlug)) errs.push(`lecture ${l.id} links unknown concept ${i.conceptSlug}`);
    errs.push(...validateLectureMedia(l));
  }
  for (const q of c.questions) {
    unique("question", q.id);
    topic(`question ${q.id}`, q.topic);
    if (!q.hints.length) errs.push(`question ${q.id} has no hints`);
    for (const s of q.concepts) if (!slugs.has(s)) errs.push(`question ${q.id} links unknown concept ${s}`);
    if (q.type === "mcq") {
      if (q.options.length < 3) errs.push(`question ${q.id} needs 3+ options`);
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errs.push(`question ${q.id} answer index out of range`);
      if (new Set(q.options).size !== q.options.length) errs.push(`question ${q.id} has duplicate options`);
      if (!q.options.every((o) => typeof o === "string" && o.trim())) errs.push(`question ${q.id} has an option that isn't text`);
    } else {
      if (!Number.isFinite(q.answer) || !(q.tolerance >= 0)) errs.push(`question ${q.id} needs a finite answer and tolerance`);
      if (!checkNumber(String(q.answer), q.answer, q.tolerance).ok) errs.push(`question ${q.id} rejects its own answer`);
    }
  }
  for (const lab of c.labs) {
    unique("lab", lab.id);
    topic(`lab ${lab.id}`, lab.topic);
    if (lab.safety.length < 2) errs.push(`lab ${lab.id} needs at least 2 safety notes`);
    if (lab.steps.length < 4) errs.push(`lab ${lab.id} needs at least 4 steps`);
    for (const d of lab.drills) {
      if (!checkNumber(String(d.answer), d.answer, d.tolerance).ok) errs.push(`lab ${lab.id} drill ${d.id} rejects its own answer`);
    }
  }
  for (const k of c.cases) {
    unique("case", k.id);
    topic(`case ${k.id}`, k.topic);
    if (!/simulation/i.test(k.setting)) errs.push(`case ${k.id} setting must say it is an educational simulation`);
    if (k.stages.length < 4) errs.push(`case ${k.id} needs at least 4 stages`);
    k.stages.forEach((s, i) => {
      const good = s.options.filter((o) => o.good).length;
      if (good === 0) errs.push(`case ${k.id} stage ${i + 1} has no good option`);
      if (s.mode === "single" && good !== 1) errs.push(`case ${k.id} stage ${i + 1} is single-choice but has ${good} good options`);
      if (s.options.length < 3) errs.push(`case ${k.id} stage ${i + 1} needs 3+ options`);
    });
    // No drug doses in cases: management stays at the level of principles.
    if (/\b\d+(\.\d+)?\s?(mg|mcg|µg|units?|IU|mL\/kg)\b(?!\/dL)/i.test(JSON.stringify(k.stages.map((s) => s.options.map((o) => o.text))))) {
      errs.push(`case ${k.id} option text looks like it contains a drug dose`);
    }
  }
  for (const s of c.skills) {
    unique("skill", s.id);
    if (s.items.length < 5) errs.push(`skill ${s.id} needs at least 5 items`);
  }
  return errs;
}


const isTime = (t: unknown) => typeof t === "number" && Number.isFinite(t) && t >= 0;

/** Recording fields of one lecture: an http(s) audio URL, timestamps ≥ 0, chapters in time order. */
export function validateLectureMedia(l: Lecture): string[] {
  const errs: string[] = [];
  if (l.audio !== undefined && !/^https?:\/\/\S+$/i.test(l.audio)) errs.push(`lecture ${l.id}: audio must be an http(s) URL`);
  l.insights.forEach((i, n) => {
    if (i.at !== undefined && !isTime(i.at)) errs.push(`lecture ${l.id} insight ${n + 1}: "at" must be a time in seconds (0 or more)`);
  });
  if (l.chapters !== undefined) {
    l.chapters.forEach((ch, n) => {
      if (!isTime(ch.at)) errs.push(`lecture ${l.id} chapter ${n + 1}: "at" must be a time in seconds (0 or more)`);
      if (!ch.title?.trim()) errs.push(`lecture ${l.id} chapter ${n + 1} has no title`);
      const prev = l.chapters![n - 1];
      if (prev && isTime(prev.at) && isTime(ch.at) && ch.at < prev.at) errs.push(`lecture ${l.id}: chapters must be in time order (chapter ${n + 1} starts before chapter ${n})`);
    });
  }
  return errs;
}

/** Cheap structural check for untrusted JSON before validateCourse reads nested fields. */
export function looksLikeCourse(x: unknown): x is Course {
  const c = x as Partial<Course>;
  return (
    typeof c === "object" && c !== null && typeof c.id === "string" && typeof c.title === "string" &&
    typeof c.code === "string" && Array.isArray(c.topics) &&
    (["concepts", "lectures", "questions", "labs", "cases", "skills"] as const).every((k) => Array.isArray(c[k]))
  );
}
