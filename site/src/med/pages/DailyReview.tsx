import { useEffect, useState } from "react";
import { createMyCards, type MyCard } from "../mycards";
import { GRADES, lastReviewedAt, type ProgressStore, type Sm2 } from "../progress";
import type { Concept, Course, Lecture, Question } from "../types";
import { Crumbs, MedText, Tabs, courseHref } from "../ui";
import { MyCardFace } from "./MyCardReview";
import { QuestionView } from "./Questions";

const EXAM_KEY = "study-forge:exam-date";
const DAY = 86_400_000;

/** Progress ids for notes and lectures, so they share the SM-2 store with questions. */
export const noteId = (course: Course, c: Concept) => `note:${course.id}:${c.slug}`;
export const lectureId = (course: Course, l: Lecture) => `lec:${course.id}:${l.id}`;

type Item =
  | { kind: "q"; course: Course; q: Question }
  | { kind: "note"; course: Course; concept: Concept; id: string }
  | { kind: "lecture"; course: Course; lecture: Lecture; id: string }
  | { kind: "card"; card: MyCard };

type Mode = "due" | "quizzes" | "notes";
const MODES = [
  ["due", "Due today"],
  ["quizzes", "All quizzes"],
  ["notes", "Notes & lectures"],
] as const;

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function storedExamDate(): string {
  try {
    return localStorage.getItem(EXAM_KEY) ?? "";
  } catch {
    return "";
  }
}

const keyOf = (x: Item) => (x.kind === "q" ? x.q.id : x.kind === "card" ? x.card.id : x.id);
const kindLabel = (x: Item) =>
  x.kind === "q" ? "Quiz" : x.kind === "note" ? "Notes" : x.kind === "lecture" ? "Lecture" : "My card";

/**
 * Daily review (#/daily-review).
 * - Due today: every matured quiz question, note, lecture and snipped card (SM-2), with exam-day look-ahead.
 * - All quizzes: work through every question of a course (or all), due or not.
 * - Notes & lectures: recall each concept and lecture, then check against the notes and rate it.
 */
