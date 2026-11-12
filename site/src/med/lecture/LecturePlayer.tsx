import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { InsightType, Lecture, LectureChapter, LectureInsight } from "../types";
import { MedText } from "../ui";
import { formatTime, parseTimestamp } from "./transcript";
import "./lecture.css";

/**
 * Lecture audio with synced notes. A plain <audio preload="metadata"> streams the recording with
 * HTTP Range requests (206 Partial Content), so only what is played is fetched. A local file is
 * played through an object URL and never leaves the device.
 */

export const INSIGHT_LABEL: Record<InsightType, string> = { exam_tip: "Exam tip", clinical_link: "Clinical link", intuition: "Intuition" };
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const POS_PREFIX = "study-forge:lecture-pos:";
const RATE_KEY = "study-forge:lecture-rate";

function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStore(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked or full: the player still works, it just won't remember.
  }
}

type Item = { kind: "chapter"; at: number; index: number; chapter: LectureChapter } | { kind: "insight"; at: number; index: number; insight: LectureInsight };

export interface LecturePlayerProps {
  /** Recording URL (http(s)). Without one, the student is asked to pick a file. */
  src?: string;
  /** Remembers the playback position under this key (e.g. "course-id/lecture-id"). */
  storageKey: string;
  title: string;
  chapters?: LectureChapter[];
  insights: LectureInsight[];
  /** Editing mode (import review): change or delete items, add a point at the current time. */
  onInsightsChange?: (next: LectureInsight[]) => void;
  onChaptersChange?: (next: LectureChapter[]) => void;
  /** Called with the object URL's File when the student picks a local recording. */
  onLocalFile?: (file: File | null) => void;
}

