import { useMemo, useState, type ChangeEvent } from "react";
import {
  backupFileName,
  backupToFile,
  BackupError,
  cleanSlate,
  collectBackup,
  describeBackup,
  describeStorage,
  encodeSaveString,
  formatBytes,
  measureStorage,
  readBackup,
  restoreBackup,
  type Backup,
  type BackupStorage,
  type BackupSummary,
  type RestoreMode,
} from "../med/backup";
import "./backup.css";

function browserStorage(): BackupStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const message = (e: unknown) => (e instanceof BackupError ? e.message : "Something went wrong reading this backup. Nothing was changed.");

function SummaryList({ s }: { s: BackupSummary }) {
  const rows: [string, string][] = [
    ["Questions and terms with progress", `${s.questions} (${s.reviewed} answered)`],
    ["Lab steps / cases / skills", `${s.labs} / ${s.cases} / ${s.skills}`],
    ["Notebook posts", String(s.notebookPosts)],
    ["Imported course packs", s.packs.length ? s.packs.join(", ") : "none"],
    ["Exam date", s.examDate ?? "not set"],
    ["Scratchpads", String(s.scratchpads)],
    ["Lecture positions", String(s.lecturePositions)],
    ["Snipped cards", s.myCards === null ? "not included" : String(s.myCards)],
  ];
  return (
    <dl className="backup-summary">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BackupPage({ refresh }: { refresh: () => void }) {
  const [revision, setRevision] = useState(0);
  const storage = browserStorage();
  // Re-read storage after a restore or clean slate (revision), not on every keystroke.
  const { sizes, current } = useMemo(() => {
    try {
      return { sizes: measureStorage(storage), current: describeStorage(storage) as BackupSummary | null };
    } catch {
      return { sizes: null, current: null };
    }
  }, [revision]);

  const [cardsInString, setCardsInString] = useState(false);
  const [cardsInFile, setCardsInFile] = useState(true);
  const [saveString, setSaveString] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState<Backup | null>(null);
  const [mode, setMode] = useState<RestoreMode>("merge");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [deleteCards, setDeleteCards] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [slateError, setSlateError] = useState<string | null>(null);

  const after = (text: string) => {
    refresh();
    setRevision((n) => n + 1);
    setDone(text);
  };

  async function copyString() {
    setSaveError(null);
    setSaveStatus(null);
    try {
      const str = await encodeSaveString(collectBackup(storage, { includeCards: cardsInString }));
      setSaveString(str);
      try {
        await navigator.clipboard.writeText(str);
        setSaveStatus(`Copied (${formatBytes(str.length)}). Paste it into Save / Load on your other device.`);
      } catch {
        setSaveStatus("Your browser didn't allow copying. Select the text below and copy it yourself.");
      }
    } catch (e) {
      setSaveError(message(e));
    }
  }

  function downloadFile() {
    setSaveError(null);
    setSaveStatus(null);
    try {
      const text = backupToFile(collectBackup(storage, { includeCards: cardsInFile }));
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaveStatus(`Downloaded ${a.download} (${formatBytes(text.length)}).`);
    } catch (e) {
      setSaveError(message(e));
    }
  }

  async function check(text: string) {
    setLoadError(null);
    setLoaded(null);
    setDone(null);
    setBusy(true);
    try {
      setLoaded(await readBackup(text));
    } catch (e) {
      setLoadError(message(e));
    } finally {
      setBusy(false);
    }
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 40_000_000) {
      setLoadError("That file is too large to be a MedForge backup.");
      return;
    }
    try {
      const text = await file.text();
      setInput("");
      await check(text);
    } catch {
      setLoadError("That file couldn't be read.");
    }
  }

  function restore() {
    if (!loaded) return;
    const warn =
      mode === "replace"
        ? "Replace this browser's study progress, notebook posts, imported packs, exam date and scratchpads with the backup? Anything not in the backup is lost."
        : "Merge the backup into this browser's saved study data?";
    if (!window.confirm(warn)) return;
    setLoadError(null);
    try {
      restoreBackup(storage, loaded, mode);
      setLoaded(null);
      setInput("");
      after(mode === "replace" ? "Backup restored." : "Backup merged.");
    } catch (e) {
      setLoadError(message(e));
    }
  }

  function wipe() {
    const what = deleteCards ? "study progress, answers, notebook posts, scratchpads, exam date, lecture positions and snipped cards" : "study progress, answers, notebook posts, scratchpads, exam date and lecture positions";
    if (!window.confirm(`Delete your ${what} from this browser? Courses and imported course packs stay. This can't be undone unless you saved a backup first.`)) return;
    setSlateError(null);
    try {
      cleanSlate(storage, { deleteCards });
      after("Clean slate done.");
    } catch (e) {
      setSlateError(message(e));
    }
  }

  return (
    <main className="shell narrow backup">
      <h1>Save / Load</h1>
      <p className="lede">
        Your progress is kept only in this browser. Save it as a string or a file, then load it on another device or after
        clearing your browser. Settings and API keys are never included.
      </p>

      {done && (
        <div className="backup-done" role="status">
          <p>
            <strong>{done}</strong> If a page still shows old progress, reload it.
          </p>
          <button className="small" type="button" onClick={() => window.location.reload()}>
            Reload now
          </button>
        </div>
      )}

      <section className="panel backup-section">
        <h2>Save</h2>
        {current ? <SummaryList s={current} /> : <p className="error">This browser is blocking site storage, so there's nothing to save.</p>}
        <div className="backup-options">
          <div className="backup-option">
            <label className="backup-check">
              <input type="checkbox" checked={cardsInString} onChange={(e) => setCardsInString(e.target.checked)} />
              <span>Include snipped cards in the save string</span>
            </label>
            <button type="button" onClick={copyString} disabled={!current}>
              Copy save string
            </button>
          </div>
          <div className="backup-option">
            <label className="backup-check">
              <input type="checkbox" checked={cardsInFile} onChange={(e) => setCardsInFile(e.target.checked)} />
              <span>Include snipped cards in the file</span>
            </label>
            <button type="button" className="secondary" onClick={downloadFile} disabled={!current}>
              Download backup file
            </button>
          </div>
        </div>
        {sizes && (
          <p className="hint">
            Study data: {formatBytes(sizes.otherBytes)}. Snipped cards: {sizes.cardCount} ({formatBytes(sizes.cardsBytes)}), images make them large, so
            they're left out of the save string unless you tick the box.
          </p>
        )}
        {saveError && <p className="error">{saveError}</p>}
        {saveStatus && <p className="backup-ok">{saveStatus}</p>}
        {saveString && (
          <label className="field">
            <span>Save string</span>
            <textarea className="mono backup-string" readOnly value={saveString} onFocus={(e) => e.currentTarget.select()} />
          </label>
        )}
      </section>

      <section className="panel backup-section">
        <h2>Load</h2>
        <label className="field">
          <span>Paste a save string</span>
          <textarea
            className="mono backup-string"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setLoaded(null);
              setLoadError(null);
            }}
            placeholder="MF1.z.…"
            spellCheck={false}
          />
        </label>
        <div className="actions">
          <button type="button" onClick={() => check(input)} disabled={busy || !input.trim()}>
            {busy ? "Checking…" : "Check save string"}
          </button>
          <label className="button secondary backup-file">
            Upload backup file
            <input type="file" accept=".json,application/json,text/plain" onChange={onFile} />
          </label>
        </div>
        {loadError && <p className="error">{loadError}</p>}
        {loaded && (
          <div className="backup-preview">
            <h3>This backup contains</h3>
            <p className="hint">Saved {new Date(loaded.createdAt).toLocaleString()} · {formatBytes(describeBackup(loaded).bytes)}</p>
            <SummaryList s={describeBackup(loaded)} />
            <fieldset className="backup-modes">
              <legend>How to load it</legend>
              <label className="backup-check">
                <input type="radio" name="backup-mode" checked={mode === "merge"} onChange={() => setMode("merge")} />
                <span>
                  <strong>Merge</strong> with what's here. For each question the more recently reviewed schedule wins; lab steps and skills
                  are combined; the best case score is kept; notebook posts, packs and cards from both are kept. Exam date and scratchpads
                  come from the backup.
                </span>
              </label>
              <label className="backup-check">
                <input type="radio" name="backup-mode" checked={mode === "replace"} onChange={() => setMode("replace")} />
                <span>
                  <strong>Replace</strong> what's here with the backup. Snipped cards stay if the backup doesn't include them.
                </span>
              </label>
            </fieldset>
            <div className="actions">
              <button type="button" onClick={restore}>
                {mode === "merge" ? "Merge backup" : "Replace with backup"}
              </button>
              <button type="button" className="ghost" onClick={() => setLoaded(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="panel backup-section">
        <h2>Clean slate for sharing</h2>
        <p className="hint">
          Clears your answers, progress and review schedules, notebook posts, scratchpads, exam date and lecture positions, so you can
          hand this browser (or a copy of your course packs) to someone else. Courses and imported course packs stay. Settings and API
          keys aren't touched: clear them in Settings if someone else will use this browser.
        </p>
        <label className="backup-check">
          <input type="checkbox" checked={deleteCards} onChange={(e) => setDeleteCards(e.target.checked)} />
          <span>Also delete my snipped cards (otherwise they stay, with their review schedules reset)</span>
        </label>
        {slateError && <p className="error">{slateError}</p>}
        <div className="actions">
          <button type="button" className="danger" onClick={wipe} disabled={!current}>
            Clean slate
          </button>
        </div>
      </section>
    </main>
  );
}
