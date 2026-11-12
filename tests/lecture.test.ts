import { describe, expect, it } from "vitest";
import type { CompleteRequest, Writer } from "../src/engine/llm/types";
import { courseToFiles, lectureFileName, lectureMarkdown, parseCourseFiles } from "../site/src/med/coursefiles";
import { COURSES } from "../site/src/med/courses";
import { buildExtractionPrompt, chunkWindows, extractInsights, firstJsonBlock, mergeChapters, parseExtraction, unquotedDoses } from "../site/src/med/lecture/extract";
import { formatTime, parseTimestamp, parseTranscript, toWindows, transcriptRange } from "../site/src/med/lecture/transcript";
import type { Course } from "../site/src/med/types";
import { validateCourse, validateLectureMedia } from "../site/src/med/validate";

describe("timestamps", () => {
  it("parses VTT, SRT and short forms", () => {
    expect(parseTimestamp("00:00:01.500")).toBe(1.5);
    expect(parseTimestamp("01:02:03.004")).toBeCloseTo(3723.004);
    expect(parseTimestamp("00:00:01,250")).toBe(1.25);
    expect(parseTimestamp("02:03.4")).toBeCloseTo(123.4);
    expect(parseTimestamp("1:05")).toBe(65);
    expect(parseTimestamp("12:75")).toBeNaN();
    expect(parseTimestamp("nope")).toBeNaN();
  });
  it("formats m:ss and h:mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65.9)).toBe("1:05");
    expect(formatTime(3723)).toBe("1:02:03");
    expect(formatTime(NaN)).toBe("0:00");
  });
});

describe("parseTranscript", () => {
  it("reads WebVTT with header, notes, styles, cue ids, cue settings, tags and multi-line cues", () => {
    const vtt = [
      "﻿WEBVTT - Echo360 export",
      "Kind: captions",
      "",
      "NOTE generated automatically",
      "with two lines",
      "",
      "STYLE",
      "::cue { color: yellow }",
      "",
      "1",
      "00:00:01.000 --> 00:00:04.000 align:start position:10% line:90%",
      "<v Dr Smith>Today we look at</v>",
      "the <i>cardiac</i> cycle &amp; pressures.",
      "",
      "intro-2",
      "00:04.000 --> 00:07.500",
      "Preload is end-diastolic <00:05.000><c>stretch</c>.",
      "",
      "01:00:00.000 --> 01:00:03.000",
      "An hour in.",
      "",
    ].join("\r\n");
    const t = parseTranscript(vtt, "lecture.vtt");
    expect(t.format).toBe("vtt");
    expect(t.timed).toBe(true);
    expect(t.segments).toEqual([
      { start: 1, end: 4, text: "Today we look at the cardiac cycle & pressures." },
      { start: 4, end: 7.5, text: "Preload is end-diastolic stretch." },
      { start: 3600, end: 3603, text: "An hour in." },
    ]);
  });

  it("reads SRT (comma milliseconds, index lines, multi-line, hours) and sniffs it without an extension", () => {
    const srt = "1\n00:00:00,500 --> 00:00:02,000\nStroke volume is\nEDV minus ESV.\n\n2\n01:15:30,000 --> 01:15:32,250\n<b>Hour</b> mark\n";
    const t = parseTranscript(srt);
    expect(t.format).toBe("srt");
    expect(t.segments).toEqual([
      { start: 0.5, end: 2, text: "Stroke volume is EDV minus ESV." },
      { start: 4530, end: 4532.25, text: "Hour mark" },
    ]);
  });

  it("drops rolling-caption repeats", () => {
    const vtt = "WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nSame line\n\n00:00:02.000 --> 00:00:03.000\nSame line\n\n00:00:03.000 --> 00:00:04.000\nNext\n";
    expect(parseTranscript(vtt).segments.map((s) => s.text)).toEqual(["Same line", "Next"]);
  });

  it("reads plain text with leading timestamps", () => {
    const txt = "[0:00] Welcome everyone.\n[1:30] Frank-Starling law:\nmore stretch, more force.\n1:02:03 - Late point\n";
    const t = parseTranscript(txt, "notes.txt");
    expect(t.format).toBe("text");
    expect(t.timed).toBe(true);
    expect(t.segments.map((s) => [s.start, s.text])).toEqual([
      [0, "Welcome everyone."],
      [90, "Frank-Starling law: more stretch, more force."],
      [3723, "Late point"],
    ]);
    expect(t.segments[0]!.end).toBe(90);
  });

  it("estimates times for untimed text from speaking speed", () => {
    const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");
    const t = parseTranscript(`${words(25)}. ${words(50)}? Done!`);
    expect(t.timed).toBe(false);
    expect(t.segments).toHaveLength(3);
    expect(t.segments[0]).toMatchObject({ start: 0, end: 10 });
    expect(t.segments[1]).toMatchObject({ start: 10, end: 30 });
    expect(t.segments[2]!.text).toBe("Done!");
  });
});

