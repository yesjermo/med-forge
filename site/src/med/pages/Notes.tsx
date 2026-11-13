import { FromLectures } from "../CourseBar";
import { useEffect } from "react";
import { LectureRecording } from "../lecture/LecturePlayer";
import { Model3D } from "../model3d/Model3D";
import type { Course } from "../types";
import { Crumbs, MedText, courseHref } from "../ui";

const INSIGHT_LABEL = { exam_tip: "Exam tip", clinical_link: "Clinical link", intuition: "Intuition" } as const;

export function ConceptList({ course }: { course: Course }) {
  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Concepts" />
      <h1>Concepts</h1>
      {course.topics.map((t) => (
        <section key={t} className="panel concept-group">
          <h2>{t}</h2>
          <ul className="link-list">
            {course.concepts
              .filter((c) => c.topic === t)
              .map((c) => (
                <li key={c.slug}>
                  <a href={courseHref(course, "concepts", c.slug)}>{c.title}</a>
                  <span className="hint">
                    <MedText text={c.summary} inline />
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

export function ConceptPage({ course, slug }: { course: Course; slug: string }) {
  const c = course.concepts.find((x) => x.slug === slug);
  if (!c) return <NotFound course={course} what="concept" />;
  const related = course.questions.filter((q) => q.concepts.includes(c.slug));
  return (
    <main className="shell narrow">
      <Crumbs course={course} here={c.title} />
      <article className="panel">
        <span className="tag">{c.topic}</span>
        <h1>{c.title}</h1>
        <p className="lede">
          <MedText text={c.summary} inline />
        </p>
        {c.model && <Model3D id={c.model} />}
        <MedText text={c.body} />
        <FromLectures course={course} slugs={[c.slug]} />
        <div className="pearls">
          <h2>Clinical pearls</h2>
          <ul>
            {c.pearls.map((p, i) => (
              <li key={i}>
                <MedText text={p} inline />
              </li>
            ))}
          </ul>
        </div>
      </article>
      {related.length > 0 && (
        <section className="panel">
          <h2>Practise this concept</h2>
          <ul className="link-list">
            {related.map((q) => (
              <li key={q.id}>
                <a href={courseHref(course, "questions", q.id)}>
                  <MedText text={q.prompt.length > 90 ? `${q.prompt.slice(0, 90)}…` : q.prompt} inline />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export function Lectures({ course, focus }: { course: Course; focus?: string | null }) {
  // Routing uses the URL hash, so a lecture is targeted with ?l=<id> and scrolled into view.
  useEffect(() => {
    if (focus) document.getElementById(focus)?.scrollIntoView({ block: "start" });
  }, [focus]);
  return (
    <main className="shell narrow">
      <Crumbs course={course} here="Lectures" />
      <h1>Lecture notes</h1>
      {course.lectures.map((l) => (
        <article key={l.id} id={l.id} className="panel lecture">
          <p className="hint">
            Week {l.week} · {l.topic}
          </p>
          <h2>{l.title}</h2>
          <p>
            <MedText text={l.summary} inline />
          </p>
          <LectureRecording courseId={course.id} lecture={l} />
          <MedText text={l.notes} />
          <ul className="insights">
            {l.insights.map((i, n) => (
              <li key={n} className={`insight ${i.type}`}>
                <span className="tag">{INSIGHT_LABEL[i.type]}</span> <MedText text={i.text} inline />
                {i.conceptSlug && (
                  <>
                    {" "}
                    <a href={courseHref(course, "concepts", i.conceptSlug)}>See concept</a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </main>
  );
}

/** Printable cheat sheet: every concept's summary, formulas and pearls. */
export function Revision({ course }: { course: Course }) {
  return (
    <main className="shell revision">
      <div className="no-print">
        <Crumbs course={course} here="Revision sheet" />
      </div>
      <div className="result-head">
        <h1>{course.title}: revision sheet</h1>
        <button className="no-print" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <div className="revision-grid">
        {course.concepts.map((c) => (
          <section key={c.slug} className="revision-card">
            <h2>{c.title}</h2>
            <p>
              <MedText text={c.summary} inline />
            </p>
            {c.formulas?.map((f, i) => <MedText key={i} text={`$$ ${f} $$`} />)}
            <ul>
              {c.pearls.map((p, i) => (
                <li key={i}>
                  <MedText text={p} inline />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="hint">For learning only, not medical advice.</p>
    </main>
  );
}

export function NotFound({ course, what }: { course?: Course; what: string }) {
  return (
    <main className="shell narrow">
      <Crumbs {...(course ? { course } : {})} />
      <h1>That {what} isn't here</h1>
      <p className="lede">It may have moved. Go back to {course ? <a href={courseHref(course)}>{course.title}</a> : <a href="#/">your courses</a>}.</p>
    </main>
  );
}
