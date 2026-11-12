import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { loadSettings, makeWriter, writerLabel } from "../../settings";
import { lectureFileName, lectureMarkdown } from "../coursefiles";
import { extractInsights, type ExtractProgress } from "../lecture/extract";
import { LecturePlayer } from "../lecture/LecturePlayer";
import { formatTime, parseTranscript } from "../lecture/transcript";
import type { CourseRegistry } from "../packs";
import type { Course, Lecture, LectureChapter, LectureInsight } from "../types";
import { Crumbs, Notice, courseHref } from "../ui";
import "../lecture/lecture.css";

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "lecture";

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Every id a course uses, so a new lecture id never clashes (validateCourse wants them unique). */
const courseIds = (c: Course) => new Set([...c.concepts.map((x) => x.slug), ...[...c.lectures, ...c.questions, ...c.labs, ...c.cases, ...c.skills].map((x) => x.id)]);

function uniqueId(base: string, taken: Set<string>) {
  let id = base;
  for (let k = 2; taken.has(id); k++) id = `${base}-${k}`;
  return id;
}

const isHttpUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

/**
 * #/lecture-import: turn a lecture recording and its captions into timed insights, review them in
 * the player, then save the lecture into one of your imported courses or download its file.
 * Pass `registry` and `refresh` (from App) to enable saving into a course; without them only the
 * download is offered.
 */
