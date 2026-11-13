import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lint } from "../src/engine/validator";
import { courseToFiles, parseCourseFiles, PACK_FORMAT } from "../site/src/med/coursefiles";
import { COURSES } from "../site/src/med/courses";
import { createCourseRegistry, PACKS_STORAGE_KEY } from "../site/src/med/packs";
import type { Course } from "../site/src/med/types";

const ROOT = path.resolve(__dirname, "..");
const EXAMPLE_DIR = path.join(ROOT, "courses.example", "MEDS101");
const SCRIPT = path.join(ROOT, "scripts", "course.ts");
// tsx's CLI run with this Node: same as `npx tsx`, without npx looking up the package from a temp cwd.
const TSX = path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs");

function readFolder(dir: string): Record<string, string> {
  const files: Record<string, string> = {};
  for (const rel of fs.readdirSync(dir, { recursive: true }) as string[]) {
    const p = path.join(dir, rel);
    if (fs.statSync(p).isFile()) files[rel.split(path.sep).join("/")] = fs.readFileSync(p, "utf8");
  }
  return files;
}

const example = (): Course => {
  const { course, errors } = parseCourseFiles(readFolder(EXAMPLE_DIR));
  expect(errors).toEqual([]);
  return course;
};

function memoryStorage() {
  const data = new Map<string, string>();
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), data };
}

describe("course folder files", () => {
  for (const c of COURSES) {
    it(`${c.title} round-trips through courseToFiles → parseCourseFiles`, () => {
      const { course, errors } = parseCourseFiles(courseToFiles(c));
      expect(errors).toEqual([]);
      expect(course).toEqual(c);
    });
  }

  it("courses.example/MEDS101 parses with zero errors and lints cleanly", () => {
    const c = example();
    expect(c.id).toBe("meds-101");
    expect(c.concepts).toHaveLength(4);
    expect(c.questions).toHaveLength(6);
    expect(new Set(c.questions.map((q) => q.type))).toEqual(new Set(["mcq", "numeric"]));
    expect(c.lectures).toHaveLength(2);
    for (const x of c.concepts) expect(lint(x.body).errorCount, x.slug).toBe(0);
    const ids = [...c.questions, ...c.lectures, ...c.labs, ...c.cases, ...c.skills].map((x) => x.id);
    for (const id of ids) expect(id.startsWith("meds101-"), id).toBe(true);
    const builtInIds = new Set(COURSES.flatMap((b) => [b.id, ...b.questions.map((q) => q.id)]));
    expect([c.id, ...ids].filter((id) => builtInIds.has(id))).toEqual([]);
  });

  it("names the file in errors", () => {
    const files = readFolder(EXAMPLE_DIR);
    files["questions/meds101-q2.md"] = files["questions/meds101-q2.md"]!.replace("answer: 300", "answer: lots");
    files["concepts/broken.md"] = "no front matter here";
    const { errors } = parseCourseFiles(files);
    expect(errors).toContain("questions/meds101-q2.md: answer must be a number");
    expect(errors.some((e) => e.startsWith("concepts/broken.md:"))).toBe(true);
  });

  it("reports content rules from validateCourse", () => {
    const files = readFolder(EXAMPLE_DIR);
    delete files["questions/meds101-q6.md"];
    expect(parseCourseFiles(files).errors).toContain("course: needs at least 6 questions");
  });

  it("ignores README.md and non-course files", () => {
    const files = { ...courseToFiles(example()), "README.md": "# notes", "concepts/README.md": "x", "notes.txt": "x", "img/a.png": "x" };
    expect(parseCourseFiles(files).errors).toEqual([]);
  });
});