describe("toWindows", () => {
  const segs = Array.from({ length: 40 }, (_, i) => ({ start: i * 10, end: i * 10 + 10, text: `s${i}` }));
  it("merges into ~90 s windows, never over 120 s", () => {
    const w = toWindows(segs);
    expect(w.length).toBeGreaterThan(3);
    for (const x of w) expect(x.end - x.start).toBeLessThanOrEqual(120);
    for (const x of w.slice(0, -1)) expect(x.end - x.start).toBeGreaterThanOrEqual(90);
    expect(w.map((x) => x.text).join(" ")).toBe(segs.map((s) => s.text).join(" "));
    expect(w[0]).toMatchObject({ start: 0, end: 90 });
  });
  it("keeps a single long segment whole and handles empty input", () => {
    expect(toWindows([{ start: 0, end: 500, text: "long" }])).toEqual([{ start: 0, end: 500, text: "long" }]);
    expect(toWindows([])).toEqual([]);
    expect(transcriptRange([])).toEqual({ start: 0, end: 0 });
    expect(transcriptRange(segs)).toEqual({ start: 0, end: 400 });
  });
  it("chunks windows by characters", () => {
    const w = Array.from({ length: 10 }, (_, i) => ({ start: i * 90, end: i * 90 + 90, text: "x".repeat(400) }));
    const parts = chunkWindows(w, 1000);
    expect(parts.length).toBeGreaterThan(3);
    expect(parts.flat()).toEqual(w);
  });
});

