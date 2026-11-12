import { Icon } from "@/components/Icon";
import type { ProgressStore } from "../progress";
import type { Course } from "../types";
import { ProgressBar, courseHref } from "../ui";
import { ToolsList } from "./Tools";

/** Home: every course pack with its progress, plus today's review count. */
export function Courses({ progress, courses }: { progress: ProgressStore; courses: Course[] }) {
  const allIds = courses.flatMap((c) => c.questions.map((q) => q.id));
  const due = progress.due(allIds).length;

  return (
    <main className="shell">
      <div className="hub-head">
        <div>
          <h1>Medical-science courses</h1>
          <p className="lede">
            Notes, practice questions, lab skills and clinical cases for pre-med and biomedical science students at USF
            and other colleges. Your progress stays in this browser.
          </p>
        </div>
        <a className="button" href="#/daily-review">
          <Icon name="check" /> Daily review{due ? ` (${due} due)` : ""}
        </a>
      </div>

      <div className="result-head courses-head">
        <h2 className="sr-only">Your courses</h2>
        <a href="#/courses" className="hint">
          Add your own university course or import a pack →
        </a>
      </div>

      <ul className="course-grid">
        {courses.map((c) => {
          const counts = progress.counts(c.questions.map((q) => q.id));
          return (
            <li key={c.id} className="course-card">
              <a href={courseHref(c)} className="course-link">
                <span className="course-code">{c.code}</span>
                <h2>{c.title}</h2>
                <p className="hint">{c.description}</p>
              </a>
              <ProgressBar mastered={counts.mastered} review={counts.needs_review} fresh={counts.unattempted} />
              <p className="course-meta">
                {c.concepts.length} concepts · {c.questions.length} questions · {c.labs.length} lab ·{" "}
                {c.cases.length} case · {c.skills.length} skill
              </p>
            </li>
          );
        })}
      </ul>

      <section className="panel tools-strip">
        <div className="result-head">
          <h2>Tools</h2>
          <a href="#/tools">All tools</a>
        </div>
        <ToolsList />
      </section>

      <p className="hint disclaimer">
        For learning only, not medical advice. Clinical cases are educational simulations with fictional patients. Not
        affiliated with or endorsed by the University of San Francisco or any other institution.
      </p>
    </main>
  );
}
