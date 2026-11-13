import { useCallback, useState } from "react";
import { COURSES } from "./med/courses";
import { createCourseRegistry, type CourseRegistry } from "./med/packs";
import { CasePage } from "./med/pages/Case";
import { CourseHome } from "./med/pages/CourseHome";
import { Courses } from "./med/pages/Courses";
import { LabPage, LabTools, SkillPage } from "./med/pages/Lab";
import { ManageCourses } from "./med/pages/ManageCourses";
import { Nursing } from "./med/pages/Nursing";
import { Reference } from "./med/pages/Reference";
import { Research } from "./med/pages/Research";
import { Terms } from "./med/pages/Terms";
import { ImportPage } from "./med/pages/Import";
import { LectureImportPage } from "./med/pages/LectureImport";
import { BackupPage } from "./pages/Backup";
import { ToolsPage } from "./med/pages/Tools";
import { ConceptList, ConceptPage, Lectures, NotFound, Revision } from "./med/pages/Notes";
import { Exam, Review } from "./med/pages/Practice";
import { QuestionList, QuestionPage } from "./med/pages/Questions";
import { createProgress } from "./med/progress";
import { createNotebook } from "./notebook";
import { Generate } from "./pages/Generate";
import { Hub } from "./pages/Hub";
import { NewPost } from "./pages/NewPost";
import { Post } from "./pages/Post";
import { SettingsPage } from "./pages/Settings";
import { useRoute, type Route } from "./router";
import { loadSettings, saveSettings, type Settings } from "./settings";

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const REPO_URL = import.meta.env.VITE_REPO_URL || "https://github.com/search?q=med-forge&type=repositories";

const NAV = [
  { href: "#/", label: "Courses", match: (p: string) => p === "/" || p.startsWith("/c/") },
  { href: "#/daily-review", label: "Daily review", match: (p: string) => p === "/review" || p === "/daily-review" },
  {
    href: "#/tools",
    label: "Tools",
    match: (p: string) => ["/tools", "/lab", "/nursing", "/reference", "/terms", "/research", "/generate", "/check", "/courses", "/lecture-import", "/import"].includes(p),
  },
  { href: "#/hub", label: "Notebook", match: (p: string) => p.startsWith("/hub") },
  { href: "#/backup", label: "Save / Load", match: (p: string) => p === "/backup" },
  { href: "#/settings", label: "Settings", match: (p: string) => p === "/settings" },
];

export function App() {
  const route = useRoute();
  const [notebook] = useState(() => createNotebook(browserStorage()));
  const [progress] = useState(() => createProgress(browserStorage()));
  const [registry] = useState(() => createCourseRegistry(browserStorage(), COURSES));
  const [, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const updateSettings = (s: Settings) => {
    setSettings(s);
    return saveSettings(s);
  };

  const page = pageFor(route, { notebook, progress, registry, refresh, settings, updateSettings });

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a href="#/" className="brand" aria-label="MedForge home">
            <span className="brand-mark" aria-hidden="true" />
            <span>
              Med<span className="brand-forge">Forge</span>
            </span>
          </a>
          <nav aria-label="Main">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={n.match(route.path) ? "page" : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      {page}
      <footer className="foot">
        For learning only, not medical advice. Progress, posts and keys stay on this device. Not affiliated with any
        university.{" "}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          Source code
        </a>
        {location.protocol !== "file:" && import.meta.env.PROD && (
          <>
            {" · "}
            <a href="med-forge.html" download>
              Offline copy (one file)
            </a>
          </>
        )}
      </footer>
    </>
  );
}

function pageFor(
  route: Route,
  ctx: {
    notebook: ReturnType<typeof createNotebook>;
    progress: ReturnType<typeof createProgress>;
    registry: CourseRegistry;
    refresh: () => void;
    settings: Settings;
    updateSettings: (s: Settings) => boolean;
  },
) {
  const { notebook, progress, registry, refresh, settings, updateSettings } = ctx;
  const [first, second, third, fourth] = route.segments;
  const courses = registry.all().map((x) => x.course);

  if (route.path === "/") return <Courses progress={progress} courses={courses} />;
  if (route.path === "/review" || route.path === "/daily-review") return <Review progress={progress} refresh={refresh} courses={courses} />;
  if (route.path === "/tools") return <ToolsPage />;
  if (route.path === "/lab") return <LabTools />;
  if (route.path === "/nursing") return <Nursing />;
  if (route.path === "/reference") return <Reference />;
  if (route.path === "/terms") return <Terms progress={progress} refresh={refresh} />;
  if (route.path === "/research") return <Research />;
  if (route.path === "/courses") return <ManageCourses registry={registry} refresh={refresh} />;
  if (route.path === "/import") return <ImportPage refresh={refresh} />;
  if (route.path === "/lecture-import") return <LectureImportPage registry={registry} refresh={refresh} />;
  if (route.path === "/generate" || route.path === "/check") {
    return <Generate mode={route.path === "/check" ? "check" : "generate"} settings={settings} onSettings={updateSettings} />;
  }
  // The app holds progress, notebook and packs in memory, so reload after a restore or clean slate.
  if (route.path === "/backup") return <BackupPage refresh={() => window.location.reload()} />;
  if (route.path === "/settings") return <SettingsPage settings={settings} onSave={updateSettings} />;

  if (first === "hub" && !second) return <Hub notebook={notebook} route={route} refresh={refresh} />;
  if (first === "hub" && second === "new") {
    return <NewPost notebook={notebook} settings={settings} refresh={refresh} fromGenerator={route.query.get("from") === "generator"} />;
  }
  if (first === "hub" && second) return <Post id={second} notebook={notebook} settings={settings} refresh={refresh} />;

  if (first === "c") {
    const course = second ? registry.find(second) : undefined;
    if (!course) return <NotFound what="course" />;
    const shared = { course, progress, refresh };
    switch (third) {
      case undefined:
        return <CourseHome course={course} progress={progress} />;
      case "concepts":
        return fourth ? <ConceptPage course={course} slug={fourth} /> : <ConceptList course={course} />;
      case "lectures":
        return <Lectures course={course} focus={route.query.get("l")} />;
      case "questions":
        return fourth ? (
          <QuestionPage {...shared} id={fourth} />
        ) : (
          <QuestionList course={course} progress={progress} topic={route.query.get("topic")} status={route.query.get("status")} />
        );
      case "exam":
        return <Exam course={course} />;
      case "revision":
        return <Revision course={course} />;
      case "labs": {
        const lab = course.labs.find((l) => l.id === fourth);
        return lab ? <LabPage {...shared} lab={lab} /> : <NotFound course={course} what="lab" />;
      }
      case "cases": {
        const kase = course.cases.find((k) => k.id === fourth);
        return kase ? <CasePage {...shared} kase={kase} /> : <NotFound course={course} what="case" />;
      }
      case "skills": {
        const skill = course.skills.find((s) => s.id === fourth);
        return skill ? <SkillPage {...shared} skill={skill} /> : <NotFound course={course} what="skill" />;
      }
    }
    return <NotFound course={course} what="page" />;
  }

  return <NotFound what="page" />;
}