export function Review({ progress, refresh, courses }: { progress: ProgressStore; refresh: () => void; courses: Course[] }) {
  const [mode, setMode] = useState<Mode>("due");
  const [courseFilter, setCourseFilter] = useState("all");
  const inScope = courses.filter((c) => courseFilter === "all" || c.id === courseFilter);

  const questions: Item[] = inScope.flatMap((course) => course.questions.map((q): Item => ({ kind: "q", course, q })));
  const notes: Item[] = inScope.flatMap((course) => [
    ...course.concepts.map((concept): Item => ({ kind: "note", course, concept, id: noteId(course, concept) })),
    ...course.lectures.map((lecture): Item => ({ kind: "lecture", course, lecture, id: lectureId(course, lecture) })),
  ]);

  const [examDate, setExamDate] = useState(storedExamDate);
  const examAt = examDate ? new Date(`${examDate}T23:59:59`).getTime() : NaN;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Calendar days from today to exam day (0 = the exam is today).
  const daysLeft = Number.isFinite(examAt) ? Math.round((new Date(`${examDate}T00:00:00`).getTime() - today.getTime()) / DAY) : null;
  const lookAhead = daysLeft !== null && daysLeft >= 0;
  const [cards] = useState(() => createMyCards(safeStorage()));
  const now = Date.now();

  const sm2Of = (x: Item): Sm2 | undefined => (x.kind === "card" ? x.card.sm2 : progress.question(keyOf(x))?.sm2);
  // One pass over each store, up to exam day (or now); "due now" is the subset already due.
  const horizon = lookAhead ? Math.max(now, examAt) : now;
  const tracked = [...questions, ...notes];
  const dueIds = new Set(progress.due(tracked.map(keyOf), horizon));
  const upcoming: Item[] = [
    ...tracked.filter((x) => dueIds.has(keyOf(x))),
    ...(courseFilter === "all" ? cards.due(horizon).map((card): Item => ({ kind: "card", card })) : []),
  ];
  const dueNow = upcoming.filter((x) => (sm2Of(x)?.due ?? Infinity) <= now);
  // Reviewing ahead skips anything already graded today: it would only reset a schedule just set.
  const beforeExam = upcoming.filter((x) => {
    const s = sm2Of(x);
    return !!s && (s.due <= now || lastReviewedAt(s) < today.getTime());
  });

  const [ahead, setAhead] = useState(false);
  const [index, setIndex] = useState(0);
  const listFor = (m: Mode, isAhead: boolean): Item[] => (m === "quizzes" ? questions : m === "notes" ? notes : isAhead ? beforeExam : dueNow);
  // Freeze the queue when the page opens, or when the mode, course or look-ahead changes, so
  // grading a card doesn't reshuffle it.
  const [queue, setQueue] = useState<Item[]>(() => listFor("due", false));
  const restart = (m: Mode, isAhead: boolean) => {
    setIndex(0);
    setQueue(listFor(m, isAhead));
  };
  useEffect(() => {
    restart(mode, ahead);
    // Only rebuild on an explicit change of what to review, not on every re-render after a grade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, courseFilter, ahead]);
  const current = queue[index];
  const next = () => setIndex((i) => i + 1);

  const saveExam = (v: string) => {
    setExamDate(v);
    try {
      v ? localStorage.setItem(EXAM_KEY, v) : localStorage.removeItem(EXAM_KEY);
    } catch {
      // Blocked storage: the date lasts for this visit.
    }
  };

  const counts = { q: 0, note: 0, lecture: 0, card: 0 };
  for (const x of dueNow) counts[x.kind]++;
  // A mix to start with: three new questions, two notes and a lecture.
  const unseen = (xs: Item[]) => xs.filter((x) => !progress.question(keyOf(x)));
  const fresh = [
    ...unseen(questions).slice(0, 3),
    ...unseen(notes.filter((x) => x.kind === "note")).slice(0, 2),
    ...unseen(notes.filter((x) => x.kind === "lecture")).slice(0, 1),
  ];

  return (
    <main className="shell narrow">
      <Crumbs here="Daily review" />
      <h1>Daily review</h1>
      <p className="lede">
        Spaced repetition (SM-2): rate each answer from 0 (blankout) to 5 (mastered) and it comes back just before you'd
        forget it. Quizzes, notes, lectures and snipped cards all count.
      </p>

      <div className="panel review-plan">
        <div className="row">
          <label className="field">
            <span>Course</span>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="all">All courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Exam day (optional)</span>
            <input type="date" value={examDate} onChange={(e) => saveExam(e.target.value)} />
          </label>
        </div>
        <p className="hint" role="status">
          {dueNow.length} due today ({counts.q} quiz{counts.q === 1 ? "" : "zes"}, {counts.note + counts.lecture} note
          {counts.note + counts.lecture === 1 ? "" : "s"}/lecture{counts.note + counts.lecture === 1 ? "" : "s"}
          {courseFilter === "all" ? `, ${counts.card} snipped card${counts.card === 1 ? "" : "s"}` : ""})
          {daysLeft !== null &&
            (daysLeft < 0
              ? " · that exam date has passed"
              : ` · ${daysLeft === 0 ? "exam today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} to the exam`} · ${beforeExam.length - dueNow.length} more come due before then`)}
        </p>
        {mode === "due" && !ahead && beforeExam.length > dueNow.length && (
          <button type="button" className="secondary small" onClick={() => setAhead(true)}>
            Review ahead: everything due before exam day
          </button>
        )}
      </div>

      <Tabs id="review" label="What to review" tabs={MODES} value={mode} onChange={setMode} className="tabs">
        {current ? (
          <>
            <p className="hint">
              {kindLabel(current)} {index + 1} of {queue.length}
              {mode === "due" ? (ahead ? " due before the exam" : " due") : ""} ·{" "}
              {current.kind === "card" ? `My card${current.card.course ? ` · ${current.card.course}` : ""}` : current.course.title}
            </p>
            {current.kind === "q" && (
              <QuestionView
                key={current.q.id}
                course={current.course}
                question={current.q}
                progress={progress}
                refresh={refresh}
                backLabel={`Open ${current.course.code} questions`}
              />
            )}
            {(current.kind === "note" || current.kind === "lecture") && (
              <RecallCard
                key={current.id}
                item={current}
                progress={progress}
                onGraded={() => {
                  refresh();
                  next();
                }}
              />
            )}
            {current.kind === "card" && (
              <MyCardFace
                key={current.card.id}
                card={current.card}
                onGrade={(g) => {
                  cards.rate(current.card.id, g);
                  next();
                }}
              />
            )}
            <div className="actions">
              <button className="secondary" onClick={next}>
                {index + 1 < queue.length ? (current.kind === "q" ? "Next" : "Skip") : "Finish"}
              </button>
              {mode !== "due" && index > 0 && (
                <button className="secondary" onClick={() => restart(mode, ahead)}>
                  Start again
                </button>
              )}
            </div>
          </>
        ) : (
          <section className="panel">
            <h2>{queue.length ? "All done" : mode === "due" ? "Nothing due yet" : "Nothing here yet"}</h2>
            <p className="hint">
              {mode === "due"
                ? "Anything you rate comes back here on a spaced-repetition schedule: hard ones tomorrow, easy ones days or weeks later. Try All quizzes or Notes & lectures to start, and problems you snip from past papers with the "
                : "Every item has been shown. Start again, or switch course or tab. Problems you snip with the "}
              <a href="#/import">question snipper</a> join the queue too.
            </p>
            {queue.length > 0 && (
              <button className="secondary" onClick={() => restart(mode, ahead)}>
                Start again
              </button>
            )}
            {mode === "due" && fresh.length > 0 && (
              <>
                <h3>Start something new</h3>
                <ul className="link-list">
                  {fresh.map((x) =>
                    x.kind === "q" ? (
                      <li key={x.q.id}>
                        <a href={courseHref(x.course, "questions", x.q.id)}>
                          <MedText text={x.q.prompt.length > 90 ? `${x.q.prompt.slice(0, 90)}…` : x.q.prompt} inline />
                        </a>
                        <span className="hint">{x.course.code}</span>
                      </li>
                    ) : x.kind === "note" ? (
                      <li key={x.id}>
                        <a href={courseHref(x.course, "concepts", x.concept.slug)}>{x.concept.title}</a>
                        <span className="hint">{x.course.code} · notes</span>
                      </li>
                    ) : x.kind === "lecture" ? (
                      <li key={x.id}>
                        <a href={`${courseHref(x.course, "lectures")}?l=${x.lecture.id}`}>
                          Week {x.lecture.week}: {x.lecture.title}
                        </a>
                        <span className="hint">{x.course.code} · lecture</span>
                      </li>
                    ) : null,
                  )}
                </ul>
              </>
            )}
          </section>
        )}
      </Tabs>
    </main>
  );
}

/**
 * Recall card for a concept or lecture: try to recall the key points, reveal the notes, then rate
 * yourself 0–5 (keys 0–5; Space or Enter reveals).
 */
function RecallCard({
  item,
  progress,
  onGraded,
}: {
  item: Extract<Item, { kind: "note" } | { kind: "lecture" }>;
  progress: ProgressStore;
  onGraded: () => void;
}) {
  const [shown, setShown] = useState(false);
  const isNote = item.kind === "note";
  const title = isNote ? item.concept.title : `Week ${item.lecture.week}: ${item.lecture.title}`;
  const prev = progress.question(item.id);
  const grade = (g: number) => {
    progress.grade(item.id, g);
    onGraded();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (!shown && (e.key === " " || e.key === "Enter")) {
        if (t?.tagName === "BUTTON" || t?.tagName === "A") return;
        e.preventDefault();
        setShown(true);
      } else if (shown && /^[0-5]$/.test(e.key)) {
        e.preventDefault();
        grade(Number(e.key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <article className="panel recall-card" aria-label={title}>
      <div className="post-meta">
        <span className="tag">{isNote ? item.concept.topic : item.lecture.topic}</span>
        <span className="tag">{isNote ? "Notes" : "Lecture"}</span>
        {prev && <span className="hint">Reviewed {prev.attempts}× · last recall {prev.lastGrade}/5</span>}
      </div>
      <h2>{title}</h2>
      {!shown ? (
        <>
          <p className="hint">
            {isNote
              ? "Before you look: say or write the key idea, any formula, and one clinical link."
              : "Before you look: what were this lecture's main points and exam tips?"}
          </p>
          <div className="actions">
            <button type="button" onClick={() => setShown(true)}>
              Show the notes
            </button>
            <span className="hint">
              or press <kbd className="kbd">Space</kbd>
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="recall-answer">
            <MedText text={isNote ? item.concept.summary : item.lecture.summary} />
            {isNote && item.concept.formulas && item.concept.formulas.length > 0 && (
              <ul className="recall-list">
                {item.concept.formulas.map((f, i) => (
                  <li key={i}>
                    <MedText text={`$${f}$`} inline />
                  </li>
                ))}
              </ul>
            )}
            <ul className="recall-list">
              {(isNote ? item.concept.pearls : item.lecture.insights.map((x) => x.text)).map((t, i) => (
                <li key={i}>
                  <MedText text={t} inline />
                </li>
              ))}
            </ul>
            <a href={isNote ? courseHref(item.course, "concepts", item.concept.slug) : `${courseHref(item.course, "lectures")}?l=${item.lecture.id}`}>
              Open the full {isNote ? "notes" : "lecture"}
            </a>
          </div>
          <div className="rate">
            <p>How well did you recall it? This schedules your next review.</p>
            <div className="actions">
              {GRADES.map(([g, label, what]) => (
                <button key={g} type="button" title={what} className={g === 4 ? "" : "secondary"} onClick={() => grade(g)}>
                  {g} · {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
