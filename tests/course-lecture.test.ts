import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse as parseYaml } from "yaml";
import { buildLecture, nextLectureId, parseLectureArgs, type CourseInfo } from "../scripts/course-lecture";
import { parseCourseFiles } from "../site/src/med/coursefiles";
import type { CompleteRequest, CompleteResult, Writer } from "../src/engine/llm/types";

const ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(ROOT, "scripts", "course.ts");
const TSX = path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs");

const VTT = `WEBVTT

00:00:01.000 --> 00:00:05.000
<v Dr Lee>Today we look at synovial joints. They have a capsule and fluid. More detail follows.

00:00:05.000 --> 00:01:40.000
The synovial membrane makes the fluid. It lubricates the cartilage. This one is on the exam.

00:06:10.000 --> 00:06:20.000
Next, ligaments. Ligaments join bone to bone.
`;

function run(cwd: string, ...args: string[]): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync(process.execPath, [TSX, SCRIPT, ...args], { cwd, encoding: "utf8", stdio: "pipe", env: { ...process.env, NO_COLOR: "1" } });
    return { status: 0, stdout, stderr: "" };
  } catch (e) {
    const x = e as { status: number; stdout?: string; stderr?: string };
    return { status: x.status, stdout: String(x.stdout ?? ""), stderr: String(x.stderr ?? "") };
  }
}

const frontMatter = (text: string) => parseYaml(/^---\n([\s\S]*?)\n---/.exec(text)![1]!) as Record<string, unknown>;

class FakeWriter implements Writer {
  readonly name = "fake";
  readonly model = "fake-1";
  calls: CompleteRequest[] = [];
  constructor(private answer: string | Error) {}
  async complete(req: CompleteRequest): Promise<CompleteResult> {
    this.calls.push(req);
    if (this.answer instanceof Error) throw this.answer;
    req.onText?.(this.answer);
    return { text: this.answer, model: this.model, truncated: false };
  }
}

const COURSE: CourseInfo = { code: "BIOL113", topics: ["Joints", "Muscles"], lectures: [{ id: "biol113-l1", week: 1 }, { id: "biol113-l2", week: 2 }] };

