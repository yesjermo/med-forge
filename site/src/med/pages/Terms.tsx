import { useCallback, useEffect, useState } from "react";
import { GRADES, type ProgressStore } from "../progress";
import { TERMS, type Term, type TermKind } from "../terms";
import { Crumbs, Tabs } from "../ui";
import "../research/research.css";

const KIND_LABEL: Record<TermKind, string> = { prefix: "Prefixes", root: "Roots and combining forms", suffix: "Suffixes" };
const KIND_ONE: Record<TermKind, string> = { prefix: "Prefix", root: "Root", suffix: "Suffix" };
const KINDS: TermKind[] = ["prefix", "root", "suffix"];

const MODES = [["browse", "Browse"], ["practise", "Practise"]] as const;

const progressId = (t: Term) => `term-${t.id}`;
const ALL_IDS = TERMS.map(progressId);
const BY_PROGRESS_ID = new Map(TERMS.map((t) => [progressId(t), t]));

/** Due cards first (oldest due first), then cards never seen. */
function buildQueue(progress: ProgressStore): Term[] {
  const due = progress.due(ALL_IDS);
  const fresh = ALL_IDS.filter((id) => !progress.question(id));
  return [...due, ...fresh].map((id) => BY_PROGRESS_ID.get(id)!);
}

function Browse() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const hits = needle ? TERMS.filter((t) => [t.part, t.meaning, t.example].some((s) => s.toLowerCase().includes(needle))) : TERMS;
  return (
    <section>
      <label className="field">
        <span>Search word parts, meanings or examples</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. kidney, -itis, brady" />
      </label>
      <p className="hint" role="status">
        {hits.length} of {TERMS.length} word parts
      </p>
      <div className="term-groups">
        {KINDS.map((k) => {
          const list = hits.filter((t) => t.kind === k);
          if (!list.length) return null;
          return (
            <div key={k}>
              <h2>
                {KIND_LABEL[k]} <span className="hint">({list.length})</span>
              </h2>
              <ul className="term-list">
                {list.map((t) => (
                  <li key={t.id}>
                    <span className="term-part">{t.part}</span> <span className="term-meaning">{t.meaning}</span>
                    <span className="term-example">{t.example}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {hits.length === 0 && <p className="panel empty-state">No word parts match “{q}”.</p>}
    </section>
  );
}

function Practise({ progress, refresh }: { progress: ProgressStore; refresh: () => void }) {
  const [queue, setQueue] = useState<Term[]>(() => buildQueue(progress));
  const [pos, setPos] = useState(0);
  const [shown, setShown] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const card = queue[pos];

  const counts = progress.counts(ALL_IDS);
  const dueNow = progress.due(ALL_IDS).length;

  const rate = useCallback(
    (grade: number) => {
      if (!card) return;
      progress.grade(progressId(card), grade);
      setReviewed((n) => n + 1);
      setShown(false);
      setPos((p) => p + 1);
      refresh();
    },
    [card, progress, refresh],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey || !card) return;
      if (e.key === " " || e.key === "Enter") {
        // Let Enter/Space activate a focused button normally.
        if (el?.tagName === "BUTTON" || el?.tagName === "A") return;
        e.preventDefault();
        setShown((s) => !s);
      } else if (shown && /^[0-5]$/.test(e.key)) {
        e.preventDefault();
        rate(Number(e.key));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, shown, rate]);

  return (
    <section>
      <div className="term-counts" aria-label="Deck status">
        <span className="tag">{dueNow} due</span>
        <span className="tag">{counts.unattempted} new</span>
        <span className="tag tag-ok">{counts.mastered} mastered</span>
        <span className="tag">{counts.needs_review} learning</span>
      </div>

      {card ? (
        <>
          <p className="hint">
            Card {pos + 1} of {queue.length} · {KIND_ONE[card.kind]}
            {progress.question(progressId(card)) ? " · review" : " · new"}
          </p>
          <div
            className="flashcard"
            tabIndex={0}
            role="group"
            aria-label={shown ? `${card.part}: ${card.meaning}` : `Word part ${card.part}. Meaning hidden.`}
            aria-live="polite"
          >
            <span className="term-part">{card.part}</span>
            {shown && (
              <>
                <span className="term-meaning">{card.meaning}</span>
                <span className="term-example">{card.example}</span>
              </>
            )}
          </div>
          {!shown ? (
            <div className="actions">
              <button type="button" onClick={() => setShown(true)}>
                Show meaning
              </button>
              <span className="hint">
                or press <kbd className="kbd">Space</kbd>
              </span>
            </div>
          ) : (
            <div className="rate">
              <p>How well did you recall it?</p>
              <div className="actions">
                {GRADES.map(([g, label, what]) => (
                  <button key={g} type="button" title={what} className={g === 4 ? "" : "secondary"} onClick={() => rate(g)}>
                    {label} <span className="kbd" aria-hidden="true">{g}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="hint">
            Keyboard: <kbd className="kbd">Space</kbd> or <kbd className="kbd">Enter</kbd> flips the card, <kbd className="kbd">0</kbd>–
            <kbd className="kbd">5</kbd> rate it.
          </p>
        </>
      ) : (
        <div className="panel empty-state">
          <p>{reviewed ? `Session done: ${reviewed} card${reviewed === 1 ? "" : "s"} reviewed.` : "Nothing due right now."}</p>
          <p className="hint">Cards you rated come back when they are due. Check in tomorrow.</p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setQueue(buildQueue(progress));
                setPos(0);
                setShown(false);
                setReviewed(0);
              }}
            >
              Check for due cards
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Medical word parts: browse the list, or practise them as spaced-review flashcards. */
export function Terms({ progress, refresh }: { progress: ProgressStore; refresh: () => void }) {
  const [mode, setMode] = useState<(typeof MODES)[number][0]>("browse");
  return (
    <main className="shell narrow">
      <Crumbs here="Medical terminology" />
      <h1>Medical terminology</h1>
      <p className="lede">
        {TERMS.length} prefixes, roots and suffixes. Most medical words are built from these parts, so learning them lets you decode
        terms you have never seen.
      </p>
      <Tabs id="terms" label="Mode" tabs={MODES} value={mode} onChange={setMode}>
        {mode === "browse" ? <Browse /> : <Practise progress={progress} refresh={refresh} />}
      </Tabs>
    </main>
  );
}
