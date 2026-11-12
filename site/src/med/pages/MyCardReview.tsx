import { useEffect, useState } from "react";
import type { MyCard } from "../mycards";
import { GRADES } from "../progress";
import "./import.css";

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * One snipped card in review: the question crop (+ note), "Show answer", then a 0–5 self-grade.
 * Keys: Space/Enter shows the answer, 0–5 grade once it's shown.
 */
export function MyCardFace({ card, onGrade }: { card: MyCard; onGrade: (g: number) => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(false), [card.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
      if (!shown && (e.key === " " || e.key === "Enter")) {
        // Let a focused button handle its own Enter/Space.
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;
        e.preventDefault();
        setShown(true);
      } else if (shown && /^[0-5]$/.test(e.key)) {
        e.preventDefault();
        onGrade(Number(e.key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown, onGrade]);

  const hasAnswer = Boolean(card.answer || card.back);

  return (
    <article className="panel mycard" aria-label={card.title}>
      <header className="mycard-head">
        <h2>{card.title}</h2>
        <span className="hint">
          {[card.course, card.source].filter(Boolean).join(" · ")}
        </span>
      </header>
      <img className="mycard-img" src={card.front} alt={`Question: ${card.title}`} />
      {card.frontNote && <p className="mycard-note">{card.frontNote}</p>}

      {!shown ? (
        <div className="actions mycard-reveal">
          <button type="button" onClick={() => setShown(true)}>
            Show answer
          </button>
          <span className="hint">
            <kbd>Space</kbd>
          </span>
        </div>
      ) : (
        <>
          <div className="mycard-answer" role="region" aria-label="Answer">
            {hasAnswer ? (
              <>
                {card.answer && <p className="mycard-answer-text">{card.answer}</p>}
                {card.back && <img className="mycard-img" src={card.back} alt={`Answer: ${card.title}`} />}
              </>
            ) : (
              <p className="hint">No answer saved for this card. Check it against your notes or the mark scheme.</p>
            )}
          </div>
          <div className="mycard-rate">
            <p>How well did you do? This schedules the next review.</p>
            <div className="mycard-grades" role="group" aria-label="Grade your answer">
              {GRADES.map(([g, label, what]) => (
                <button key={g} type="button" title={what} className={`secondary mycard-grade g${g}`} onClick={() => onGrade(g)} aria-keyshortcuts={String(g)}>
                  <kbd aria-hidden>{g}</kbd> {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
