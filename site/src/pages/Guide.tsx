import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { parseHash } from "../router";
import "./guide.css";

const DEMO = "#/c/anatomy-physiology";

interface Section {
  id: string;
  title: string;
  body: () => ReactNode;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="guide-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Steps({ children }: { children: ReactNode }) {
  return <ol className="guide-steps">{children}</ol>;
}

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Overview",
    body: () => (
      <>
        <p>
          MedForge is built around three habits that make knowledge stick: try to recall before you read, come back to things just
          before you forget them, and practise using what you know. Everything runs in your browser, with no account.
        </p>
        <div className="guide-cards">
          <Card title="Recall first">
            <p>
              Answer a question, or say a concept out loud, before you open the explanation. Use the hints one at a time only when
              you are stuck.
            </p>
            <a href={`${DEMO}/questions`}>Open a question bank</a>
          </Card>
          <Card title="Review on a schedule">
            <p>
              Rate how well you recalled each item from 0 to 5. The daily review brings it back tomorrow, or in days or weeks, depending
              on that rating.
            </p>
            <a href="#/daily-review">Open the daily review</a>
          </Card>
          <Card title="Practise it">
            <p>
              Labs, staged patient cases and OSCE-style skill checklists turn facts into steps you can perform and explain.
            </p>
            <a href={DEMO}>Browse a course</a>
          </Card>
        </div>
      </>
    ),
  },
  {
    id: "your-work",
    title: "How MedForge keeps your work",
    body: () => (
      <>
        <p>MedForge keeps three things separate, so updating one never overwrites another.</p>
        <div className="guide-cards">
          <Card title="Courses">
            <p>
              The built-in courses ship with the app. You can add more: packs you import in the browser, packs published with the
              website for everyone, and private course folders on your own computer.
            </p>
            <a href="#/">See all courses</a>
          </Card>
          <Card title="Lecture insights">
            <p>
              Lectures add exam tips, clinical links and intuitions on top of the course notes. The <strong>Lectures on/off</strong>{" "}
              switch in a course's toolbar shows or hides insights from lectures on concept pages and questions.
            </p>
            <a href={`${DEMO}/lectures`}>Open lectures</a>
          </Card>
          <Card title="Your progress">
            <p>
              Answers, review schedules, scratchpads, notebook posts and imported packs are kept only in this browser. Nothing is
              uploaded. Use Save / Load to move them to another device.
            </p>
            <a href="#/backup">Open Save / Load</a>
          </Card>
        </div>
      </>
    ),
  },
  {
    id: "questions",
    title: "Questions & the scratchpad",
    body: () => (
      <>
        <p>Every course has a question bank with multiple-choice and numeric questions.</p>
        <Steps>
          <li>
            <strong>Answer.</strong> Pick an option, or type a number. Numeric answers accept a trailing unit (<code>4.9 L/min</code>), a
            decimal comma (<code>4,9</code>) and scientific notation (<code>1.5e9</code>). The <strong>±</strong> button switches the
            sign, since phone number pads have no minus key.
          </li>
          <li>
            <strong>Stuck?</strong> Press <strong>Hint</strong> to reveal one hint at a time, then <strong>Check answer</strong>.
          </li>
          <li>
            <strong>Read the explanation</strong> and follow the links to the related concepts.
          </li>
          <li>
            <strong>Rate your recall</strong> from 0 (Blankout) to 5 (Mastered). This schedules when the question comes back.
          </li>
        </Steps>
        <Card title="Scratchpad">
          <p>
            Each question has a <strong>Scratchpad</strong> tab with a pen, highlighter, eraser, colours and undo. Sketch an ECG or work a
            calculation; the drawing is saved with that question.
          </p>
        </Card>
        <p>
          <a href={`${DEMO}/questions`}>Try a practice question</a> · <a href={`${DEMO}/exam`}>Take a timed exam</a> ·{" "}
          <a href={`${DEMO}/revision`}>Print a revision sheet</a>
        </p>
      </>
    ),
  },
  {
    id: "daily-review",
    title: "Daily review (SM-2)",
    body: () => (
      <>
        <p>
          The daily review uses the SuperMemo-2 (SM-2) algorithm: each item comes back just before you would forget it. It has three
          tabs.
        </p>
        <div className="guide-cards">
          <Card title="Due today">
            <p>Every question, note, lecture and snipped card whose review date has come.</p>
          </Card>
          <Card title="All quizzes">
            <p>Work through every question of one course, or all of them, due or not.</p>
          </Card>
          <Card title="Notes & lectures">
            <p>Recall a concept or lecture from memory, then check it against the notes and rate it.</p>
          </Card>
        </div>
        <h3 className="guide-sub">The 0 to 5 scale</h3>
        <ul className="guide-scale" aria-label="Recall ratings">
          <li><strong>0</strong> Blankout: no memory of it</li>
          <li><strong>1</strong> Wrong, but the answer looked familiar</li>
          <li><strong>2</strong> Hard: wrong, but close</li>
          <li><strong>3</strong> OK: right, with real effort</li>
          <li><strong>4</strong> Good: right after a short pause</li>
          <li><strong>5</strong> Mastered: instant and certain</li>
        </ul>
        <p>Anything rated below 3 comes back tomorrow; higher ratings push the next review further out.</p>
        <Card title="Exam day">
          <p>
            Set your exam day to see a countdown. When more cards come due before it, <strong>Review ahead</strong> brings them all
            forward so you can finish them now.
          </p>
          <a href="#/daily-review">Open the daily review</a>
        </Card>
      </>
    ),
  },
  {
    id: "lectures",
    title: "Lectures & recordings",
    body: () => (
      <>
        <p>
          Each course has lecture notes with timed insights: exam tips, clinical links and intuitions, grouped into chapters.
        </p>
        <Steps>
          <li>
            <strong>Play a recording.</strong> On any lecture, choose <strong>Add a recording</strong> and pick a file from your computer
            (<code>.mp4</code>, <code>.m4a</code>, <code>.mp3</code>, <code>.webm</code>…). It plays with the chapters and insights
            following along. The file stays on your computer, so pick it again next visit.
          </li>
          <li>
            <strong>Turn captions into insights.</strong> Download the captions (<code>.vtt</code>, <code>.srt</code> or{" "}
            <code>.txt</code>) from Echo360 or Panopto yourself, then open <strong>Tools › Lecture recording to insights</strong>. Your AI
            writer finds timed exam tips that you can save as a lecture in a course you imported.
          </li>
        </Steps>
        <p className="guide-note">
          MedForge never logs in to Echo360, Panopto or any other service. You download the captions; it only reads the file you give it.
        </p>
        <p>
          <a href={`${DEMO}/lectures`}>Open lectures</a> · <a href="#/lecture-import">Lecture recording to insights</a>
        </p>
      </>
    ),
  },
  {
    id: "practice",
    title: "Labs, cases & skills",
    body: () => (
      <>
        <p>Each course has hands-on practice alongside its notes. Open it from the course page.</p>
        <div className="guide-cards">
          <Card title="Lab practice">
            <p>
              A protocol with safety notes and a tickable checklist, plus calculation drills that check your answer. The lab calculators
              cover dilutions, plate counts, Beer–Lambert and more.
            </p>
            <a href="#/lab">Lab calculators</a>
          </Card>
          <Card title="Clinical cases">
            <p>
              A staged patient case: history, exam, tests, interpretation, diagnosis and management principles, with feedback and a
              score at each stage.
            </p>
          </Card>
          <Card title="Skills">
            <p>OSCE-style checklists with critical steps marked, to rehearse a procedure in order.</p>
          </Card>
        </div>
        <p className="guide-note">
          Cases are educational simulations with fictional patients and contain no drug doses. For learning only, not medical advice.
        </p>
        <p>
          <a href={DEMO}>Open a course</a>
        </p>
      </>
    ),
  },
  {
    id: "snipper",
    title: "Question snipper",
    body: () => (
      <>
        <p>Turn past papers and tutorial sheets into review cards.</p>
        <Steps>
          <li>
            Open <strong>Tools › Question snipper</strong> and choose a PDF or image, drag it in, or paste a screenshot.
          </li>
          <li>Drag a box around a problem, and optionally another around its answer.</li>
          <li>The snip becomes a card in your daily review, scheduled like any other question.</li>
        </Steps>
        <p className="guide-note">
          Files never leave your browser. PDFs open on the website; the one-file offline copy takes images and screenshots only.
        </p>
        <p>
          <a href="#/import">Open the question snipper</a>
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI writer & advice",
    body: () => (
      <>
        <p>
          The AI writer is free and local by default: it uses <strong>Ollama</strong>, which runs a model on your own computer, so your
          notes don't leave it.
        </p>
        <div className="guide-cards">
          <Card title="Pick a model">
            <p>
              In Settings, or on the generator page, the model picker lists the models installed in Ollama and free ones you can
              download, for example <code>ollama pull qwen3</code>.
            </p>
            <a href="#/settings">Open Settings</a>
          </Card>
          <Card title="Online models">
            <p>
              Optional: add your own key for OpenRouter, Google Gemini or OpenAI in Settings. Keys are saved only in this browser and go
              straight to that provider.
            </p>
          </Card>
          <Card title="Generate study blocks">
            <p>
              Paste lecture notes or a case and get cited study blocks for medicine, nursing, pre-med or pre-vet. A format check flags
              any citation that wasn't actually retrieved.
            </p>
            <a href="#/generate">Generate study blocks</a>
          </Card>
          <Card title="Advise me">
            <p>
              On a generated pack, <strong>Advise me</strong> reviews your sources, thesis and idea and suggests next searches.
              Notebook posts have <strong>Get advice</strong>.
            </p>
          </Card>
        </div>
        <p className="guide-note">AI drafts can be wrong. Check every fact against your course materials.</p>
      </>
    ),
  },
  {
    id: "backup",
    title: "Save, load & backup",
    body: () => (
      <>
        <p>
          Your progress lives in this browser. <strong>Save / Load</strong> in the top bar moves it between devices or keeps a copy.
        </p>
        <Steps>
          <li>
            <strong>Copy save string:</strong> one compressed line with your progress, answers, review schedules, notebook, imported
            packs, exam date and scratchpads. Paste it on another device.
          </li>
          <li>
            <strong>Download backup file:</strong> the same as a <code>.json</code> file, optionally with your snipped cards.
          </li>
          <li>
            <strong>Load:</strong> paste a string or upload a file, see what's in it, then <strong>Merge</strong> it with what's here or{" "}
            <strong>Replace</strong> what's here.
          </li>
          <li>
            <strong>Clean slate for sharing:</strong> clears your answers and progress but keeps the courses and imported packs.
          </li>
        </Steps>
        <p className="guide-note">Settings and API keys are never included in a save string or backup file.</p>
        <p>
          <a href="#/backup">Open Save / Load</a>
        </p>
      </>
    ),
  },
  {
    id: "courses",
    title: "Adding courses & local studio",
    body: () => (
      <>
        <p>
          A course pack is one <code>.json</code> file holding a whole course. There are three places to add one.
        </p>
        <h3 className="guide-sub">In the browser</h3>
        <p>
          Open <strong>Tools › Add or import a course</strong> and choose <strong>Import a course pack (.json)</strong>. The course
          appears on the home page and stays in this browser only. <strong>Export pack</strong> on the same page downloads any course as
          a pack.
        </p>
        <p>
          <a href="#/courses">Add or import a course</a>
        </p>
        <h3 className="guide-sub">On your computer</h3>
        <p>
          With Node.js 22.13 or newer, clone the project, run <code>npm install</code>, then start it:
        </p>
        <pre className="guide-pre">
          <code>npm run dev</code>
        </pre>
        <p>
          Write a course as a folder of Markdown and YAML files under <code>courses/</code>, which is git-ignored, so it stays private:
        </p>
        <pre className="guide-pre">
          <code>{`npm run course:new -- BIOL105 "Molecules of Life"   # starter folder
npm run course:check                                # report problems by file
npm run course:pack -- BIOL105                      # folder to one .json pack
npm run course:unpack -- biol-105.med-forge-pack.json   # pack back to a folder
npm run course:lecture -- BIOL105 week3.vtt --title "Week 3: Enzymes"`}</code>
        </pre>
        <p>
          <code>course:lecture</code> turns captions you downloaded into a lecture file with timed notes and insights.
        </p>
        <h3 className="guide-sub">Published for everyone</h3>
        <p>
          Put a pack in <code>site/src/med/published/</code> and lecture recordings in <code>site/public/media/</code>, then commit to{" "}
          <code>main</code>. The CI workflow rebuilds the website. Published files are public, so only publish what you wrote or have
          permission to share.
        </p>
      </>
    ),
  },
];