describe("course registry (packs)", () => {
  const builtIn = COURSES;

  it("imports a wrapped pack and a bare course, and persists them", () => {
    const storage = memoryStorage();
    const reg = createCourseRegistry(storage, builtIn, []);
    const c = example();
    expect(reg.importJson(JSON.stringify({ format: PACK_FORMAT, version: 1, course: c })).course.id).toBe("meds-101");
    const bare = { ...c, id: "meds-101-bare" };
    reg.importJson(JSON.stringify(bare));
    expect(reg.all().filter((e) => e.source === "imported").map((e) => e.course.id)).toEqual(["meds-101", "meds-101-bare"]);
    expect(reg.find("meds-101-bare")).toEqual(bare);

    const again = createCourseRegistry(storage, builtIn, []);
    expect(again.find("meds-101")).toEqual(c);
    expect(JSON.parse(storage.data.get(PACKS_STORAGE_KEY)!)).toHaveLength(2);
  });

  it("lists built-in, local and imported courses with their source", () => {
    const local = { ...example(), id: "my-local" };
    const reg = createCourseRegistry(null, builtIn, [local]);
    reg.importJson(JSON.stringify(example()));
    expect(reg.all().map((e) => e.source)).toEqual([...builtIn.map(() => "built-in"), "local", "imported"]);
  });

  it("rejects id clashes with built-in and local courses, invalid JSON and invalid courses", () => {
    const reg = createCourseRegistry(memoryStorage(), builtIn, [{ ...example(), id: "my-local" }]);
    expect(() => reg.importJson(JSON.stringify(builtIn[0]))).toThrow(/built-in course already uses the id/);
    expect(() => reg.importJson(JSON.stringify({ ...example(), id: "my-local" }))).toThrow(/local course already uses/);
    expect(() => reg.importJson("{not json")).toThrow(/isn't valid JSON/);
    expect(() => reg.importJson(JSON.stringify({ hello: 1 }))).toThrow(/isn't a MedForge course/);
    expect(() => reg.importJson(JSON.stringify({ format: "other", course: example() }))).toThrow(/Unknown pack format/);
    expect(() => reg.importJson(JSON.stringify({ ...example(), questions: [] }))).toThrow(/needs at least 6 questions/);
    expect(reg.all().some((e) => e.source === "imported")).toBe(false);
  });

  it("replaces a previously imported course with the same id", () => {
    const reg = createCourseRegistry(memoryStorage(), builtIn, []);
    reg.importJson(JSON.stringify(example()));
    reg.importJson(JSON.stringify({ ...example(), title: "Updated title" }));
    const imported = reg.all().filter((e) => e.source === "imported");
    expect(imported).toHaveLength(1);
    expect(imported[0]!.course.title).toBe("Updated title");
  });

  it("removes imported courses only", () => {
    const storage = memoryStorage();
    const reg = createCourseRegistry(storage, builtIn, []);
    reg.importJson(JSON.stringify(example()));
    expect(reg.remove(builtIn[0]!.id)).toBe(false);
    expect(reg.find(builtIn[0]!.id)).toBeDefined();
    expect(reg.remove("meds-101")).toBe(true);
    expect(reg.find("meds-101")).toBeUndefined();
    expect(createCourseRegistry(storage, builtIn, []).find("meds-101")).toBeUndefined();
  });

  it("export → import round-trips", () => {
    const a = createCourseRegistry(null, builtIn, []);
    const text = a.exportJson(example());
    expect(JSON.parse(text)).toMatchObject({ format: PACK_FORMAT, version: 1 });
    const b = createCourseRegistry(memoryStorage(), builtIn, []);
    expect(b.importJson(text).course).toEqual(example());
  });

  it("works in memory when storage is blocked", () => {
    const blocked = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    const reg = createCourseRegistry(blocked, builtIn, []);
    expect(reg.all()).toHaveLength(builtIn.length);
    reg.importJson(JSON.stringify(example()));
    expect(reg.find("meds-101")).toBeDefined();
    expect(reg.remove("meds-101")).toBe(true);
  });

  it("ignores corrupt stored data", () => {
    const storage = memoryStorage();
    storage.setItem(PACKS_STORAGE_KEY, "{oops");
    expect(createCourseRegistry(storage, builtIn, []).all()).toHaveLength(builtIn.length);
  });
});

describe("scripts/course.ts CLI", () => {
  const run = (cwd: string, ...args: string[]) =>
    execFileSync(process.execPath, [TSX, SCRIPT, ...args], { cwd, encoding: "utf8", stdio: "pipe", env: { ...process.env, NO_COLOR: "1" } });

  it("help exits 0 with usage", () => {
    expect(run(ROOT, "help")).toMatch(/Usage: npx tsx scripts\/course\.ts/);
  });

  it("new then bundle writes site/src/med/local/<id>.json in the working directory", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "med-forge-course-"));
    try {
      expect(run(cwd, "new", "BIOL113", "Human Anatomy")).toMatch(/Created courses\/BIOL113/);
      const dir = path.join(cwd, "courses", "BIOL113");
      expect(fs.existsSync(path.join(dir, "README.md"))).toBe(true);
      expect(fs.readFileSync(path.join(dir, "README.md"), "utf8")).toMatch(/git-ignored/);
      expect(JSON.parse(fs.readFileSync(path.join(dir, "course.json"), "utf8"))).toMatchObject({ id: "biol-113", title: "Human Anatomy" });
      expect(() => run(cwd, "new", "BIOL113", "Again")).toThrow();

      expect(run(cwd, "bundle")).toMatch(/biol-113/);
      const out = JSON.parse(fs.readFileSync(path.join(cwd, "site", "src", "med", "local", "biol-113.json"), "utf8")) as Course;
      expect(out.title).toBe("Human Anatomy");
      expect(out.cases[0]!.setting).toMatch(/Educational simulation/);

      run(cwd, "pack", "BIOL113");
      const pack = JSON.parse(fs.readFileSync(path.join(cwd, "biol-113.med-forge-pack.json"), "utf8"));
      expect(pack).toMatchObject({ format: PACK_FORMAT, version: 1, course: { id: "biol-113" } });
      expect(createCourseRegistry(null, COURSES, []).importJson(JSON.stringify(pack)).course.id).toBe("biol-113");
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  }, 60_000);

  it("check fails with the file name when a folder is broken; unknown command exits 2", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "med-forge-course-"));
    try {
      run(cwd, "new", "CHEM2", "Chemistry");
      const q = path.join(cwd, "courses", "CHEM2", "questions", "chem2-q1.md");
      fs.writeFileSync(q, fs.readFileSync(q, "utf8").replace("answer: 0", "answer: first"));
      let stderr = "";
      try {
        run(cwd, "check");
      } catch (e) {
        stderr = String((e as { stderr?: string }).stderr);
        expect((e as { status?: number }).status).toBe(1);
      }
      expect(stderr).toMatch(/questions\/chem2-q1\.md: answer must be a number/);

      let status = 0;
      try {
        execFileSync(process.execPath, [TSX, SCRIPT, "nope"], { cwd, stdio: "pipe" });
      } catch (e) {
        status = (e as { status: number }).status;
      }
      expect(status).toBe(2);
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  }, 60_000);
});

describe("lecture recordings in the site's media folder", () => {
  it("accepts http(s) links and media/<file>, nothing else", async () => {
    const { isMediaUrl } = await import("../site/src/med/validate");
    expect(isMediaUrl("https://example.org/w3.mp3")).toBe(true);
    expect(isMediaUrl("media/biol105/week3.m4a")).toBe(true);
    expect(isMediaUrl("media/week3.mp4")).toBe(true);
    expect(isMediaUrl("media/../secret.mp3")).toBe(false);
    expect(isMediaUrl("/etc/passwd")).toBe(false);
    expect(isMediaUrl("javascript:alert(1)")).toBe(false);
    expect(isMediaUrl("media/notes.pdf")).toBe(false);
  });
});
