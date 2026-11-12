import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { checkNumber } from "../labmath";
import { lastReviewedAt, type ProgressStore, type Sm2 } from "../progress";
import type { Course, Question } from "../types";
import { Crumbs, MedText, courseHref } from "../ui";
import { createMyCards, type MyCard } from "../mycards";
import { MyCardFace } from "./MyCardReview";
import { QuestionView } from "./Questions";

const EXAM_KEY = "study-forge:exam-date";

type Item = { kind: "q"; course: Course; q: Question } | { kind: "card"; card: MyCard };

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
const DAY = 86_400_000;

function storedExamDate(): string {
  try {
    return localStorage.getItem(EXAM_KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * Daily review (#/daily-review): every matured card across all courses, scheduled by SM-2.
 * With an exam date set, "review ahead" also pulls in cards that would come due before exam day.
 */
export function Review({ progress, refresh, courses }: { progress: ProgressStore; refresh: () => void; courses: Course[] }) {
  const all = courses.flatMap((c) => c.questions.map((q) => ({ course: c, q })));
  const ids = all.map((x) => x.q.id);
  const [examDate, setExamDate] = useState(storedExamDate);
  const examAt = examDate ? new Date(`${examDate}T23:59:59`).getTime() : NaN;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Calendar days from today to exam day (0 = the exam is today).
  const daysLeft = Number.isFinite(examAt) ? Math.round((new Date(`${examDate}T00:00:00`).getTime() - today.getTime()) / DAY) : null;
  const [cards] = useState(() => createMyCards(safeStorage()));
  const lookAhead = daysLeft !== null && daysLeft >= 0;
  const now = Date.now();
  const sm2Of = (x: Item): Sm2 => (x.kind === "q" ? progress.question(x.q.id)!.sm2 : x.card.sm2);
  // One pass over each store, up to exam day (or now); "due now" is the subset already due.
  const horizon = lookAhead ? Math.max(now, examAt) : now;
  const upcoming: Item[] = [
    ...progress.due(ids, horizon).map((id): Item => ({ kind: "q", ...all.find((x) => x.q.id === id)! })),
    ...cards.due(horizon).map((card): Item => ({ kind: "card", card })),
  ];
  const dueNow = upcoming.filter((x) => sm2Of(x).due <= now);
  // Reviewing ahead skips anything already graded today: it would only reset a schedule just set.
  const beforeExam = upcoming.filter((x) => sm2Of(x).due <= now || lastReviewedAt(sm2Of(x)) < today.getTime());
  const fresh = all.filter((x) => !progress.question(x.q.id)).slice(0, 5);
  const [ahead, setAhead] = useState(false);
  const [index, setIndex] = useState(0);
  // Freeze the queue when the page opens (or the mode changes) so grading a card doesn't reshuffle it.
  const [queue, setQueue] = useState(dueNow);
  const current = queue[index];

  const saveExam = (v: string) => {
    setExamDate(v);
    try {
      v ? localStorage.setItem(EXAM_KEY, v) : localStorage.removeItem(EXAM_KEY);
    } catch {
      // Blocked storage: the date lasts for this visit.
    }
  };
  const reviewAhead = () => {
    setAhead(true);
    setIndex(0);
    setQueue(beforeExam);
  };

  return (
    <main className="shell narrow">
      <Crumbs here="Daily review" />
      <h1>Daily review</h1>
      <p className="lede">
        Spaced repetition (SM-2): rate each answer from 0 (blankout) to 5 (mastered) and the card comes back just before
        you'd forget it.
      </p>
      <div className="panel review-plan">
        <label className="field">
          <span>Exam day (optional)</span>
          <input type="date" value={examDate} onChange={(e) => saveExam(e.target.value)} />
        </label>
        <p className="hint" role="status">
          {dueNow.length} due today
          {daysLeft !== null &&
            (daysLeft < 0
              ? " · that exam date has passed"
              : ` · ${daysLeft === 0 ? "exam today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} to the exam`} · ${beforeExam.length - dueNow.length} more come due before then`)}
        </p>
        {!ahead && beforeExam.length > dueNow.length && (
          <button type="button" className="secondary small" onClick={reviewAhead}>
            Review ahead: everything due before exam day
          </button>
        )}
      </div>
      {current ? (
        <>
          <p className="hint">
            Card {index + 1} of {queue.length} {ahead ? "due before the exam" : "due"} ·{" "}
            {current.kind === "q" ? current.course.title : `My card${current.card.course ? ` · ${current.card.course}` : ""}`}
          </p>
          {current.kind === "q" ? (
            <QuestionView
              key={current.q.id}
              course={current.course}
              question={current.q}
              progress={progress}
              refresh={refresh}
              backLabel={`Open ${current.course.code} questions`}
            />
          ) : (
            <MyCardFace
              key={current.card.id}
              card={current.card}
              onGrade={(g) => {
                cards.rate(current.card.id, g);
                setIndex((i) => i + 1);
              }}
            />
          )}
          <div className="actions">
            <button className="secondary" onClick={() => setIndex((i) => i + 1)}>
              {index + 1 < queue.length ? "Next due card" : "Finish review"}
            </button>
          </div>
        </>
      ) : (
        <section className="panel">
          <h2>{queue.length ? "All done for today" : "Nothing due yet"}</h2>
          <p className="hint">
            Questions you answer come back here on a spaced-repetition schedule: hard ones tomorrow, easy ones days or
            weeks later. Problems you snip from past papers with the <a href="#/import">question snipper</a> join the queue too.
          </p>
          {fresh.length > 0 && (
            <>
              <h3>Start something new</h3>
              <ul className="link-list">
                {fresh.map(({ course, q }) => (
                  <li key={q.id}>
                    <a href={courseHref(course, "questions", q.id)}>
                      <MedText text={q.prompt.length > 90 ? `${q.prompt.slice(0, 90)}…` : q.prompt} inline />
                    </a>
                    <span className="hint">{course.code}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </main>
  );
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function isRight(q: Question, a: string | undefined): boolean {
  if (a === undefined || a === "") return false;
  return q.type === "mcq" ? Number(a) === q.answer : checkNumber(a, q.answer, q.tolerance).ok;
}

/** Timed exam: pick length and time, answer without feedback, then see a marked script. */
export function Exam({ course }: { course: Course }) {
  const [setup, setSetup] = useState({ count: Math.min(6, course.questions.length), minutes: 10 });
  const [paper, setPaper] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!paper || finished) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [paper, finished]);

  const left = Math.max(0, endsAt - now);
  useEffect(() => {
    if (paper && !finished && left === 0) setFinished(true);
  }, [left, paper, finished]);

  const score = useMemo(() => (paper ?? []).filter((q) => isRight(q, answers[q.id])).length, [paper, answers]);

  if (!paper) {
    return (
      <main className="shell narrow">
        <Crumbs course={course} here="Timed exam" />
        <h1>Timed exam</h1>
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setPaper(shuffle(course.questions).slice(0, setup.count));
            setAnswers({});
            setFinished(false);
            setEndsAt(Date.now() + setup.minutes * 60_000);
            setNow(Date.now());
          }}
        >
          <div className="row">
            <label className="field">
              <span>Questions</span>
              <input
                type="number"
                min={1}
                max={course.questions.length}
                value={setup.count}
                onChange={(e) => setSetup((s) => ({ ...s, count: Math.max(1, Math.min(course.questions.length, Number(e.target.value) || 1)) }))}
              />
            </label>
            <label className="field">
              <span>Minutes</span>
              <input
                type="number"
                min={1}
                max={120}
                value={setup.minutes}
                onChange={(e) => setSetup((s) => ({ ...s, minutes: Math.max(1, Math.min(120, Number(e.target.value) || 1)) }))}
              />
            </label>
          </div>
          <p className="hint">No hints or feedback until you finish. The exam doesn't change your review schedule.</p>
          <button type="submit">
            <Icon name="spark" /> Start exam
          </button>
        </form>
      </main>
    );
  }

  const mm = Math.floor(left / 60000);
  const ss = Math.floor((left % 60000) / 1000);
  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Timed exam" />
      <div className="result-head exam-head">
        <h1>{finished ? `Score: ${score} / ${paper.length}` : "Exam in progress"}</h1>
        {!finished && (
          <span className={`timer ${left < 60_000 ? "low" : ""}`} aria-live="off">
            {mm}:{String(ss).padStart(2, "0")}
          </span>
        )}
      </div>
      <ol className="exam-list">
        {paper.map((q, n) => {
          const a = answers[q.id];
          const right = finished && isRight(q, a);
          return (
            <li key={q.id} className={`panel exam-q ${finished ? (right ? "right" : "wrong") : ""}`}>
              <p className="exam-prompt">
                <strong>{n + 1}.</strong> <MedText text={q.prompt} inline />
              </p>
              {q.type === "mcq" ? (
                <fieldset className="options compact" disabled={finished}>
                  <legend className="sr-only">Question {n + 1}</legend>
                  {q.options.map((o, i) => (
                    <label key={i} className={`option ${a === String(i) ? "picked" : ""} ${finished && i === q.answer ? "right" : ""}`}>
                      <input type="radio" name={q.id} checked={a === String(i)} onChange={() => setAnswers((s) => ({ ...s, [q.id]: String(i) }))} />
                      <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                      <MedText text={o} inline />
                    </label>
                  ))}
                </fieldset>
              ) : (
                <label className="field numeric">
                  <span>Answer{q.unit ? ` (${q.unit})` : ""}</span>
                  <input
                    inputMode="decimal"
                    value={a ?? ""}
                    disabled={finished}
                    onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: e.target.value }))}
                  />
                </label>
              )}
              {finished && (
                <div className={`feedback ${right ? "ok" : "bad"}`}>
                  <p className="feedback-title">
                    {right ? "Correct" : q.type === "numeric" ? `Answer: ${q.answer} ${q.unit}` : `Answer: ${String.fromCharCode(65 + q.answer)}`}
                  </p>
                  <MedText text={q.explanation} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="actions">
        {finished ? (
          <button onClick={() => setPaper(null)}>New exam</button>
        ) : (
          <button onClick={() => setFinished(true)}>Finish and mark</button>
        )}
      </div>
    </main>
  );
}