const ids = SECTIONS.map((s) => s.id);

function sectionFromHash(): string {
  const s = parseHash(window.location.hash).query.get("s");
  return s && ids.includes(s) ? s : ids[0]!;
}

export function GuidePage() {
  const [active, setActive] = useState(sectionFromHash);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const content = useRef<HTMLElement>(null);

  // Follow links like #/guide?s=backup while the page is open.
  useEffect(() => {
    const sync = () => setActive(sectionFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (id: string) => {
    setActive(id);
    // replaceState doesn't fire hashchange, so the page doesn't jump to the top.
    try {
      history.replaceState(history.state, "", `#/guide?s=${encodeURIComponent(id)}`);
    } catch {
      // Some file:// pages refuse; the section still changes.
    }
    if (window.matchMedia?.("(max-width: 760px)").matches) {
      content.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: ids.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const j = (next + ids.length) % ids.length;
    buttons.current[j]?.focus();
  };

  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]!;

  return (
    <main className="shell guide">
      <section className="guide-hero" aria-labelledby="guide-title">
        <span className="guide-pill">Guide &amp; tutorial</span>
        <h1 id="guide-title">How to study with MedForge</h1>
        <p className="guide-intro">
          MedForge brings course notes, practice questions, spaced review and lab and clinical practice together in your browser. This
          guide shows how each part works and how to fit them into a study week.
        </p>
        <div className="actions">
          <a className="button" href="#/c/anatomy-physiology/questions">
            Try a practice question
          </a>
          <a className="button secondary" href="#/daily-review">
            Open the daily review
          </a>
        </div>
      </section>

      <div className="guide-body">
        <nav className="guide-nav" aria-labelledby="guide-nav-title">
          <h2 id="guide-nav-title" className="guide-nav-title">
            Sections
          </h2>
          <ul>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  aria-current={s.id === active ? "true" : undefined}
                  aria-controls="guide-content"
                  onClick={() => select(s.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className="guide-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <article id="guide-content" ref={content} className="guide-content panel" aria-labelledby={`guide-h-${section.id}`} tabIndex={-1}>
          <h2 id={`guide-h-${section.id}`}>{section.title}</h2>
          {section.body()}
        </article>
      </div>
    </main>
  );
}
