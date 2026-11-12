import { useState } from "react";
import { Icon } from "@/components/Icon";
import { checkNumber } from "../labmath";
import { GRADES, type ProgressStore, type QuestionStatus } from "../progress";
import type { Course, Question } from "../types";
import { Scratchpad } from "../scratchpad/Scratchpad";
import { Crumbs, DIFFICULTY, MedText, Tabs, courseHref } from "../ui";

const STATUS_LABEL: Record<QuestionStatus, string> = {
  unattempted: "New",
  needs_review: "To review",
  mastered: "Mastered",
};

export function QuestionList({
  course,
  progress,
  topic,
  status,
}: {
  course: Course;
  progress: ProgressStore;
  topic: string | null;
  status: string | null;
}) {
  const list = course.questions.filter(
    (q) => (!topic || q.topic === topic) && (!status || (progress.question(q.id)?.status ?? "unattempted") === status),
  );
  const href = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams();
    const next = { topic, status, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const qs = p.toString();
    return `${courseHref(course, "questions")}${qs ? `?${qs}` : ""}`;
  };
  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Questions" />
      <h1>Questions</h1>
      <div className="chip-row" role="group" aria-label="Topic">
        <a className={`chip ${!topic ? "on" : ""}`} href={href({ topic: null })}>
          All topics
        </a>
        {course.topics.map((t) => (
          <a key={t} className={`chip ${topic === t ? "on" : ""}`} href={href({ topic: t })}>
            {t}
          </a>
        ))}
      </div>
      <div className="chip-row" role="group" aria-label="Status">
        <a className={`chip ${!status ? "on" : ""}`} href={href({ status: null })}>
          Any status
        </a>
        {(Object.keys(STATUS_LABEL) as QuestionStatus[]).map((s) => (
          <a key={s} className={`chip ${status === s ? "on" : ""}`} href={href({ status: s })}>
            {STATUS_LABEL[s]}
          </a>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="panel empty-state">No questions match these filters.</p>
      ) : (
        <ol className="question-list">
          {list.map((q) => {
            const st = progress.question(q.id)?.status ?? "unattempted";
            return (
              <li key={q.id} className="post-row">
                <div className="post-main">
                  <a className="post-title" href={courseHref(course, "questions", q.id)}>
                    <MedText text={q.prompt} inline />
                  </a>
                  <div className="post-meta">
                    <span className="tag">{q.topic}</span>
                    <span className="tag">{DIFFICULTY[q.difficulty]}</span>
                    <span className={`tag status-${st}`}>{STATUS_LABEL[st]}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}

/** Answer one question, see the explanation, then rate your recall (0–5) for spaced review. */
export function QuestionView({
  course,
  question,
  progress,
  refresh,
  nextHref,
  backLabel,
}: {
  course: Course;
  question: Question;
  progress: ProgressStore;
  refresh: () => void;
  /** Where "Next" goes (next question in the course, or the next due card in review). */
  nextHref?: string;
  backLabel?: string;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [graded, setGraded] = useState<number | null>(null);
  const [pane, setPane] = useState<"answer" | "scratch">("answer");
  const prev = progress.question(question.id);

  const correct =
    question.type === "mcq" ? choice === question.answer : checkNumber(typed, question.answer, question.tolerance).ok;
  const canSubmit = question.type === "mcq" ? choice !== null : typed.trim() !== "";

  function rate(grade: number) {
    progress.grade(question.id, grade, question.type === "mcq" ? String(choice) : typed);
    setGraded(grade);
    refresh();
  }

  return (
    <article className="panel question">
      <div className="post-meta">
        <span className="tag">{question.topic}</span>
        <span className="tag">{DIFFICULTY[question.difficulty]}</span>
        {prev && (
          <span className="hint">
            Attempted {prev.attempts}× · last recall {prev.lastGrade}/5
          </span>
        )}
      </div>
      <h1 className="question-prompt">
        <MedText text={question.prompt} inline />
      </h1>

      <Tabs
        id={`q-${question.id}`}
        label="Question workspace"
        tabs={
          [
            ["answer", "Answer"],
            ["scratch", "Scratchpad"],
          ] as const
        }
        value={pane}
        onChange={setPane}
        className="tabs question-tabs"
      >
        {pane === "scratch" ? (
          <Scratchpad id={question.id} />
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit) setSubmitted(true);
              }}
            >
              {question.type === "mcq" ? (
                <fieldset className="options" disabled={submitted}>
                  <legend className="sr-only">Choose one answer</legend>
                  {question.options.map((o, i) => {
                    const state = submitted ? (i === question.answer ? "right" : i === choice ? "wrong" : "") : "";
                    return (
                      <label key={i} className={`option ${choice === i ? "picked" : ""} ${state}`}>
                        <input type="radio" name="opt" checked={choice === i} onChange={() => setChoice(i)} />
                        <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                        <MedText text={o} inline />
                      </label>
                    );
                  })}
                </fieldset>
              ) : (
                <label className="field numeric">
                  <span>Your answer{question.unit ? ` (${question.unit})` : ""}</span>
                  <input
                    inputMode="decimal"
                    value={typed}
                    disabled={submitted}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder="e.g. 4.9 or 1.5e9"
                    autoComplete="off"
                  />
                </label>
              )}

              {!submitted && (
                <div className="actions">
                  <button type="submit" disabled={!canSubmit}>
                    Check answer
                  </button>
                  {hintsShown < question.hints.length && (
                    <button type="button" className="secondary" onClick={() => setHintsShown((n) => n + 1)}>
                      Hint {hintsShown + 1} of {question.hints.length}
                    </button>
                  )}
                </div>
              )}
            </form>

            {hintsShown > 0 && !submitted && (
              <ul className="hints">
                {question.hints.slice(0, hintsShown).map((h, i) => (
                  <li key={i}>
                    <MedText text={h} inline />
                  </li>
                ))}
              </ul>
            )}

            {submitted && (
              <div className={`feedback ${correct ? "ok" : "bad"}`} role="status">
                <p className="feedback-title">
                  <Icon name={correct ? "check" : "stop"} />{" "}
                  {correct
                    ? "Correct"
                    : question.type === "numeric"
                      ? `Not quite. The answer is ${question.answer}${question.unit ? ` ${question.unit}` : ""}.`
                      : `Not quite. The answer is ${String.fromCharCode(65 + question.answer)}.`}
                </p>
                <MedText text={question.explanation} />
                <p className="related">
                  Concepts:{" "}
                  {question.concepts.map((s, i) => {
                    const c = course.concepts.find((x) => x.slug === s);
                    return (
                      <span key={s}>
                        {i > 0 && ", "}
                        <a href={courseHref(course, "concepts", s)}>{c?.title ?? s}</a>
                      </span>
                    );
                  })}
                </p>
              </div>
            )}

            {submitted && graded === null && (
              <div className="rate">
                <p>How well did you recall it? This schedules your next review.</p>
                <div className="actions">
                  {GRADES.map(([g, label, what]) => (
                    <button
                      key={g}
                      type="button"
                      title={what}
                      className={g === (correct ? 4 : 2) ? "" : "secondary"}
                      onClick={() => rate(g)}
                    >
                      {g} · {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {graded !== null && (
              <div className="actions after-rate">
                <span className="hint">
                  Saved. Next review in {progress.question(question.id)!.sm2.interval} day
                  {progress.question(question.id)!.sm2.interval === 1 ? "" : "s"}.
                </span>
                {nextHref && (
                  <a className="button" href={nextHref}>
                    Next
                  </a>
                )}
                <a href={courseHref(course, "questions")}>{backLabel ?? "All questions"}</a>
              </div>
            )}
          </>
        )}
      </Tabs>
    </article>
  );
}

export function QuestionPage({
  course,
  id,
  progress,
  refresh,
}: {
  course: Course;
  id: string;
  progress: ProgressStore;
  refresh: () => void;
}) {
  const i = course.questions.findIndex((q) => q.id === id);
  const q = course.questions[i];
  if (!q) {
    return (
      <main className="shell narrow">
        <Crumbs course={course} />
        <h1>That question isn't here</h1>
      </main>
    );
  }
  const next = course.questions[i + 1];
  return (
    <main className="shell narrow">
      <Crumbs course={course} here={`Question ${i + 1} of ${course.questions.length}`} />
      {/* key resets the form when moving between questions */}
      <QuestionView
        key={q.id}
        course={course}
        question={q}
        progress={progress}
        refresh={refresh}
        {...(next ? { nextHref: courseHref(course, "questions", next.id) } : {})}
      />
    </main>
  );
}