export function LecturePlayer({ src, storageKey, title, chapters = [], insights, onInsightsChange, onChaptersChange, onLocalFile }: LecturePlayerProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [localName, setLocalName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(() => {
    const r = Number(readStore(RATE_KEY));
    return SPEEDS.includes(r) ? r : 1;
  });
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const lastSaved = useRef(0);
  const editable = Boolean(onInsightsChange);
  const source = localUrl ?? src ?? null;

  useEffect(() => () => void (localUrl && URL.revokeObjectURL(localUrl)), [localUrl]);
  useEffect(() => {
    setError(null);
    setTime(0);
    setDuration(0);
    setPlaying(false);
  }, [source]);

  const items = useMemo<Item[]>(() => {
    const xs: Item[] = [
      ...chapters.map((chapter, index) => ({ kind: "chapter" as const, at: chapter.at, index, chapter })),
      ...insights.flatMap((insight, index) => (insight.at === undefined ? [] : [{ kind: "insight" as const, at: insight.at, index, insight }])),
    ];
    // Chapters sort before insights at the same second.
    return xs.sort((a, b) => a.at - b.at || (a.kind === b.kind ? a.index - b.index : a.kind === "chapter" ? -1 : 1));
  }, [chapters, insights]);

  const span = duration || Math.max(1, ...items.map((x) => x.at + 1));
  const currentIdx = useMemo(() => {
    let k = -1;
    items.forEach((x, i) => {
      if (x.at <= time + 0.25) k = i;
    });
    return k;
  }, [items, time]);
  const keyOf = (x: Item) => `${x.kind}-${x.index}`;

  // Keep the current item visible inside the notes list (scrolls the list, not the page).
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !el || !playing) return;
    const top = el.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = Math.max(0, top - 8);
  }, [currentIdx, playing]);

  const savePos = useCallback(
    (t: number, force = false) => {
      if (!force && Math.abs(t - lastSaved.current) < 5) return;
      lastSaved.current = t;
      writeStore(POS_PREFIX + storageKey, String(Math.floor(t)));
    },
    [storageKey],
  );

  const seek = (t: number) => {
    const a = audio.current;
    if (!a) return;
    const to = Math.max(0, Math.min(t, a.duration || t));
    a.currentTime = to;
    setTime(to);
    savePos(to, true);
  };

  const toggle = async () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("The browser wouldn't start playback. Try pressing play again.");
      }
    } else a.pause();
  };

  function onMeta() {
    const a = audio.current;
    if (!a) return;
    setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    a.playbackRate = rate;
    const saved = Number(readStore(POS_PREFIX + storageKey));
    if (saved > 0 && (!Number.isFinite(a.duration) || saved < a.duration - 5)) {
      a.currentTime = saved;
      setTime(saved);
    }
  }

  function pickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLocalUrl(URL.createObjectURL(file));
    setLocalName(file.name);
    onLocalFile?.(file);
  }

  function clearFile() {
    setLocalUrl(null);
    setLocalName("");
    setPlaying(false);
    onLocalFile?.(null);
  }

  const changeRate = (r: number) => {
    setRate(r);
    if (audio.current) audio.current.playbackRate = r;
    writeStore(RATE_KEY, String(r));
  };

  const updateInsight = (i: number, next: LectureInsight | null) =>
    onInsightsChange?.(next ? insights.map((x, k) => (k === i ? next : x)) : insights.filter((_, k) => k !== i));
  const updateChapter = (i: number, next: LectureChapter | null) => {
    const list = next ? chapters.map((x, k) => (k === i ? next : x)) : chapters.filter((_, k) => k !== i);
    onChaptersChange?.([...list].sort((a, b) => a.at - b.at));
  };

  return (
    <section className="lp" aria-label={`Recording: ${title}`}>
      {source ? (
        <audio
          ref={audio}
          src={source}
          preload="metadata"
          onLoadedMetadata={onMeta}
          onDurationChange={() => audio.current && Number.isFinite(audio.current.duration) && setDuration(audio.current.duration)}
          onTimeUpdate={() => {
            const t = audio.current?.currentTime ?? 0;
            setTime(t);
            savePos(t);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => {
            setPlaying(false);
            savePos(audio.current?.currentTime ?? 0, true);
          }}
          onEnded={() => setPlaying(false)}
          onError={() =>
            setError(
              localUrl
                ? "This browser can't play that file. Try an .mp3, .m4a or .ogg export."
                : "Couldn't load the recording. The link may need a login (Echo360 and most lecture-capture sites do) or the format isn't supported. Download the audio if your university allows it and pick the file instead.",
            )
          }
        />
      ) : null}

      <div className="lp-source">
        {localUrl ? (
          <p className="hint">
            Playing <strong>{localName}</strong> from this device.{" "}
            <button type="button" className="secondary small" onClick={clearFile}>
              {src ? "Use the lecture's recording" : "Remove file"}
            </button>
          </p>
        ) : (
          <label className="lp-file">
            <span className="secondary small button-like">{src ? "Play a file from this device instead" : "Choose an audio file"}</span>
            <input type="file" accept="audio/*,video/mp4,.m4a,.mp3,.ogg,.oga,.opus,.wav,.webm,.aac,.flac" onChange={pickFile} />
          </label>
        )}
      </div>

      {source && (
        <>
          <div className="lp-controls">
            <button type="button" onClick={() => seek(time - 15)} aria-label="Back 15 seconds" className="secondary small">
              −15 s
            </button>
            <button type="button" onClick={toggle} className="lp-play" aria-label={playing ? "Pause" : "Play"}>
              {playing ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={() => seek(time + 15)} aria-label="Forward 15 seconds" className="secondary small">
              +15 s
            </button>
            <span className="lp-time" aria-hidden="true">
              {formatTime(time)} / {duration ? formatTime(duration) : "–:––"}
            </span>
            <label className="lp-speed">
              <span className="sr-only">Playback speed</span>
              <select value={rate} onChange={(e) => changeRate(Number(e.target.value))}>
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>
                    {s}×
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="lp-seek">
            <div className="lp-markers" aria-hidden="true">
              {items.map((x) => (
                <span
                  key={keyOf(x)}
                  className={`lp-marker ${x.kind === "chapter" ? "chapter" : x.insight.type}`}
                  style={{ left: `${Math.min(100, (x.at / span) * 100)}%` }}
                  title={`${formatTime(x.at)} ${x.kind === "chapter" ? x.chapter.title : INSIGHT_LABEL[x.insight.type]}`}
                />
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(duration))}
              step={1}
              value={Math.min(Math.floor(time), Math.max(1, Math.floor(duration)))}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Position in recording"
              aria-valuetext={`${formatTime(time)} of ${duration ? formatTime(duration) : "unknown length"}`}
              disabled={!duration}
            />
          </div>
          {error && (
            <p className="lp-error" role="alert">
              {error}
            </p>
          )}
        </>
      )}

      {(items.length > 0 || editable) && (
        <div className="lp-notes">
          <div className="lp-notes-head">
            <h3>Synced notes</h3>
            {editable && source && (
              <span className="lp-add">
                <button
                  type="button"
                  className="secondary small"
                  onClick={() => {
                    onInsightsChange?.([...insights, { type: "exam_tip", text: "New point", at: Math.floor(time) }]);
                    setEditing(`insight-${insights.length}`);
                  }}
                >
                  Add point at {formatTime(time)}
                </button>
                <button
                  type="button"
                  className="secondary small"
                  onClick={() => {
                    const next = [...chapters, { at: Math.floor(time), title: "New chapter" }].sort((a, b) => a.at - b.at);
                    onChaptersChange?.(next);
                  }}
                >
                  Add chapter
                </button>
              </span>
            )}
          </div>
          {items.length === 0 ? (
            <p className="hint">No timed notes yet.</p>
          ) : (
            <ol className="lp-list" ref={listRef}>
              {items.map((x, i) => {
                const key = keyOf(x);
                const current = i === currentIdx;
                return (
                  <li key={key} className={`lp-item ${x.kind === "chapter" ? "chapter" : `insight ${x.insight.type}`}`} aria-current={current ? "true" : undefined}>
                    {editing === key && editable ? (
                      <ItemEditor
                        item={x}
                        onCancel={() => setEditing(null)}
                        onSave={(next) => {
                          if (x.kind === "chapter") updateChapter(x.index, next as LectureChapter);
                          else updateInsight(x.index, next as LectureInsight);
                          setEditing(null);
                        }}
                      />
                    ) : (
                      <>
                        <button type="button" className="lp-jump" onClick={() => seek(x.at)} disabled={!source} aria-label={`Play from ${formatTime(x.at)}`}>
                          {formatTime(x.at)}
                        </button>
                        <span className="lp-text">
                          {x.kind === "chapter" ? (
                            <strong>
                              <MedText text={x.chapter.title} inline />
                            </strong>
                          ) : (
                            <>
                              <span className="tag">{INSIGHT_LABEL[x.insight.type]}</span> <MedText text={x.insight.text} inline />
                            </>
                          )}
                        </span>
                        {editable && (
                          <span className="lp-item-actions">
                            <button type="button" className="secondary small" onClick={() => setEditing(key)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="danger small"
                              aria-label={`Delete ${x.kind} at ${formatTime(x.at)}`}
                              onClick={() => (x.kind === "chapter" ? updateChapter(x.index, null) : updateInsight(x.index, null))}
                            >
                              Delete
                            </button>
                          </span>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
      <p className="hint lp-hint">
        Recordings stream: the browser asks for just the part you're listening to (HTTP range requests), so a long
        lecture is never downloaded in full. Files you pick stay on this device.
      </p>
    </section>
  );
}

function ItemEditor({ item, onSave, onCancel }: { item: Item; onSave: (next: LectureChapter | LectureInsight) => void; onCancel: () => void }) {
  const [at, setAt] = useState(formatTime(item.at));
  const [text, setText] = useState(item.kind === "chapter" ? item.chapter.title : item.insight.text);
  const [type, setType] = useState<InsightType>(item.kind === "insight" ? item.insight.type : "exam_tip");
  const seconds = /^\d+(\.\d+)?$/.test(at.trim()) ? Number(at) : parseTimestamp(at);
  const ok = Number.isFinite(seconds) && seconds >= 0 && text.trim() !== "";
  return (
    <form
      className="lp-edit"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        const t = Math.floor(seconds);
        onSave(item.kind === "chapter" ? { at: t, title: text.trim() } : { ...item.insight, type, text: text.trim(), at: t });
      }}
    >
      <label className="field lp-edit-time">
        <span>Time</span>
        <input value={at} onChange={(e) => setAt(e.target.value)} inputMode="numeric" aria-invalid={!Number.isFinite(seconds)} />
      </label>
      {item.kind === "insight" && (
        <label className="field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as InsightType)}>
            {(Object.keys(INSIGHT_LABEL) as InsightType[]).map((t) => (
              <option key={t} value={t}>
                {INSIGHT_LABEL[t]}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="field lp-edit-text">
        <span>{item.kind === "chapter" ? "Title" : "Text"}</span>
        {item.kind === "chapter" ? <input value={text} onChange={(e) => setText(e.target.value)} /> : <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} />}
      </label>
      <span className="lp-item-actions">
        <button type="submit" className="small" disabled={!ok}>
          Save
        </button>
        <button type="button" className="secondary small" onClick={onCancel}>
          Cancel
        </button>
      </span>
    </form>
  );
}

/**
 * The recording block of a lecture page: the player when the lecture has `audio`, otherwise an
 * "Add a recording" button that opens the player with a local file picker.
 */
export function LectureRecording({ courseId, lecture }: { courseId: string; lecture: Lecture }) {
  const [open, setOpen] = useState(false);
  const timed = Boolean(lecture.chapters?.length || lecture.insights.some((i) => i.at !== undefined));
  if (!lecture.audio && !open) {
    return (
      <div className="lp-add-recording">
        <button type="button" className="secondary small" onClick={() => setOpen(true)}>
          Add a recording
        </button>
        <span className="hint">{timed ? " Play your copy of this lecture with its timed notes." : " Listen to your copy of this lecture next to the notes."}</span>
      </div>
    );
  }
  return (
    <LecturePlayer
      {...(lecture.audio ? { src: lecture.audio } : {})}
      storageKey={`${courseId}/${lecture.id}`}
      title={lecture.title}
      chapters={lecture.chapters ?? []}
      insights={lecture.insights}
    />
  );
}
