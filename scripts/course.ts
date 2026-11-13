/**
 * Course folders CLI (npx tsx scripts/course.ts <command>, or the npm run course:* scripts).
 * Course folders live in courses/<CODE>/ (git-ignored, private to your computer).
 */
import fs from "node:fs";
import path from "node:path";
import { courseToFiles, parseCourseFiles, wrapPack } from "../site/src/med/coursefiles";
import { COURSES } from "../site/src/med/courses";
import { createWriter } from "../src/engine/llm/select";
import { buildLecture, checkOptions, parseLectureArgs, readCourseInfo, writeLecture } from "./course-lecture";
import type { Course } from "../site/src/med/types";
import { loadLocalEnv } from "../src/engine/env";

loadLocalEnv();

const cwd = process.cwd();
const COURSES_DIR = path.resolve(cwd, "courses");
const LOCAL_DIR = path.resolve(cwd, "site", "src", "med", "local");
/** Committed: courses here are built into the deployed website for everyone. */
const PUBLISHED_DIR = path.resolve(cwd, "site", "src", "med", "published");

const USAGE = `MedForge course folders

Usage: npx tsx scripts/course.ts <command>   (or npm run course:<command> -- ...)

  new <CODE> "<Course title>"   Create courses/<CODE>/ with example files to replace
  bundle [CODE] [--publish]     Validate course folders and write site/src/med/local/<id>.json
                                (--publish: site/src/med/published/, committed, so it's on the website)
                                (the web app picks these up on the next dev/build)
  pack <CODE> [out.json]        Write one shareable pack file (default ./<id>.med-forge-pack.json)
                                to import in the app under Tools > Add or import a course
  check                         Validate every course folder without writing anything
  lecture <CODE> <captions>     Add lectures/<id>.md from a captions file you downloaded yourself
                                (.vtt, .srt or .txt from Echo360, Panopto, Kaltura…). Options:
                                  --title "Week 3: …"   --topic "<a course.json topic>"
                                  --week 3              --audio <https link to the recording>
                                  --id <lecture id>     --no-ai (notes and chapters only)
                                  --writer ollama|openrouter|gemini|openai   --model <id>
                                With AI (default: free local Ollama) it adds exam tips, clinical
                                links and chapters. It never logs in to or downloads from Echo360.
  help                          Show this help

Course folders stay on your computer: courses/ is git-ignored. Don't put university-owned
materials (slides, exam papers) in a pack you share unless you're allowed to.

Example:
  npm run course:new -- BIOL113 "Human Anatomy"
  npm run course:lecture -- BIOL113 ~/Downloads/week3.vtt --title "Week 3: Joints"
  npm run course:bundle`;

const fail = (msg: string, code = 1): never => {
  console.error(msg);
  process.exit(code);
};