describe("buildLecture", () => {
  it("adds writer insights and chapters, citing transcript lines", async () => {
    const writer = new FakeWriter(
      JSON.stringify({
        insights: [
          { type: "exam_tip", text: "The synovial membrane makes synovial fluid, which lubricates cartilage.", seg: 2 },
          { type: "intuition", text: "Ligaments tie bone to bone like straps.", seg: 3 },
        ],
        chapters: [{ seg: 1, title: "Synovial joints" }, { seg: 3, title: "Ligaments" }],
      }),
    );
    const progress: number[] = [];
    const { lecture, problems } = await buildLecture(VTT, "w3.vtt", COURSE, { title: "Week 3: Joints", topic: "Muscles" }, writer, (p) => progress.push(p.part));
    expect(writer.calls).toHaveLength(1);
    expect(writer.calls[0]!.user).toMatch(/Lecture: Week 3: Joints/);
    expect(progress.length).toBeGreaterThan(0);
    expect(problems).toEqual([]);
    expect(lecture).toMatchObject({ id: "biol113-l3", week: 3, title: "Week 3: Joints", topic: "Muscles" });
    expect(lecture.summary).toBe(lecture.insights[0]!.text);
    expect(lecture.insights.map((i) => i.type)).toEqual(["exam_tip", "intuition"]);
    expect(lecture.chapters!.map((c) => c.title)).toEqual(["Synovial joints", "Ligaments"]);
    expect(lecture.notes).toMatch(/^\*\*\[0:01\]\*\* Today we look at synovial joints\. They have a capsule and fluid\.$/m);
    expect(lecture.notes).not.toMatch(/More detail follows/);
  });

  it("passes writer errors through and rejects a bad topic or empty captions", async () => {
    await expect(buildLecture(VTT, "w3.vtt", COURSE, {}, new FakeWriter(new Error("Can't reach Ollama")))).rejects.toThrow(/Can't reach Ollama/);
    await expect(buildLecture(VTT, "w3.vtt", COURSE, { topic: "Nope" }, null)).rejects.toThrow(/Topic "Nope"/);
    await expect(buildLecture("WEBVTT\n\n", "w.vtt", COURSE, {}, null)).rejects.toThrow(/No caption text/);
  });

  it("without a writer: notes and heuristic chapters, defaults for week/topic/title", async () => {
    const { lecture } = await buildLecture(VTT, "w3.vtt", COURSE, {}, null);
    expect(lecture).toMatchObject({ id: "biol113-l3", week: 3, topic: "Joints", title: "Week 3 lecture", insights: [] });
    expect(lecture.chapters!.length).toBeGreaterThan(0);
    expect(lecture.audio).toBeUndefined();
  });

  it("next id skips taken ids and file names; args parse", () => {
    expect(nextLectureId({ ...COURSE, files: ["biol113-l3.md"] })).toBe("biol113-l4");
    const { args, errors } = parseLectureArgs(["BIOL113", "a.vtt", "--title", "Week 3", "--week=4", "--no-ai", "--writer", "gemini"]);
    expect(errors).toEqual([]);
    expect(args).toMatchObject({ code: "BIOL113", file: "a.vtt", title: "Week 3", week: 4, ai: false, writer: "gemini" });
    expect(parseLectureArgs(["X", "a.vtt", "--bogus"]).errors).toEqual(["Unknown option --bogus."]);
  });
});

describe("course lecture CLI", () => {
  it("writes a lecture from captions with --no-ai, then course:check passes; refuses overwrite, bad topic, missing course", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "med-forge-lecture-"));
    try {
      fs.writeFileSync(path.join(cwd, "w3.vtt"), VTT);
      expect(run(cwd, "new", "BIOL113", "Human Anatomy").status).toBe(0);
      expect(fs.readFileSync(path.join(cwd, "courses", "BIOL113", "README.md"), "utf8")).toMatch(/course:lecture/);

      const ok = run(cwd, "lecture", "BIOL113", "w3.vtt", "--title", "Week 3: Joints", "--topic", "Topic two", "--audio", "https://example.org/w3.mp3", "--no-ai");
      expect(ok.status).toBe(0);
      expect(ok.stdout).toMatch(/courses\/BIOL113\/lectures\/biol113-l3\.md/);
      expect(ok.stdout).toMatch(/course:check/);
      expect(ok.stdout).toMatch(/course:bundle/);

      const text = fs.readFileSync(path.join(cwd, "courses", "BIOL113", "lectures", "biol113-l3.md"), "utf8");
      const fm = frontMatter(text);
      expect(fm).toMatchObject({ week: 3, title: "Week 3: Joints", topic: "Topic two", audio: "https://example.org/w3.mp3", insights: [] });
      expect(fm.chapters).toEqual([{ at: 1, title: "Today we look at synovial joints" }, { at: 370, title: "Next, ligaments" }]);
      expect(text).toMatch(/\*\*\[6:10\]\*\* Next, ligaments\./);

      const check = run(cwd, "check");
      expect(check.status).toBe(0);
      expect(check.stdout).toMatch(/3 lectures/);
      const { course } = parseCourseFiles({ "course.json": fs.readFileSync(path.join(cwd, "courses", "BIOL113", "course.json"), "utf8"), "lectures/biol113-l3.md": text });
      expect(course.lectures[0]!.chapters).toHaveLength(2);

      const again = run(cwd, "lecture", "BIOL113", "w3.vtt", "--id", "biol113-l3", "--no-ai");
      expect(again.status).toBe(1);
      expect(again.stderr).toMatch(/already exists; not overwriting/);

      // Without --id it takes the next free number instead.
      expect(run(cwd, "lecture", "BIOL113", "w3.vtt", "--no-ai").stdout).toMatch(/biol113-l4\.md/);

      const badTopic = run(cwd, "lecture", "BIOL113", "w3.vtt", "--topic", "Nope", "--no-ai");
      expect(badTopic.status).toBe(1);
      expect(badTopic.stderr).toMatch(/Topic "Nope" isn't in course\.json/);

      const missing = run(cwd, "lecture", "CHEM9", "w3.vtt", "--no-ai");
      expect(missing.status).toBe(1);
      expect(missing.stderr).toMatch(/course:new -- CHEM9/);

      expect(run(cwd, "lecture", "BIOL113").status).toBe(2);
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  }, 90_000);
});

describe("course:lecture --id", () => {
  it("refuses an id an existing lecture already uses, even in a differently named file", async () => {
    const { checkOptions } = await import("../scripts/course-lecture");
    const course = { code: "BIOL105", topics: ["T"], lectures: [{ id: "biol105-l2", week: 2 }], files: ["week2.md"] };
    expect(checkOptions(course, { id: "biol105-l2" }).join(" ")).toMatch(/already exists/);
    expect(checkOptions(course, { id: "biol105-l9" })).toEqual([]);
  });
});
