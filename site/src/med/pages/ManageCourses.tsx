import { useState, type ChangeEvent } from "react";
import type { CourseRegistry, CourseSource } from "../packs";
import type { Course } from "../types";
import { Crumbs, courseHref } from "../ui";
import "./manage.css";

const SOURCE_LABEL: Record<CourseSource, string> = { "built-in": "Built-in", local: "Your folder", imported: "Imported" };

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** #/courses: every course with its source, pack import/export and how to add a private course. */
export function ManageCourses({ registry, refresh }: { registry: CourseRegistry; refresh: () => void }) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const entries = registry.all();

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { course } = registry.importJson(await file.text());
      const updated = entries.some((x) => x.source === "imported" && x.course.id === course.id);
      setMessage({ ok: true, text: `${updated ? "Updated" : "Imported"} “${course.title}” (${course.questions.length} questions). It's saved in this browser.` });
      refresh();
    } catch (err) {
      setMessage({ ok: false, text: `Couldn't import ${file.name}: ${(err as Error).message}` });
    }
  }

  function onRemove(course: Course) {
    if (!window.confirm(`Remove “${course.title}” from this browser? Your progress on its questions is kept, and you can import the pack again later.`)) return;
    registry.remove(course.id);
    setMessage({ ok: true, text: `Removed “${course.title}”.` });
    refresh();
  }

  return (
    <main className="shell narrow manage-courses">
      <Crumbs here="Manage courses" />
      <h1>Manage courses</h1>
      <p className="lede">
        Add your own university courses next to the built-in ones. Import a course pack a classmate shared, or build
        one from your own notes on your computer.
      </p>

      <section className="panel">
        <h2>Courses</h2>
        <ul className="link-list manage-list">
          {entries.map(({ course, source }) => (
            <li key={course.id}>
              <span className="manage-name">
                <a href={courseHref(course)}>
                  {course.code} · {course.title}
                </a>{" "}
                <span className={`tag source-${source}`}>{SOURCE_LABEL[source]}</span>
              </span>
              <span className="actions">
                <button type="button" className="secondary small" onClick={() => download(`${course.id}.med-forge-pack.json`, registry.exportJson(course))}>
                  Export pack
                </button>
                {source === "imported" && (
                  <button type="button" className="danger small" onClick={() => onRemove(course)}>
                    Remove
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Import a course pack</h2>
        <label className="field">
          Import a course pack (.json)
          <input type="file" accept=".json,application/json" onChange={onImport} />
          <small className="hint">Imported courses are saved in this browser only. A pack can replace one you imported before.</small>
        </label>
        {message && (
          <p className={message.ok ? "lint-ok" : "error"} role={message.ok ? "status" : "alert"}>
            {message.text}
          </p>
        )}
      </section>

      <section className="panel">
        <h2>Add a private university course</h2>
        <p>
          Like course-noting, each course is a folder of plain files (notes, questions, lectures, a lab, a case and a
          skill checklist) in <code>courses/&lt;CODE&gt;/</code>. Create one and add it to the app from the project folder:
        </p>
        <pre className="manage-cmd">
          <code>{`npm run course:new -- BIOL113 "Human Anatomy"\nnpm run course:bundle`}</code>
        </pre>
        <p className="hint">
          Edit the example files in <code>courses/BIOL113/</code> (its README explains the format), then run{" "}
          <code>npm run course:bundle</code> again. Course folders stay on your computer: they're git-ignored, so
          nothing is committed or published. To share a course, run <code>npm run course:pack -- BIOL113</code> or use
          “Export pack” above, and send the .json file.
        </p>
        <p className="hint">
          Write notes and questions in your own words. Don't share university-owned materials (lecture slides, exam
          papers, lab manuals) unless you're allowed to.
        </p>
      </section>
    </main>
  );
}
