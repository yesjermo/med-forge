import { PACK_FORMAT, PACK_VERSION, wrapPack } from "./coursefiles";
import type { Course } from "./types";
import { looksLikeCourse, validateCourse } from "./validate";

/**
 * Runtime course registry: built-in courses, courses bundled from private folders
 * (npm run course:bundle writes site/src/med/local/<id>.json, git-ignored) and packs the
 * student imported in the browser (kept in localStorage).
 */

export const PACKS_STORAGE_KEY = "study-forge:med-packs";

export type CourseSource = "built-in" | "local" | "imported";

interface CourseEntry {
  course: Course;
  source: CourseSource;
}

const localModules = import.meta.glob<unknown>("./local/*.json", { eager: true, import: "default" });

/** Courses from site/src/med/local/*.json that pass validation (anything else is skipped with a warning). */
const LOCAL_COURSES: Course[] = Object.entries(localModules).flatMap(([path, data]) => {
  const problems = checkCourse(data);
  if (problems.length) {
    console.warn(`Skipping ${path}: ${problems.slice(0, 3).join("; ")}`);
    return [];
  }
  return [data as Course];
});

function checkCourse(x: unknown): string[] {
  if (!looksLikeCourse(x)) return ["it isn't a StudyForge course (missing id, title, code, topics or content lists)"];
  try {
    return validateCourse(x);
  } catch {
    return ["some course content is missing or has the wrong shape"];
  }
}

export function createCourseRegistry(
  storage: Pick<Storage, "getItem" | "setItem"> | null,
  builtIn: Course[],
  local: Course[] = LOCAL_COURSES,
) {
  const builtInIds = new Set(builtIn.map((c) => c.id));
  const localOk = local.filter((c) => !builtInIds.has(c.id));
  const reserved = new Map<string, CourseSource>([...builtIn.map((c) => [c.id, "built-in"] as const), ...localOk.map((c) => [c.id, "local"] as const)]);

  let imported: Course[] = [];
  try {
    const raw = storage?.getItem(PACKS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) imported = parsed.filter((c): c is Course => !checkCourse(c).length && !reserved.has((c as Course).id));
  } catch {
    // Blocked or corrupt storage: start empty and keep working in memory.
  }

  const save = () => {
    try {
      storage?.setItem(PACKS_STORAGE_KEY, JSON.stringify(imported));
    } catch {
      // Storage full or blocked: the import still works until the page is reloaded.
    }
  };

  const tag = (source: CourseSource) => (course: Course): CourseEntry => ({ course, source });
  const all = (): CourseEntry[] => [...builtIn.map(tag("built-in")), ...localOk.map(tag("local")), ...imported.map(tag("imported"))];

  return {
    all,
    find(id: string | undefined): Course | undefined {
      return all().find((e) => e.course.id === id)?.course;
    },
    /** Import a pack ({format, version, course}) or a bare Course. Throws an Error with a readable message. */
    importJson(text: string): { course: Course } {
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("That file isn't valid JSON. Choose a .json course pack exported from StudyForge.");
      }
      if (typeof data === "object" && data !== null && "format" in data) {
        const pack = data as { format: unknown; version?: unknown; course?: unknown };
        if (pack.format !== PACK_FORMAT) throw new Error(`Unknown pack format "${String(pack.format)}"; expected "${PACK_FORMAT}".`);
        if (typeof pack.version === "number" && pack.version > PACK_VERSION) {
          throw new Error(`This pack uses format version ${pack.version}; this version of StudyForge reads version ${PACK_VERSION}. Update the app and try again.`);
        }
        data = pack.course;
      }
      const problems = checkCourse(data);
      if (problems.length) {
        const more = problems.length > 4 ? `; and ${problems.length - 4} more` : "";
        throw new Error(`This course pack has ${problems.length === 1 ? "a problem" : `${problems.length} problems`}: ${problems.slice(0, 4).join("; ")}${more}.`);
      }
      const course = data as Course;
      const clash = reserved.get(course.id);
      if (clash) throw new Error(`A ${clash} course already uses the id "${course.id}". Change the id in the pack's course.json and export it again.`);
      imported = [...imported.filter((c) => c.id !== course.id), course];
      save();
      return { course };
    },
    /** Remove an imported course. Built-in and local courses can't be removed here. */
    remove(id: string): boolean {
      const before = imported.length;
      imported = imported.filter((c) => c.id !== id);
      if (imported.length === before) return false;
      save();
      return true;
    },
    exportJson(course: Course): string {
      return JSON.stringify(wrapPack(course), null, 2) + "\n";
    },
  };
}

export type CourseRegistry = ReturnType<typeof createCourseRegistry>;
