import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { renderInline, renderSection } from "@/components/markup";
import type { Course } from "./types";

/** Course text (markdown-ish + KaTeX). renderSection escapes everything, so this is safe for any content. */
export function MedText({ text, inline = false }: { text: string; inline?: boolean }) {
  return inline ? (
    <span dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
  ) : (
    <div className="prose med-text" dangerouslySetInnerHTML={{ __html: renderSection(text) }} />
  );
}

export const courseHref = (c: Course, ...rest: string[]) => `#/c/${[c.id, ...rest].map(encodeURIComponent).join("/")}`;

export function Crumbs({ course, here }: { course?: Course; here?: string }) {
  return (
    <p className="hint crumbs">
      <a href="#/" className="back">
        <Icon name="arrow-left" size={14} /> Courses
      </a>
      {course && (
        <>
          {" / "}
          <a href={courseHref(course)}>{course.title}</a>
        </>
      )}
      {here && <> / {here}</>}
    </p>
  );
}

/** Segmented bar: mastered / to review / new. Shows counts as text too, never colour alone. */
export function ProgressBar({ mastered, review, fresh }: { mastered: number; review: number; fresh: number }) {
  const total = Math.max(1, mastered + review + fresh);
  return (
    <div className="progress">
      <div className="progress-bar" role="img" aria-label={`${mastered} mastered, ${review} to review, ${fresh} not started`}>
        <span className="seg mastered" style={{ width: `${(mastered / total) * 100}%` }} />
        <span className="seg review" style={{ width: `${(review / total) * 100}%` }} />
      </div>
      <p className="progress-legend">
        <span className="dot mastered" /> {mastered} mastered <span className="dot review" /> {review} to review{" "}
        <span className="dot fresh" /> {fresh} new
      </p>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <div className="notice med-notice">{children}</div>;
}

export const DIFFICULTY = ["", "Foundation", "Core", "Challenge"] as const;

/** ARIA tab strip plus the active panel. Element ids are `${id}-tab-${key}` and `${id}-panel-${key}`. */
export function Tabs<T extends string>({ id, label, tabs, value, onChange, className = "tabs", children }: {
  id: string;
  label: string;
  tabs: readonly (readonly [T, string])[];
  value: T;
  onChange: (t: T) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className={className} role="tablist" aria-label={label}>
        {tabs.map(([t, text]) => (
          <button key={t} type="button" role="tab" id={`${id}-tab-${t}`} aria-selected={value === t} aria-controls={`${id}-panel-${t}`} onClick={() => onChange(t)}>
            {text}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel-${value}`} aria-labelledby={`${id}-tab-${value}`}>
        {children}
      </div>
    </>
  );
}