describe("extraction parsing", () => {
  const range = { start: 0, end: 600 };
  const transcript = "Give 300 mg aspirin chewed. Preload is the stretch on the ventricle.";

  it("finds the first JSON block in chatty output, think tags and code fences", () => {
    expect(firstJsonBlock('<think>{"no": 1}</think>Sure! ```json\n{"a": "}"}\n``` and {"b":2}')).toBe('{"a": "}"}');
    expect(firstJsonBlock("{ broken { \"ok\": true }")).toBe('{ "ok": true }');
    expect(firstJsonBlock("no json")).toBeNull();
  });

  it("validates, clamps, drops out-of-range and dedupes", () => {
    const raw = `Here you go:
{"insights":[
  {"type":"exam_tip","text":"Preload is end-diastolic stretch.","at":120},
  {"type":"Clinical link","text":"Raised JVP suggests high preload.","at":"10:30"},
  {"type":"intuition","text":"Edge case just past the end.","at":615},
  {"type":"intuition","text":"Way past the end.","at":5000},
  {"type":"exam_tip","text":"No timestamp."},
  {"type":"made_up","text":"Bad type.","at":5},
  {"type":"exam_tip","text":"preload is end diastolic stretch","at":130},
  {"type":"exam_tip","text":"Garbled bit about afterload.","at":-10,"uncertain":true}
],"chapters":[{"at":300,"title":"Afterload"},{"at":"0:00","title":"Preload"},{"at":305,"title":"Afterload again"},{"at":9999,"title":"Nope"}]}`;
    const r = parseExtraction(raw, range, transcript);
    expect(r.insights).toEqual([
      { type: "exam_tip", text: "Garbled bit about afterload. (Unsure: check the recording.)", at: 0 },
      { type: "exam_tip", text: "Preload is end-diastolic stretch.", at: 120 },
      { type: "clinical_link", text: "Raised JVP suggests high preload.", at: 600 },
      { type: "intuition", text: "Edge case just past the end.", at: 600 },
    ]);
    expect(r.chapters).toEqual([
      { at: 0, title: "Preload" },
      { at: 300, title: "Afterload" },
    ]);
    expect(r.problems.join(" ")).toMatch(/Skipped 3 points/);
  });

  it("drops drug doses the lecturer didn't say, keeps quoted ones", () => {
    expect(unquotedDoses("Give 300 mg aspirin", transcript)).toEqual([]);
    expect(unquotedDoses("Give 5 mg/kg of X", transcript)).toEqual(["5 mg/kg"]);
    const r = parseExtraction(
      '{"insights":[{"type":"clinical_link","text":"Aspirin 300mg chewed in ACS.","at":10},{"type":"clinical_link","text":"Then 75 mg daily.","at":20}]}',
      range,
      transcript,
    );
    expect(r.insights.map((i) => i.text)).toEqual(["Aspirin 300mg chewed in ACS."]);
    expect(r.problems[0]).toMatch(/dose/);
  });

  it("accepts a bare array and reports missing JSON", () => {
    expect(parseExtraction('[{"type":"intuition","text":"Think of a balloon.","at":3}]', range).insights).toHaveLength(1);
    expect(parseExtraction("I can't help with that.", range).problems[0]).toMatch(/no JSON/);
  });

  it("merges chapters that start within 10 s", () => {
    expect(mergeChapters([{ at: 5, title: "B" }, { at: 0, title: "A" }, { at: 100, title: "a" }])).toEqual([{ at: 0, title: "A" }]);
  });

  it("numbers transcript lines with their times", () => {
    const p = buildExtractionPrompt([{ start: 754, end: 800, text: "Hello" }], { title: "Cardiac", part: 2, parts: 3 });
    expect(p).toContain("[1 | 12:34] Hello");
    expect(p).toContain("Part 2 of 3");
  });

  it("maps cited line numbers (seg) to their start times and still accepts seconds", () => {
    const raw = JSON.stringify({ insights: [{ type: "exam_tip", text: "Right shift lowers affinity.", seg: 2 }, { type: "intuition", text: "Team binding.", at: "3:40" }, { type: "exam_tip", text: "Bad line.", seg: 9 }], chapters: [{ seg: 1, title: "Intro" }] });
    const r = parseExtraction(raw, { start: 0, end: 300 }, "", [5, 70, 150]);
    expect(r.insights.map((i) => i.at)).toEqual([70, 220]);
    expect(r.chapters).toEqual([{ at: 5, title: "Intro" }]);
  });
});

describe("extractInsights with a fake writer", () => {
  function fakeWriter(answers: (req: CompleteRequest, call: number) => string): Writer & { calls: CompleteRequest[] } {
    const calls: CompleteRequest[] = [];
    return {
      name: "fake",
      model: "fake-1",
      calls,
      async complete(req) {
        calls.push(req);
        const text = answers(req, calls.length);
        for (const ch of text.match(/.{1,16}/gs) ?? []) req.onText?.(ch);
        return { text, model: "fake-1", truncated: false };
      },
    };
  }

  it("runs part by part, streams progress and keeps each part's times inside its stretch", async () => {
    // 60 one-minute windows of ~500 characters → several parts.
    const segments = Array.from({ length: 60 }, (_, i) => ({ start: i * 60, end: i * 60 + 60, text: `minute ${i} ${"blah ".repeat(100)}` }));
    const w = fakeWriter((req, call) => {
      const first = Number(/\[\d+ \| (\d+):(\d{2})\]/.exec(req.user)!.slice(1).reduce((a, b) => a * 60 + Number(b), 0));
      return JSON.stringify({
        insights: [
          { type: "exam_tip", text: `Point from part ${call}`, at: first + 30 },
          { type: "intuition", text: `Out of this part ${call}`, at: first + 100000 },
          { type: "exam_tip", text: "Repeated in every part", at: first + 5 },
        ],
        chapters: [{ at: first, title: `Chapter ${call}` }],
      });
    });
    const progress: number[] = [];
    const r = await extractInsights(w, segments, { title: "Long lecture", onProgress: (p) => progress.push(p.part) });
    expect(w.calls.length).toBeGreaterThan(1);
    expect(w.calls.every((c) => c.json && c.system.includes("JSON"))).toBe(true);
    expect(new Set(progress).size).toBe(w.calls.length);
    expect(r.insights.filter((i) => i.text === "Repeated in every part")).toHaveLength(1);
    expect(r.insights.filter((i) => i.text.startsWith("Point from part"))).toHaveLength(w.calls.length);
    expect(r.insights.some((i) => i.text.startsWith("Out of"))).toBe(false);
    expect(r.chapters).toHaveLength(w.calls.length);
    for (const i of r.insights) expect(i.at).toBeGreaterThanOrEqual(0);
    for (const i of r.insights) expect(i.at).toBeLessThanOrEqual(3600);
  });

  it("rejects an empty transcript", async () => {
    await expect(extractInsights(fakeWriter(() => "{}"), [])).rejects.toThrow(/empty/);
  });
});

