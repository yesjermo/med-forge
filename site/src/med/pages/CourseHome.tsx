import { Icon } from "@/components/Icon";
import type { ProgressStore } from "../progress";
import { lectureId, noteId } from "./DailyReview";
import type { Course } from "../types";
import { Crumbs, ProgressBar, courseHref } from "../ui";

/** Course dashboard, modelled on a study hub: progress, quick actions, topics, then every section. */
export function CourseHome({ course, progress }: { course: Course; progress: ProgressStore }) {
  const ids = course.questions.map((q) => q.id);
  const counts = progress.counts(ids);
  // The daily review also schedules this course's notes and lectures.
  const due = progress.due([...ids, ...course.concepts.map((c) => noteId(course, c)), ...course.lectures.map((l) => lectureId(course, l))]).length;
  const next = course.questions.find((q) => !progress.question(q.id)) ?? course.questions[0];

  return (
    <main className="shell">
      <Crumbs />
      <div className="hub-head">
        <div>
          <span className="course-code">{course.code}</span>
          <h1>{course.title}</h1>
          <p className="lede">{course.description}</p>
        </div>
      </div>

      <div className="actions quick-actions">
        {next && (
          <a className="button" href={courseHref(course, "questions", next.id)}>
            <Icon name="spark" />{" "}
            {progress.question(next.id) ? "Practise" : next === course.questions[0] ? "Start question 1" : `Continue: question ${course.questions.indexOf(next) + 1}`}
          </a>
        )}
        <a className="button secondary-link" href="#/daily-review">
          Daily review{due ? ` (${due})` : ""}
        </a>
        <a className="button secondary-link" href={courseHref(course, "exam")}>
          Timed exam
        </a>
        <a className="button secondary-link" href={courseHref(course, "revision")}>
          Revision sheet
        </a>
      </div>

      <section className="panel">
        <h2>Progress</h2>
        <ProgressBar mastered={counts.mastered} review={counts.needs_review} fresh={counts.unattempted} />
        <ul className="topic-list">
          {course.topics.map((t) => {
            const qs = course.questions.filter((q) => q.topic === t);
            const c = progress.counts(qs.map((q) => q.id));
            return (
              <li key={t}>
                <a href={`${courseHref(course, "questions")}?topic=${encodeURIComponent(t)}`}>{t}</a>
                <span className="hint">
                  {c.mastered}/{qs.length} mastered
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="med-grid">
        <section className="panel">
          <div className="result-head">
            <h2>Concepts</h2>
            <a href={courseHref(course, "concepts")}>All concepts</a>
          </div>
          <ul className="link-list">
            {course.concepts.map((c) => (
              <li key={c.slug}>
                <a href={courseHref(course, "concepts", c.slug)}>{c.title}</a>
                <span className="hint">{c.topic}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="result-head">
            <h2>Lectures</h2>
            <a href={courseHref(course, "lectures")}>All lectures</a>
          </div>
          <ul className="link-list">
            {course.lectures.map((l) => (
              <li key={l.id}>
                <a href={`${courseHref(course, "lectures")}?l=${l.id}`}>
                  Week {l.week}: {l.title}
                </a>
                <span className="hint">{l.insights.length} insights</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Lab practice</h2>
          <ul className="link-list">
            {course.labs.map((l) => {
              const done = progress.labSteps(l.id).length;
              return (
                <li key={l.id}>
                  <a href={courseHref(course, "labs", l.id)}>{l.title}</a>
                  <span className="hint">
                    {done}/{l.steps.length} steps · {l.drills.length} drills
                  </span>
                </li>
              );
            })}
            {course.skills.map((s) => {
              const done = progress.skillChecks(s.id).length;
              return (
                <li key={s.id}>
                  <a href={courseHref(course, "skills", s.id)}>Skill: {s.title}</a>
                  <span className="hint">
                    {done}/{s.items.length} checked
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel">
          <h2>Clinical practice</h2>
          <ul className="link-list">
            {course.cases.map((k) => {
              const r = progress.caseResult(k.id);
              return (
                <li key={k.id}>
                  <a href={courseHref(course, "cases", k.id)}>{k.title}</a>
                  <span className="hint">{r ? `Best ${r.score}/${r.max}` : `${k.stages.length} stages`}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
