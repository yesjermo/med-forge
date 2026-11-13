import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { checkNumber } from "../labmath";
import type { Course, Question } from "../types";
import { Crumbs, MedText, courseHref } from "../ui";

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
