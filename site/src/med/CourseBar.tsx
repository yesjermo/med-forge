import { useEffect, useRef, useState } from "react";
import type { ProgressStore } from "./progress";
import type { Course } from "./types";
import { MedText, courseHref } from "./ui";

const INSIGHTS_KEY = "study-forge:lecture-insights";
const INSIGHTS_EVENT = "medforge:lecture-insights";

/** "Lectures on/off": whether insights from lectures are shown on concept pages and questions. */
export function useLectureInsights(): [boolean, (on: boolean) => void] {
  const read = () => {
    try {
      return localStorage.getItem(INSIGHTS_KEY) !== "off";
    } catch {
      return true;
    }
  };
  const [on, setOn] = useState(read);
  useEffect(() => {
    const sync = () => setOn(read());
    window.addEventListener(INSIGHTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(INSIGHTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const set = (next: boolean) => {
    try {
      localStorage.setItem(INSIGHTS_KEY, next ? "on" : "off");
    } catch {
      // Blocked storage: the choice lasts for this page.
    }
    setOn(next);
    window.dispatchEvent(new Event(INSIGHTS_EVENT));
  };
  return [on, set];
}

/** Mastered / total questions in a course. */
function mastery(course: Course, progress: ProgressStore) {
  const c = progress.counts(course.questions.map((q) => q.id));
  const total = course.questions.length;
  return { mastered: c.mastered, total, pct: total ? Math.round((c.mastered / total) * 100) : 0 };
}

/** The next question worth practising: the most overdue one, else the first new one, else the first. */
function practiceHref(course: Course, progress: ProgressStore): string {
  const ids = course.questions.map((q) => q.id);
  const next = progress.due(ids)[0] ?? course.questions.find((q) => !progress.question(q.id))?.id ?? ids[0];
  return next ? courseHref(course, "questions", next) : courseHref(course);
}

/**
 * The bar under the main navigation inside a course: switch course, jump to a section, see how
 * much is mastered, switch lecture insights on or off, and practise the next question.
 */
export function CourseBar({ course, courses, progress, section }: { course: Course; courses: Course[]; progress: ProgressStore; section: string | undefined }) {
  const [open, setOpen] = useState(false);
  const [insights, setInsights] = useLectureInsights();
  const menu = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const m = mastery(course, progress);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!menu.current?.contains(e.target as Node) && !button.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", key);
    menu.current?.querySelector<HTMLElement>("[aria-current='true'], a")?.focus();
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  useEffect(() => setOpen(false), [course.id, section]);

  const links: [string | undefined, string, string][] = [
    [undefined, "Dashboard", courseHref(course)],
    ["questions", `Questions (${course.questions.length})`, courseHref(course, "questions")],
    ["concepts", "Concepts", courseHref(course, "concepts")],
    ["lectures", "Lectures", courseHref(course, "lectures")],
    ["exam", "Timed exam", courseHref(course, "exam")],
    ["revision", "Revision sheet", courseHref(course, "revision")],
  ];

  return (
    <div className="course-bar no-print">
      <div className="course-bar-inner">
        <div className="course-switch">
          <button
            ref={button}
            type="button"
            className="course-switch-btn"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="course-switch-code">{course.code}</span>
            <span className="course-switch-title">{course.title}</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {open && (
            <div ref={menu} className="course-menu" role="menu" aria-label="Switch course">
              <p className="course-menu-head">Switch course</p>
              {courses.map((c) => {
                const cm = mastery(c, progress);
                return (
                  <a
                    key={c.id}
                    role="menuitem"
                    href={courseHref(c)}
                    aria-current={c.id === course.id ? "true" : undefined}
                    className="course-menu-item"
                  >
                    <span className="course-menu-code">{c.code}</span>
                    <span className="course-menu-title">{c.title}</span>
                    <span className="course-menu-pct">{cm.pct}%</span>
                  </a>
                );
              })}
              <a role="menuitem" href="#/courses" className="course-menu-manage">
                + Manage or add courses
              </a>
            </div>
          )}
        </div>

        {/* A div with the navigation role: the header's ".nav nav" styles mustn't apply here. */}
        <div className="course-links" role="navigation" aria-label={`${course.code} sections`}>
          {links.map(([key, label, href]) => (
            <a key={label} href={href} aria-current={section === key ? "page" : undefined}>
              {label}
            </a>
          ))}
        </div>

        <div className="course-bar-tools">
          <span className="mastered-pill" title="Questions mastered in this course">
            <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 8.2l2 2 4-4.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Mastered {m.mastered}/{m.total} · <strong>{m.pct}%</strong>
          </span>
          <button
            type="button"
            className={`insights-toggle ${insights ? "on" : ""}`}
            aria-pressed={insights}
            title="Show what the lectures said on concept pages and questions"
            onClick={() => setInsights(!insights)}
          >
            Lectures {insights ? "on" : "off"}
          </button>
          <a className="button small practice-btn" href={practiceHref(course, progress)}>
            Practice
          </a>
        </div>
      </div>
    </div>
  );
}

const INSIGHT_LABEL = { exam_tip: "Exam tip", clinical_link: "Clinical link", intuition: "Intuition" } as const;

/**
 * "From the lectures": insights from this course's lectures linked to any of `slugs`.
 * Hidden when Lecture insights is switched off, or when no lecture mentions these concepts.
 */
export function FromLectures({ course, slugs }: { course: Course; slugs: string[] }) {
  const [on] = useLectureInsights();
  const items = course.lectures.flatMap((l) =>
    l.insights.filter((i) => i.conceptSlug && slugs.includes(i.conceptSlug)).map((i, n) => ({ l, i, key: `${l.id}-${n}` })),
  );
  if (!on || !items.length) return null;
  return (
    <aside className="from-lectures" aria-label="From the lectures">
      <h3>From the lectures</h3>
      <ul>
        {items.map(({ l, i, key }) => (
          <li key={key}>
            <span className="tag">{INSIGHT_LABEL[i.type]}</span> <MedText text={i.text} inline />
            <a className="hint" href={`${courseHref(course, "lectures")}?l=${l.id}`}>
              Week {l.week}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