describe("course files with audio, chapters and timed insights", () => {
  const withMedia = (): Course => {
    const base = structuredClone(COURSES[0]!);
    const l = base.lectures[0]!;
    l.audio = "https://example.org/lecture-1.mp3";
    l.chapters = [
      { at: 0, title: "Intro" },
      { at: 95.5, title: "Second part with $x^2$" },
    ];
    l.insights = l.insights.map((i, n) => ({ ...i, at: n * 60 }));
    return base;
  };

  it("round-trips through courseToFiles → parseCourseFiles", () => {
    const c = withMedia();
    const files = courseToFiles(c);
    const lectureFile = Object.entries(files).find(([p]) => p.startsWith("lectures/") && p.includes(c.lectures[0]!.id.replace(/[^A-Za-z0-9._-]+/g, "-")))![1];
    expect(lectureFile).toMatch(/audio: https:\/\/example\.org\/lecture-1\.mp3/);
    expect(lectureFile).toMatch(/chapters:/);
    const { course, errors } = parseCourseFiles(files);
    expect(errors).toEqual([]);
    expect(course).toEqual(c);
  });

  it("writes a single lecture file that parses back, and accepts m:ss times", () => {
    const c = withMedia();
    const l = c.lectures[0]!;
    const files = courseToFiles(c);
    for (const p of Object.keys(files)) if (p.startsWith("lectures/") && files[p]!.includes(`title: ${l.title}`)) delete files[p];
    files[`lectures/${lectureFileName(l)}`] = lectureMarkdown(l, { withId: true });
    const { course, errors } = parseCourseFiles(files);
    expect(errors).toEqual([]);
    expect(course.lectures.find((x) => x.id === l.id)).toEqual(l);

    files[`lectures/${lectureFileName(l)}`] = lectureMarkdown(l, { withId: true }).replace("at: 95.5", 'at: "1:35.5"');
    expect(parseCourseFiles(files).course.lectures.find((x) => x.id === l.id)!.chapters![1]!.at).toBe(95.5);
  });

  it("reports bad times and unsorted chapters", () => {
    const c = withMedia();
    const l = c.lectures[0]!;
    l.chapters = [
      { at: 100, title: "Later" },
      { at: 50, title: "Earlier" },
      { at: -1, title: "" },
    ];
    l.insights[0]!.at = Number.POSITIVE_INFINITY;
    l.audio = "javascript:alert(1)";
    const errs = validateLectureMedia(l);
    expect(errs.join("\n")).toMatch(/audio must be an http\(s\) URL/);
    expect(errs.join("\n")).toMatch(/time order/);
    expect(errs.join("\n")).toMatch(/chapter 3: "at" must be/);
    expect(errs.join("\n")).toMatch(/chapter 3 has no title/);
    expect(errs.join("\n")).toMatch(/insight 1: "at" must be/);
    expect(validateCourse(c).some((e) => e.includes("time order"))).toBe(true);

    const files = courseToFiles(withMedia());
    const path = Object.keys(files).find((p) => p.startsWith("lectures/") && files[p]!.includes("chapters:"))!;
    files[path] = files[path]!.replace("at: 95.5", "at: soon");
    expect(parseCourseFiles(files).errors).toContain(`${path}: chapters[1]: at must be a number`);
  });
});
