import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { ProgressStore } from "../progress";
import type { CaseStage, ClinicalCase, Course } from "../types";
import { Crumbs, MedText, courseHref } from "../ui";

/**
 * Score one stage. Multi-choice: +1 per good option picked, −1 per poor one (floor 0), out of the
 * number of good options. Single-choice: 1 point for the good option.
 */
export function scoreStage(stage: CaseStage, picked: number[]): { score: number; max: number } {
  const good = stage.options.map((o, i) => (o.good ? i : -1)).filter((i) => i >= 0);
  if (stage.mode === "single") return { score: picked.length === 1 && good.includes(picked[0]!) ? 1 : 0, max: 1 };
  const hits = picked.filter((i) => good.includes(i)).length;
  const misses = picked.length - hits;
  return { score: Math.max(0, hits - misses), max: good.length };
}

/** A clinical case worked stage by stage, with feedback after each choice. */
export function CasePage({ course, kase, progress, refresh }: { course: Course; kase: ClinicalCase; progress: ProgressStore; refresh: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<{ score: number; max: number }[]>([]);
  const stage = kase.stages[stageIndex];
  const done = stageIndex >= kase.stages.length;
  const total = scores.reduce((a, s) => ({ score: a.score + s.score, max: a.max + s.max }), { score: 0, max: 0 });
  const best = progress.caseResult(kase.id);

  function toggle(i: number) {
    if (submitted || !stage) return;
    setPicked((cur) => (stage.mode === "single" ? [i] : cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  }

  function submit() {
    if (!stage) return;
    setScores((s) => [...s, scoreStage(stage, picked)]);
    setSubmitted(true);
  }

  function next() {
    const n = stageIndex + 1;
    setStageIndex(n);
    setPicked([]);
    setSubmitted(false);
    if (n >= kase.stages.length) {
      progress.saveCase(kase.id, total.score, total.max);
      refresh();
    }
  }

  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Clinical case" />
      <article className="panel case">
        <p className="hint case-setting">{kase.setting}</p>
        <h1>{kase.title}</h1>
        <p className="case-presentation">
          <MedText text={kase.presentation} inline />
        </p>
        <ol className="stage-track" aria-label="Case stages">
          {kase.stages.map((s, i) => (
            <li key={i} className={i < stageIndex ? "past" : i === stageIndex ? "current" : ""}>
              {s.title}
            </li>
          ))}
        </ol>

        {stage && (
          <section className="stage">
            <h2>
              {stageIndex + 1}. {stage.title}
            </h2>
            <p>
              <MedText text={stage.prompt} inline />{" "}
              <span className="hint">{stage.mode === "multi" ? "Choose all that apply." : "Choose one."}</span>
            </p>
            <ul className="case-options">
              {stage.options.map((o, i) => {
                const on = picked.includes(i);
                const cls = submitted ? (o.good ? "good" : on ? "poor" : "") : "";
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={`case-option ${on ? "picked" : ""} ${cls}`}
                      aria-pressed={on}
                      disabled={submitted}
                      onClick={() => toggle(i)}
                    >
                      <MedText text={o.text} inline />
                    </button>
                    {submitted && (on || o.good) && (
                      <p className={`case-feedback ${o.good ? "good" : "poor"}`}>
                        {o.good ? (on ? "Good choice. " : "Worth choosing. ") : "Not needed. "}
                        <MedText text={o.feedback} inline />
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
            {!submitted ? (
              <button onClick={submit} disabled={picked.length === 0}>
                Submit
              </button>
            ) : (
              <>
                <div className="debrief">
                  <p className="feedback-title">
                    Stage score {scores[scores.length - 1]!.score}/{scores[scores.length - 1]!.max}
                  </p>
                  <MedText text={stage.debrief} />
                </div>
                <button onClick={next}>{stageIndex + 1 < kase.stages.length ? "Next stage" : "Finish case"}</button>
              </>
            )}
          </section>
        )}

        {done && (
          <section className="stage">
            <h2>
              <Icon name="check" /> Case complete: {total.score}/{total.max}
            </h2>
            {best && <p className="hint">Your best: {best.score}/{best.max}</p>}
            <h3>Teaching points</h3>
            <ul>
              {kase.teachingPoints.map((t, i) => (
                <li key={i}>
                  <MedText text={t} inline />
                </li>
              ))}
            </ul>
            <div className="actions">
              <button
                className="secondary"
                onClick={() => {
                  setStageIndex(0);
                  setScores([]);
                  setPicked([]);
                  setSubmitted(false);
                }}
              >
                Try again
              </button>
              <a href={courseHref(course)}>Back to {course.title}</a>
            </div>
          </section>
        )}
      </article>
      <p className="hint disclaimer">Educational simulation with a fictional patient. Not medical advice; real care follows local protocols and a clinician's judgement.</p>
    </main>
  );
}