/** "BIOL113" -> "biol-113"; "Chem 2A" -> "chem-2a". */
function slugFromCode(code: string): string {
  return code
    .replace(/([A-Za-z])(?=\d)/g, "$1-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "BIOL113" -> "BIOL 113". */
const displayCode = (code: string) => code.replace(/([A-Za-z])(?=\d)/, "$1 ").replace(/[_-]+/g, " ").trim();

function readFolder(dir: string): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (sub: string) => {
    for (const entry of fs.readdirSync(path.join(dir, sub), { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const rel = sub ? `${sub}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(rel);
      else if (entry.isFile()) files[rel] = fs.readFileSync(path.join(dir, rel), "utf8");
    }
  };
  walk("");
  return files;
}

function writeFiles(dir: string, files: Record<string, string>) {
  for (const [rel, text] of Object.entries(files)) {
    const file = path.join(dir, ...rel.split("/"));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
}

function courseFolders(only?: string): string[] {
  if (!fs.existsSync(COURSES_DIR)) {
    fail(`No courses/ folder in ${cwd}.\nCreate your first course with:\n  npm run course:new -- BIOL113 "Human Anatomy"`);
  }
  const all = fs
    .readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
  if (only) {
    const match = all.find((n) => n === only) ?? all.find((n) => n.toLowerCase() === only.toLowerCase());
    if (!match) fail(`No course folder courses/${only}/. Existing: ${all.join(", ") || "(none)"}`);
    return [match!];
  }
  if (!all.length) fail(`courses/ is empty. Create a course with:\n  npm run course:new -- BIOL113 "Human Anatomy"`);
  return all;
}

/** Parse and validate folders; print problems per file. Returns the courses, or exits 1. */
function loadCourses(only?: string): { folder: string; course: Course }[] {
  const out: { folder: string; course: Course }[] = [];
  let bad = 0;
  const builtIn = new Set(COURSES.map((c) => c.id));
  const seen = new Map<string, string>();
  for (const folder of courseFolders(only)) {
    const { course, errors } = parseCourseFiles(readFolder(path.join(COURSES_DIR, folder)));
    if (course.id && builtIn.has(course.id)) errors.push(`course.json: id "${course.id}" is already used by a built-in course`);
    const other = seen.get(course.id);
    if (course.id && other) errors.push(`course.json: id "${course.id}" is also used by courses/${other}/`);
    seen.set(course.id, folder);
    if (errors.length) {
      bad++;
      console.error(`\n✗ courses/${folder}/ has ${errors.length} problem${errors.length === 1 ? "" : "s"}:`);
      for (const e of errors) console.error(`  - ${e}`);
    } else out.push({ folder, course });
  }
  if (bad) fail(`\n${bad} course folder${bad === 1 ? "" : "s"} need${bad === 1 ? "s" : ""} fixing (file paths are relative to courses/<CODE>/).`);
  return out;
}

const summary = (c: Course) =>
  `${c.code} · ${c.title} (${c.id}): ${c.concepts.length} concepts, ${c.questions.length} questions, ${c.lectures.length} lectures, ${c.labs.length} lab${c.labs.length === 1 ? "" : "s"}, ${c.cases.length} case${c.cases.length === 1 ? "" : "s"}, ${c.skills.length} skill${c.skills.length === 1 ? "" : "s"}`;

// ---------------------------------------------------------------- scaffold

function scaffold(id: string, code: string, title: string): Course {
  const p = id.replace(/-/g, ""); // id prefix, e.g. "biol113-"
  const topics = ["Topic one", "Topic two"];
  const concepts = [1, 2, 3, 4].map((n) => ({
    slug: `example-concept-${n}`,
    title: `Example concept ${n} (replace me)`,
    topic: topics[n <= 2 ? 0 : 1]!,
    summary: "One or two sentences that sum up the idea, shown on cards and the revision sheet.",
    ...(n === 1 ? { formulas: ["C_1 V_1 = C_2 V_2"] } : {}),
    body:
      n === 1
        ? `Write your notes here in plain text. You can use **bold**, "- " bullets, "1. " steps and "> " callouts.

Inline maths goes between single dollar signs, like $C_1 V_1 = C_2 V_2$, and display maths between double ones:

$$ C_1 V_1 = C_2 V_2 $$

Delete these example files once you've written your own.`
        : `Placeholder notes for example concept ${n}. Replace with your own summary of the lecture material.`,
    pearls: ["A short fact that links this concept to patients or the lab (placeholder)."],
  }));
  const mcq = (n: number, topic: string, concept: string) => ({
    id: `${p}-q${n}`,
    type: "mcq" as const,
    topic,
    difficulty: 1 as const,
    concepts: [concept],
    prompt: `Example multiple-choice question ${n}: which option is correct? (replace me)`,
    options: ["The correct answer", "A plausible wrong answer", "Another wrong answer", "A common misconception"],
    answer: 0,
    hints: ["A first nudge that doesn't give the answer away.", "A stronger hint."],
    explanation: "Explain why the right answer is right and why the others are wrong.",
  });
  const numeric = (n: number, topic: string, concept: string) => ({
    id: `${p}-q${n}`,
    type: "numeric" as const,
    topic,
    difficulty: 2 as const,
    concepts: [concept],
    prompt: `Example numeric question ${n}: a 10 mL sample at 2 mol/L is diluted to 40 mL. What is the new concentration? (replace me)`,
    answer: 0.5,
    tolerance: 0.01,
    unit: "mol/L",
    hints: ["Use $C_1 V_1 = C_2 V_2$.", "Solve for $C_2$."],
    explanation: "$C_2 = C_1 V_1 / V_2 = 2 \\times 10 / 40 = 0.5$ mol/L.",
  });
  return {
    id,
    code,
    title,
    description: `My notes and practice for ${code} (replace this description).`,
    topics,
    concepts,
    questions: [
      mcq(1, topics[0]!, "example-concept-1"),
      numeric(2, topics[0]!, "example-concept-1"),
      mcq(3, topics[0]!, "example-concept-2"),
      numeric(4, topics[1]!, "example-concept-3"),
      mcq(5, topics[1]!, "example-concept-3"),
      mcq(6, topics[1]!, "example-concept-4"),
    ],
    lectures: [1, 2].map((n) => ({
      id: `${p}-l${n}`,
      week: n,
      title: `Week ${n} lecture (replace me)`,
      topic: topics[n - 1]!,
      summary: "What this lecture covered, in a sentence.",
      notes: "- Key point from the lecture, in your own words\n- Another key point",
      insights: [
        { type: "exam_tip" as const, text: "Something the lecturer said will be examined (placeholder).", conceptSlug: `example-concept-${n * 2 - 1}` },
        { type: "intuition" as const, text: "A way of picturing the idea that made it click (placeholder)." },
      ],
    })),
    labs: [
      {
        id: `${p}-lab-1`,
        title: "Example lab (replace me)",
        topic: topics[0]!,
        objective: "What the practical sets out to measure or show.",
        safety: ["Wear a lab coat, gloves and eye protection as your lab manual requires.", "Follow your lab's instructions for disposing of waste and cleaning spills."],
        materials: ["Item one", "Item two"],
        steps: [
          { text: "First step of the method.", why: "Why this step matters (optional)." },
          { text: "Second step." },
          { text: "Third step." },
          { text: "Record your results." },
        ],
        drills: [{ id: "d1", prompt: "Example calculation from the lab data: 10 mL at 2 mol/L made up to 40 mL. New concentration?", answer: 0.5, tolerance: 0.01, unit: "mol/L", working: "2 × 10 / 40 = 0.5 mol/L." }],
        resultsGuide: "What results to expect and how to interpret them.",
      },
    ],
    cases: [
      {
        id: `${p}-case-1`,
        title: "Example clinical case (replace me)",
        topic: topics[1]!,
        setting: "Clinic. Educational simulation with a fictional patient.",
        presentation: "A fictional patient presents with a symptom. Describe what the student sees first.",
        stages: ["History", "Examination", "Tests", "Diagnosis"].map((stage, i) => ({
          title: stage,
          prompt: i < 3 ? `Choose the most useful ${stage.toLowerCase()} steps.` : "What is the most likely diagnosis?",
          mode: (i < 3 ? "multi" : "single") as "multi" | "single",
          options: [
            { text: "A good choice (placeholder)", good: true, feedback: "What the patient says, or the result, or why it's right." },
            { text: "A less useful choice (placeholder)", good: false, feedback: "Why it doesn't help here." },
            { text: "Another less useful choice (placeholder)", good: false, feedback: "Why it doesn't help here." },
          ],
          debrief: "What the student should take away from this stage.",
        })),
        teachingPoints: ["The main lesson of the case (placeholder)."],
      },
    ],
    skills: [
      {
        id: `${p}-skill-1`,
        title: "Example skill checklist (replace me)",
        purpose: "Why this practical skill matters, in one line.",
        items: [
          { text: "Introduces self and confirms the patient's identity", critical: true },
          { text: "Explains the procedure and gains consent", critical: true },
          { text: "Step three of the skill" },
          { text: "Step four of the skill" },
          { text: "Thanks the patient and documents the result" },
        ],
      },
    ],
  };
}

const README = (code: string, id: string) => `# ${code} course folder

This folder is a MedForge course. It stays on your computer: \`courses/\` is git-ignored,
so nothing here is committed or published. To use it in the web app run
\`npm run course:bundle\`; to share it, run \`npm run course:pack -- ${code}\` and send the
.json pack file (classmates import it under Tools > Add or import a course).

Don't put university-owned materials (lecture slides, exam papers, lab manuals) into a pack
you share unless you're allowed to. Write notes and questions in your own words.

## Files

- \`course.json\` — id ("${id}"), code, title, description, topics (in teaching order).
- \`concepts/<slug>.md\` — YAML front matter (title, topic, summary, formulas (optional list of
  LaTeX), model (optional id of an interactive 3D model, e.g. dna, bilayer, alpha-helix, enzyme,
  haemoglobin, bacterium, cell; the full list is in site/src/med/model3d/models.ts), pearls
  (list)); the text after the front matter is the concept body.
- \`questions/<id>.md\` — front matter: type (mcq | numeric), topic, difficulty (1–3),
  concepts (list of concept slugs); mcq: options (list) and answer (index, 0 = first);
  numeric: answer, tolerance, unit. Body: the prompt, then a line \`<!-- split:hints -->\`
  followed by a "- " list of hints, then \`<!-- split:explanation -->\` and the explanation.
- \`lectures/<id>.md\` — front matter: week, title, topic, summary, insights (list of
  {type: exam_tip | clinical_link | intuition, text, concept (optional slug)}). Body = notes.
- \`labs/<id>.yaml\`, \`cases/<id>.yaml\`, \`skills/<id>.yaml\` — the lab, clinical case and
  skill checklist as YAML (see the examples).

The file name is the id (or slug) unless the front matter sets \`id\`. Items are listed in
file-name order; add \`order: 1\`, \`order: 2\`… to any item to choose the order yourself.
Every topic must be listed in course.json. Start ids with "${id.replace(/-/g, "")}-" so
they never clash with other courses (progress is saved by question id).

## Lectures from Echo360 (or Panopto, Kaltura…) captions

Download the captions or transcript yourself from the lecture page (.vtt, .srt or .txt;
MedForge never logs in to Echo360), then run:

    npm run course:lecture -- ${code} ~/Downloads/captions.vtt --title "Week 3: …"

It writes \`lectures/<id>.md\` with timestamped notes, chapters and AI insights (free local
Ollama by default; \`--writer openrouter|gemini|openai\` uses your key, \`--no-ai\` skips AI).
Add \`--audio <https link>\` if you have a direct link to the recording, \`--topic\` and
\`--week\` to file it. Edit the notes in your own words before sharing a pack.

Rules checked by \`npm run course:check\`: at least 4 concepts, 6 questions, 2 lectures, a
lab, a clinical case (4+ stages, its setting must say "Educational simulation", no drug
doses) and a skill checklist (5+ items); every concept needs a pearl, every question a hint.
`;

// ---------------------------------------------------------------- commands

function cmdNew(code?: string, title?: string) {
  if (!code || !title) fail(`Usage: npm run course:new -- <CODE> "<Course title>"\nExample: npm run course:new -- BIOL113 "Human Anatomy"`, 2);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(code!)) fail(`Course code "${code}" should be letters, digits, - or _ (e.g. BIOL113).`, 2);
  const dir = path.join(COURSES_DIR, code!);
  if (fs.existsSync(dir)) fail(`courses/${code}/ already exists; not overwriting it.`);
  const id = slugFromCode(code!);
  const course = scaffold(id, displayCode(code!), title!.trim());
  writeFiles(dir, { ...courseToFiles(course), "README.md": README(code!, id) });
  console.log(`Created courses/${code}/ (course id "${id}").
Replace the example files with your own notes, then run:
  npm run course:check     # find problems
  npm run course:bundle    # add it to the web app
This folder is git-ignored: it stays on your computer.`);
}

function cmdBundle(args: string[]) {
  const publish = args.includes("--publish");
  const only = args.find((a) => !a.startsWith("--"));
  const loaded = loadCourses(only);
  const dir = publish ? PUBLISHED_DIR : LOCAL_DIR;
  fs.mkdirSync(dir, { recursive: true });
  for (const { folder, course } of loaded) {
    const out = path.join(dir, `${course.id}.json`);
    fs.writeFileSync(out, JSON.stringify(course, null, 2) + "\n");
    console.log(`✓ courses/${folder}/ → ${path.relative(cwd, out)}  ${summary(course)}`);
  }
  console.log(`\nBundled ${loaded.length} course${loaded.length === 1 ? "" : "s"}. Restart or reload the dev server to see ${loaded.length === 1 ? "it" : "them"}.`);
  if (publish) {
    console.log(`These files are committed: push them and GitHub Pages puts ${loaded.length === 1 ? "the course" : "the courses"} on the website for everyone.
Only publish material you wrote yourself or are allowed to share (no university slides, papers or recordings).`);
  }
}

function cmdPack(code?: string, outArg?: string) {
  if (!code) fail("Usage: npm run course:pack -- <CODE> [out.json]", 2);
  const [{ folder, course }] = loadCourses(code) as [{ folder: string; course: Course }];
  const out = path.resolve(cwd, outArg ?? `${course.id}.med-forge-pack.json`);
  fs.writeFileSync(out, JSON.stringify(wrapPack(course), null, 2) + "\n");
  console.log(`✓ courses/${folder}/ → ${path.relative(cwd, out) || out}  ${summary(course)}
Import it in the app under Tools > Add or import a course. Only share material you're allowed to share.`);
}

function cmdCheck() {
  const loaded = loadCourses();
  for (const { folder, course } of loaded) console.log(`✓ courses/${folder}/  ${summary(course)}`);
  console.log(`\nAll ${loaded.length} course folder${loaded.length === 1 ? "" : "s"} OK.`);
}

async function cmdLecture(argv: string[]) {
  const usage = `Usage: npm run course:lecture -- <CODE> <captions.vtt|.srt|.txt> [--title "…"] [--topic "…"] [--week N] [--audio <https url>] [--id <id>] [--no-ai] [--writer ollama|openrouter|gemini|openai] [--model <id>]`;
  const { args, errors } = parseLectureArgs(argv);
  if (errors.length) fail(`${errors.join("\n")}\n${usage}`, 2);
  if (!args.code || !args.file) fail(usage, 2);
  const dir = path.join(COURSES_DIR, args.code!);
  if (!fs.existsSync(path.join(dir, "course.json"))) {
    fail(`No course folder courses/${args.code}/ with a course.json in ${cwd}.\nCreate it first with:\n  npm run course:new -- ${args.code} "<Course title>"`);
  }
  const file = path.resolve(cwd, args.file!);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`Can't find the captions file ${args.file}.`);

  let course;
  try {
    course = readCourseInfo(dir, args.code!);
  } catch (e) {
    fail(`courses/${args.code}/course.json can't be read: ${(e as Error).message}`);
  }
  const bad = checkOptions(course!, args);
  if (bad.length) fail(bad.join("\n"));

  let writer = null;
  if (args.ai) {
    try {
      writer = createWriter(args.writer, process.env, args.model);
    } catch (e) {
      fail(`${(e as Error).message}\nOr run with --no-ai to write the lecture with notes and chapters only.`);
    }
    console.error(`Finding insights with ${writer!.name} (${writer!.model})…`);
  }
  const tty = process.stderr.isTTY;
  let lastPart = 0;
  const onProgress = (p: { part: number; parts: number; chars: number }) => {
    if (tty) process.stderr.write(`\r  part ${p.part}/${p.parts}: ${p.chars} characters received   `);
    else if (p.part !== lastPart) console.error(`  part ${p.part}/${p.parts}…`);
    lastPart = p.part;
  };

  let result;
  try {
    result = await buildLecture(fs.readFileSync(file, "utf8"), path.basename(file), course!, args, writer, onProgress);
  } catch (e) {
    if (tty && writer) process.stderr.write("\n");
    const msg = (e as Error).message;
    fail(writer ? `The writer failed: ${msg}\nFix that, pick another with --writer, or run with --no-ai for notes and chapters only.` : msg);
  }
  if (tty && writer) process.stderr.write("\n");
  for (const p of result!.problems) console.error(`  note: ${p}`);

  const { lecture } = result!;
  let out = "";
  try {
    out = writeLecture(dir, lecture);
  } catch (e) {
    fail((e as Error).message);
  }
  console.log(`✓ ${path.relative(cwd, out)}  week ${lecture.week} · ${lecture.topic} · ${lecture.chapters?.length ?? 0} chapters, ${lecture.insights.length} insights${writer ? "" : " (no AI)"}
Read it through and put the notes in your own words, then run:
  npm run course:check     # find problems
  npm run course:bundle    # add it to the web app`);
}

const [command, ...args] = process.argv.slice(2);
switch (command) {
  case "new":
    cmdNew(args[0], args[1]);
    break;
  case "bundle":
    cmdBundle(args);
    break;
  case "pack":
    cmdPack(args[0], args[1]);
    break;
  case "check":
    cmdCheck();
    break;
  case "lecture":
    await cmdLecture(args);
    break;
  case undefined:
  case "help":
  case "--help":
  case "-h":
    console.log(USAGE);
    break;
  default:
    console.error(`Unknown command "${command}".\n`);
    fail(USAGE, 2);
}