export function LectureImportPage({ registry, refresh }: { registry?: CourseRegistry; refresh?: () => void } = {}) {
  const [audioUrl, setAudioUrl] = useState("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptName, setTranscriptName] = useState("");
  const [title, setTitle] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<ExtractProgress | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [insights, setInsights] = useState<LectureInsight[]>([]);
  const [chapters, setChapters] = useState<LectureChapter[]>([]);
  const [found, setFound] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const [week, setWeek] = useState("1");
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [courseId, setCourseId] = useState("");
  const [saved, setSaved] = useState<{ ok: boolean; text: string; href?: string } | null>(null);

  const transcript = useMemo(() => (transcriptText.trim() ? parseTranscript(transcriptText, transcriptName) : null), [transcriptText, transcriptName]);
  const settings = loadSettings();
  const urlOk = !audioUrl.trim() || isHttpUrl(audioUrl);
  const imported = registry?.all().filter((e) => e.source === "imported").map((e) => e.course) ?? [];
  const target = imported.find((c) => c.id === courseId);

  async function onTranscriptFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setTranscriptName(file.name);
    setTranscriptText(await file.text());
    if (!title) setTitle(file.name.replace(/\.(vtt|srt|txt)$/i, "").replace(/[_-]+/g, " ").trim());
  }

  async function run() {
    if (!transcript?.segments.length) return;
    const ctrl = new AbortController();
    abort.current = ctrl;
    setRunning(true);
    setRunError(null);
    setProblems([]);
    setProgress(null);
    try {
      const writer = await makeWriter(loadSettings());
      const r = await extractInsights(writer, transcript.segments, { ...(title.trim() ? { title: title.trim() } : {}), signal: ctrl.signal, onProgress: setProgress });
      setInsights(r.insights);
      setChapters(r.chapters);
      setProblems(r.problems);
      setFound(true);
      if (!summary && r.chapters.length) setSummary(`Covers ${r.chapters.slice(0, 4).map((c) => c.title).join(", ")}${r.chapters.length > 4 ? " and more" : ""}.`);
    } catch (e) {
      setRunError(ctrl.signal.aborted ? "Stopped." : (e as Error).message);
    } finally {
      setRunning(false);
      abort.current = null;
    }
  }

  function buildLecture(course?: Course): Lecture {
    const base = `lec-${slug(title || "lecture")}`;
    const lecture: Lecture = {
      id: course ? uniqueId(base, courseIds(course)) : base,
      week: Number.isFinite(Number(week)) && week.trim() !== "" ? Number(week) : 1,
      title: title.trim() || "Untitled lecture",
      topic: ((course ? topic || course.topics[0] : topic) ?? "").trim() || "General",
      summary: summary.trim() || `Lecture recording with ${insights.length} timed point${insights.length === 1 ? "" : "s"}.`,
      notes: notes.trim(),
      insights,
    };
    if (isHttpUrl(audioUrl)) lecture.audio = audioUrl.trim();
    if (chapters.length) lecture.chapters = chapters;
    return lecture;
  }

  function saveToCourse() {
    if (!registry || !target) return;
    const lecture = buildLecture(target);
    try {
      registry.importJson(JSON.stringify({ ...target, lectures: [...target.lectures, lecture] }));
      refresh?.();
      setSaved({
        ok: true,
        text: `Saved “${lecture.title}” to ${target.title}.${localFile && !lecture.audio ? " Your local recording isn't stored in the course; on the lecture, use “Add a recording” to pick the file again." : ""}`,
        href: `${courseHref(target, "lectures")}?l=${encodeURIComponent(lecture.id)}`,
      });
    } catch (e) {
      setSaved({ ok: false, text: `Couldn't save: ${(e as Error).message}` });
    }
  }

  const fileLecture = buildLecture();

  return (
    <main className="shell narrow lecture-import">
      <Crumbs here="Lecture recording to insights" />
      <h1>Lecture recording to insights</h1>
      <p className="lede">
        Load a lecture's captions, let the AI pick out the exam-relevant points with timestamps, check them against the
        recording, then keep them as a lecture with synced notes.
      </p>

      <Notice>
        <p>
          <strong>About Echo360 and other lecture-capture sites:</strong> their pages need your university login, and
          StudyForge never logs in anywhere. In Echo360, open the recording and download the captions or transcript
          (.vtt, .srt or .txt), and the audio or video too if your course allows it. A direct media link works only if
          it plays without signing in.
        </p>
      </Notice>

      <section className="panel">
        <h2>1. Recording (optional)</h2>
        <label className="field">
          <span>Audio or video link</span>
          <input type="url" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://…/lecture-05.mp3" aria-invalid={!urlOk} />
        </label>
        {!urlOk && <p className="lp-error">Use a full http(s) link.</p>}
        <p className="hint">Or choose a file in the player below. Files are played on this device and never uploaded.</p>
      </section>

      <section className="panel">
        <h2>2. Transcript</h2>
        <label className="lp-file">
          <span className="secondary small button-like">Load captions (.vtt, .srt, .txt)</span>
          <input type="file" accept=".vtt,.srt,.txt,text/vtt,text/plain,application/x-subrip" onChange={onTranscriptFile} />
        </label>
        <label className="field">
          <span>…or paste the transcript</span>
          <textarea
            rows={6}
            value={transcriptText}
            onChange={(e) => {
              setTranscriptText(e.target.value);
              setTranscriptName("");
            }}
            placeholder={"WEBVTT\n\n00:00:05.000 --> 00:00:09.000\nToday we're looking at the cardiac cycle…"}
          />
        </label>
        {transcript && (
          <p className="hint" aria-live="polite">
            {transcript.segments.length
              ? `${transcript.format.toUpperCase()} · ${transcript.segments.length} lines · about ${formatTime(transcript.segments[transcript.segments.length - 1]!.end)} long.`
              : "No text found in that transcript."}
            {transcript.segments.length > 0 && !transcript.timed && " It has no timestamps, so times are estimated from speaking speed and will only roughly match the recording."}
          </p>
        )}
        <label className="field">
          <span>Lecture title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 5: Cardiac cycle" />
        </label>
        <div className="li-run">
          <button type="button" onClick={run} disabled={running || !transcript?.segments.length}>
            {running ? "Finding insights…" : found ? "Find insights again" : "Find insights"}
          </button>
          {running && (
            <button type="button" className="secondary" onClick={() => abort.current?.abort()}>
              Stop
            </button>
          )}
          <span className="hint">Writer: {writerLabel(settings)} (change it in Settings)</span>
        </div>
        {found && !running && insights.length > 0 && <p className="hint">Running it again replaces the points below, including your edits.</p>}
        {running && progress && (
          <div className="li-progress" aria-live="polite">
            <p className="hint">
              {progress.parts > 1 ? `Part ${progress.part} of ${progress.parts}: ` : ""}
              {progress.chars ? `${progress.chars.toLocaleString()} characters received…` : "waiting for the writer…"}
            </p>
            {progress.tail && <pre className="li-tail">{progress.tail}</pre>}
          </div>
        )}
        {runError && (
          <p className="lp-error" role="alert">
            {runError}
          </p>
        )}
        {problems.length > 0 && (
          <ul className="li-problems">
            {problems.map((p, i) => (
              <li key={i} className="hint">
                {p}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>3. Review against the recording</h2>
        <p className="hint">
          AI output can be wrong. Play each point from its timestamp and fix or delete anything the lecturer didn't say.
          Points marked “Unsure” came from unclear captions.
        </p>
        <LecturePlayer
          {...(isHttpUrl(audioUrl) ? { src: audioUrl.trim() } : {})}
          storageKey={`import/${slug(title || transcriptName || "lecture")}`}
          title={title || "Imported lecture"}
          chapters={chapters}
          insights={insights}
          onInsightsChange={setInsights}
          onChaptersChange={setChapters}
          onLocalFile={setLocalFile}
        />
      </section>

      <section className="panel">
        <h2>4. Keep it</h2>
        <div className="li-meta">
          <label className="field">
            <span>Week</span>
            <input type="number" min={0} value={week} onChange={(e) => setWeek(e.target.value)} />
          </label>
          <label className="field">
            <span>Topic</span>
            {target ? (
              <select value={topic || target.topics[0]} onChange={(e) => setTopic(e.target.value)}>
                {target.topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            ) : (
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Must match a topic in course.json" />
            )}
          </label>
        </div>
        <label className="field">
          <span>Summary</span>
          <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One sentence for the lecture list" />
        </label>
        <label className="field">
          <span>Notes (optional)</span>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Your own notes. Supports $math$ and - bullets." />
        </label>
        {localFile && !isHttpUrl(audioUrl) && (
          <p className="hint">The local file ({localFile.name}) can't be stored with the lecture. Open the lecture later and use “Add a recording” to play it again.</p>
        )}

        {registry && (
          <div className="li-save">
            <h3>Save into one of your courses</h3>
            {imported.length ? (
              <div className="li-run">
                <label className="field">
                  <span>Course</span>
                  <select
                    value={courseId}
                    onChange={(e) => {
                      setCourseId(e.target.value);
                      setTopic("");
                    }}
                  >
                    <option value="">Choose a course…</option>
                    {imported.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} · {c.title}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={saveToCourse} disabled={!target || !title.trim()}>
                  Save as lecture
                </button>
              </div>
            ) : (
              <p className="hint">
                Only courses you imported in this browser can be changed here. <a href="#/courses">Import a course pack</a>, or
                download the file below.
              </p>
            )}
            {saved && (
              <p className={saved.ok ? "li-ok" : "lp-error"} role="status">
                {saved.text} {saved.href && <a href={saved.href}>Open the lecture</a>}
              </p>
            )}
          </div>
        )}

        <div className="li-save">
          <h3>Download for a course folder</h3>
          <p className="hint">
            Saves <code>{lectureFileName(fileLecture)}</code> in the course-folder format (front matter with the audio link,
            chapters and timed insights). Put it in <code>courses/&lt;CODE&gt;/lectures/</code> and rebuild the course; the
            topic must be one of the course's topics.
          </p>
          <button type="button" className="secondary" disabled={!title.trim()} onClick={() => download(lectureFileName(fileLecture), lectureMarkdown(fileLecture))}>
            Download lecture file
          </button>
        </div>
      </section>
      <p className="hint">For learning only, not medical advice. Check every point against the lecture and your course materials.</p>
    </main>
  );
}
