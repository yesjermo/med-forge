import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { createMyCards, MyCardsFullError, type MyCard } from "../mycards";
import { PDF_SUPPORTED, cropToDataUrl, dataUrlKb, fitCanvas, openPdf, type Rect } from "../snip";
import { Crumbs } from "../ui";
import "./import.css";

type Doc =
  | { kind: "pdf"; name: string; pdf: PDFDocumentProxy; pages: number }
  | { kind: "image"; name: string; image: HTMLImageElement };

interface Draft {
  front: string;
  back?: string;
  source: string;
  title: string;
  note: string;
  answer: string;
}

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type Drag =
  | { kind: "new"; x0: number; y0: number }
  | { kind: "move"; dx: number; dy: number }
  | { kind: "resize"; handle: Handle; start: Rect };

const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const MIN = 0.01;

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

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

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const stem = (name: string) => name.replace(/\.[^.]+$/, "");
const isPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);

function fromPoints(x0: number, y0: number, x1: number, y1: number): Rect {
  return { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) };
}

function dueLabel(card: MyCard, now: number): string {
  if (card.sm2.due <= now) return "Due now";
  return `Due ${new Date(card.sm2.due).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } catch {
    throw new Error(`This browser can't open ${file.name}. Try a PNG or JPEG screenshot.`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * #/import: open a past paper or tutorial sheet (PDF or image), drag a box over a problem and
 * save the crop as a personal review card. Everything stays in this browser.
 */
export function ImportPage({ refresh }: { refresh: () => void }) {
  const [store] = useState(() => createMyCards(browserStorage()));
  const [version, setVersion] = useState(0);
  const cards = useMemo(() => store.list(), [store, version]);
  const courses = useMemo(() => [...new Set(cards.map((c) => c.course).filter(Boolean))].sort(), [cards]);

  const [doc, setDoc] = useState<Doc | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [stageWidth, setStageWidth] = useState(0);
  const [pageSize, setPageSize] = useState<{ w: number; h: number } | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [mode, setMode] = useState<"question" | "answer">("question");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [course, setCourse] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const drag = useRef<Drag | null>(null);
  const renderChain = useRef<Promise<unknown>>(Promise.resolve());
  const docRef = useRef<Doc | null>(null);

  // Release the PDF when it's replaced or the page closes.
  useEffect(() => {
    docRef.current = doc;
  }, [doc]);
  useEffect(() => () => void (docRef.current?.kind === "pdf" && docRef.current.pdf.loadingTask.destroy()), []);

  const openFile = useCallback(async (file: File) => {
    setError(null);
    setMessage(null);
    try {
      let next: Doc;
      if (isPdf(file)) {
        setBusy("Opening the PDF…");
        const pdf = await openPdf(await file.arrayBuffer());
        next = { kind: "pdf", name: file.name, pdf, pages: pdf.numPages };
      } else if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|avif|bmp|heic)$/i.test(file.name)) {
        setBusy("Opening the image…");
        next = { kind: "image", name: file.name || "Pasted screenshot", image: await loadImage(file) };
      } else {
        throw new Error("Choose a PDF or an image (PNG, JPEG, WebP or a screenshot).");
      }
      const prev = docRef.current;
      if (prev?.kind === "pdf") void prev.pdf.loadingTask.destroy();
      setDoc(next);
      setPageNo(1);
      setZoom(1);
      setRect(null);
    } catch (e) {
      setError((e as Error).message || "Couldn't open that file.");
    } finally {
      setBusy(null);
    }
  }, []);

  // Paste a screenshot anywhere on the page (text pastes into the form still work normally).
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === "file" && i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (!file) return;
      e.preventDefault();
      const ext = file.type.split("/")[1] ?? "png";
      void openFile(new File([file], `Screenshot ${new Date().toLocaleString()}.${ext}`, { type: file.type }));
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [openFile]);

  // Track the stage width so "fit width" follows the layout.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry?.contentRect.width ?? 0);
      setStageWidth((prev) => (Math.abs(prev - w) > 4 ? w : prev));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc]);

  // Render the current page (or image) into the canvas at ≥2× its on-screen size, so crops stay sharp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!doc || !canvas || stageWidth <= 0) return;
    let cancelled = false;
    let task: RenderTask | null = null;
    const cssWidth = Math.max(160, stageWidth * zoom);
    const ratio = Math.max(2, window.devicePixelRatio || 1);

    const run = async () => {
      if (cancelled) return;
      setRendering(true);
      try {
        if (doc.kind === "image") {
          const { naturalWidth: w, naturalHeight: h } = doc.image;
          const s = fitCanvas(w, h);
          canvas.width = Math.max(1, Math.round(w * s));
          canvas.height = Math.max(1, Math.round(h * s));
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(doc.image, 0, 0, canvas.width, canvas.height);
          setPageSize({ w: cssWidth, h: (cssWidth * h) / w });
          return;
        }
        const page = await doc.pdf.getPage(pageNo);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const want = (cssWidth / base.width) * ratio;
        const scale = want * fitCanvas(base.width * want, base.height * want);
        const viewport = page.getViewport({ scale });
        // Draw off-screen, then copy, so the old page stays visible while the new one renders.
        const off = document.createElement("canvas");
        off.width = Math.floor(viewport.width);
        off.height = Math.floor(viewport.height);
        task = page.render({ canvas: off, viewport });
        await task.promise;
        if (cancelled) return;
        canvas.width = off.width;
        canvas.height = off.height;
        canvas.getContext("2d")?.drawImage(off, 0, 0);
        setPageSize({ w: cssWidth, h: (cssWidth * base.height) / base.width });
      } catch (e) {
        if (!cancelled && (e as { name?: string }).name !== "RenderingCancelledException") {
          setError(`Couldn't draw page ${pageNo}: ${(e as Error).message}`);
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    };
    renderChain.current = renderChain.current.then(run, run);
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNo, zoom, stageWidth]);

  // ── cropping ────────────────────────────────────────────────────────────
  const point = (e: PointerEvent) => {
    const box = overlayRef.current!.getBoundingClientRect();
    return { x: clamp((e.clientX - box.left) / box.width), y: clamp((e.clientY - box.top) / box.height) };
  };

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const p = point(e);
    const target = e.target as HTMLElement;
    const handle = target.dataset.handle as Handle | undefined;
    if (handle && rect) drag.current = { kind: "resize", handle, start: rect };
    else if (rect && target.closest(".snip-box")) drag.current = { kind: "move", dx: p.x - rect.x, dy: p.y - rect.y };
    else {
      drag.current = { kind: "new", x0: p.x, y0: p.y };
      setRect({ x: p.x, y: p.y, w: 0, h: 0 });
    }
    overlayRef.current!.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const p = point(e);
    if (d.kind === "new") setRect(fromPoints(d.x0, d.y0, p.x, p.y));
    else if (d.kind === "move") setRect((r) => r && { ...r, x: clamp(p.x - d.dx, 0, 1 - r.w), y: clamp(p.y - d.dy, 0, 1 - r.h) });
    else {
      const s = d.start;
      let [l, t, r, b] = [s.x, s.y, s.x + s.w, s.y + s.h];
      if (d.handle.includes("w")) l = p.x;
      if (d.handle.includes("e")) r = p.x;
      if (d.handle.includes("n")) t = p.y;
      if (d.handle.includes("s")) b = p.y;
      setRect(fromPoints(l, t, r, b));
    }
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = null;
    overlayRef.current?.releasePointerCapture(e.pointerId);
    setRect((r) => (r && (r.w < MIN || r.h < MIN) ? null : r));
    requestAnimationFrame(() => boxRef.current?.focus({ preventScroll: true }));
  }

  /** Arrows move the box; Shift moves further; Alt/Option + arrows resize; Enter crops; Esc clears. */
  function onBoxKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!rect || !pageSize) return;
    const px = e.shiftKey ? 20 : 2;
    const sx = px / pageSize.w;
    const sy = px / pageSize.h;
    const dirs: Record<string, [number, number]> = { ArrowLeft: [-sx, 0], ArrowRight: [sx, 0], ArrowUp: [0, -sy], ArrowDown: [0, sy] };
    const d = dirs[e.key];
    if (d) {
      e.preventDefault();
      if (e.altKey) {
        setRect({ ...rect, w: clamp(rect.w + d[0], MIN, 1 - rect.x), h: clamp(rect.h + d[1], MIN, 1 - rect.y) });
      } else {
        setRect({ ...rect, x: clamp(rect.x + d[0], 0, 1 - rect.w), y: clamp(rect.y + d[1], 0, 1 - rect.h) });
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      takeCrop();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setRect(null);
      overlayRef.current?.focus();
    }
  }

  function onStageKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || rect) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRect({ x: 0.1, y: 0.1, w: 0.8, h: 0.25 });
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }

  const source = doc ? (doc.kind === "pdf" ? `${doc.name}, p. ${pageNo}` : doc.name) : "";

  function takeCrop() {
    const canvas = canvasRef.current;
    if (!rect || !canvas || !doc) return;
    let url: string;
    try {
      url = cropToDataUrl(canvas, rect);
    } catch (e) {
      setError((e as Error).message);
      return;
    }
    setError(null);
    setMessage(null);
    if (mode === "answer" && draft) {
      setDraft({ ...draft, back: url });
      setMode("question");
    } else {
      const title = draft?.title || (doc.kind === "pdf" ? `${stem(doc.name)}, p. ${pageNo}` : stem(doc.name));
      setDraft({ front: url, source, title, note: draft?.note ?? "", answer: draft?.answer ?? "", back: draft?.back });
    }
    setRect(null);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }

  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    try {
      const card = store.add({
        title: draft.title.trim() || "Untitled question",
        course,
        front: draft.front,
        source: draft.source,
        ...(draft.note.trim() ? { frontNote: draft.note.trim() } : {}),
        ...(draft.answer.trim() ? { answer: draft.answer.trim() } : {}),
        ...(draft.back ? { back: draft.back } : {}),
      });
      setDraft(null);
      setMode("question");
      setMessage({ ok: true, text: `Saved “${card.title}”. It's due for review now.` });
      setVersion((v) => v + 1);
      refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof MyCardsFullError ? err.message : `Couldn't save: ${(err as Error).message}` });
    }
  }

  function remove(card: MyCard) {
    if (!window.confirm(`Delete “${card.title}”? Its review history goes too. This can't be undone.`)) return;
    store.remove(card.id);
    setVersion((v) => v + 1);
    refresh();
  }

  async function onImportCards(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const n = store.importJson(await file.text());
      setMessage({ ok: true, text: n ? `Imported ${n} card${n === 1 ? "" : "s"} from ${file.name}.` : `Every card in ${file.name} is already here.` });
      setVersion((v) => v + 1);
      refresh();
    } catch (err) {
      setMessage({ ok: false, text: `Couldn't import ${file.name}: ${(err as Error).message}` });
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void openFile(file);
  }

  const usedKb = useMemo(() => cards.reduce((n, c) => n + dataUrlKb(c.front) + (c.back ? dataUrlKb(c.back) : 0), 0), [cards]);
  const now = Date.now();

  return (
    <main className="shell snip-page-wrap">
      <Crumbs here="Question snipper" />
      <h1>Question snipper</h1>
      <p className="hint snip-lede">
        Open a past exam or tutorial sheet, drag a box over one problem and save it as a review card. Files are read in this
        browser and never uploaded.
      </p>

      <div
        className={`snip-drop${dragOver ? " over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <label className="button">
          {PDF_SUPPORTED ? "Choose a PDF or image" : "Choose an image"}
          <input
            type="file"
            accept={PDF_SUPPORTED ? "application/pdf,.pdf,image/*" : "image/*"}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void openFile(f);
            }}
          />
        </label>
        <span className="hint">or drop a file here, or paste a screenshot (Ctrl/⌘ V)</span>
        {busy && <span className="pulse">{busy}</span>}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {doc && (
        <section className="panel snip-viewer" aria-label="Page">
          <div className="snip-toolbar">
            <span className="snip-name" title={doc.name}>
              {doc.name}
            </span>
            {doc.kind === "pdf" && (
              <span className="actions snip-pages">
                <button type="button" className="secondary small" disabled={pageNo <= 1} onClick={() => (setPageNo((p) => p - 1), setRect(null))}>
                  ‹ Prev
                </button>
                <label className="snip-pageno">
                  <span className="sr-only">Page</span>
                  <input
                    type="number"
                    min={1}
                    max={doc.pages}
                    value={pageNo}
                    onChange={(e) => {
                      const n = Math.round(Number(e.target.value));
                      if (n >= 1 && n <= doc.pages) (setPageNo(n), setRect(null));
                    }}
                  />
                  <span aria-hidden> / {doc.pages}</span>
                  <span className="sr-only"> of {doc.pages}</span>
                </label>
                <button type="button" className="secondary small" disabled={pageNo >= doc.pages} onClick={() => (setPageNo((p) => p + 1), setRect(null))}>
                  Next ›
                </button>
              </span>
            )}
            <span className="actions snip-zoom">
              <button type="button" className="secondary small" aria-label="Zoom out" disabled={zoom <= ZOOMS[0]!} onClick={() => setZoom((z) => [...ZOOMS].reverse().find((s) => s < z) ?? z)}>
                −
              </button>
              <span className="snip-zoom-label" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              <button type="button" className="secondary small" aria-label="Zoom in" disabled={zoom >= ZOOMS[ZOOMS.length - 1]!} onClick={() => setZoom((z) => ZOOMS.find((s) => s > z) ?? z)}>
                +
              </button>
              <button type="button" className="ghost small" disabled={zoom === 1} onClick={() => setZoom(1)}>
                Fit width
              </button>
            </span>
          </div>

          {mode === "answer" && (
            <div className="snip-mode" role="status">
              <span>
                <strong>Answer crop:</strong> drag a box over the answer (any page), then press <em>Use as answer</em>.
              </span>
              <button type="button" className="ghost small" onClick={() => setMode("question")}>
                Cancel
              </button>
            </div>
          )}

          <div className="snip-stage" ref={stageRef}>
            <div className="snip-sheet" style={pageSize ? { width: pageSize.w, height: pageSize.h } : undefined}>
              <canvas ref={canvasRef} className="snip-canvas" />
              <div
                ref={overlayRef}
                className="snip-overlay"
                tabIndex={0}
                role="application"
                aria-label={rect ? "Page. A crop box is placed." : "Page. Drag to draw a crop box, or press Enter to place one."}
                onKeyDown={onStageKey}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {rect && (
                  <div
                    ref={boxRef}
                    className="snip-box"
                    tabIndex={0}
                    role="group"
                    aria-label={`Crop box at ${Math.round(rect.x * 100)}%, ${Math.round(rect.y * 100)}%, ${Math.round(rect.w * 100)}% by ${Math.round(rect.h * 100)}%. Arrows move it, Alt and arrows resize it, Enter uses it, Escape removes it.`}
                    style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` }}
                    onKeyDown={onBoxKey}
                  >
                    {HANDLES.map((h) => (
                      <span key={h} className={`snip-handle h-${h}`} data-handle={h} aria-hidden />
                    ))}
                  </div>
                )}
              </div>
              {rendering && <span className="pulse snip-rendering">Drawing…</span>}
            </div>
          </div>

          <div className="snip-actions">
            <p className="hint">
              Drag over the problem (mouse, finger or pen). Drag the corners to adjust; with the box focused, arrows move it and
              Alt/Option + arrows resize it.
            </p>
            <div className="actions">
              <button type="button" disabled={!rect} onClick={takeCrop}>
                {mode === "answer" ? "Use as answer" : draft ? "Replace question crop" : "Use as question"}
              </button>
              {rect && (
                <button type="button" className="ghost small" onClick={() => setRect(null)}>
                  Clear box
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {draft && (
        <form className="panel snip-form" ref={formRef} onSubmit={save} aria-label="New card">
          <h2>New card</h2>
          <div className="snip-previews">
            <figure>
              <img src={draft.front} alt="Question crop" />
              <figcaption className="hint">
                Question · {dataUrlKb(draft.front)} KB
              </figcaption>
            </figure>
            {draft.back && (
              <figure>
                <img src={draft.back} alt="Answer crop" />
                <figcaption className="hint">
                  Answer · {dataUrlKb(draft.back)} KB{" "}
                  <button type="button" className="ghost small" onClick={() => setDraft({ ...draft, back: undefined })}>
                    Remove
                  </button>
                </figcaption>
              </figure>
            )}
          </div>
          <div className="row">
            <label className="field">
              Title
              <input value={draft.title} required maxLength={160} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </label>
            <label className="field">
              Course
              <input value={course} list="snip-courses" placeholder="e.g. Pharmacology" maxLength={120} onChange={(e) => setCourse(e.target.value)} />
              <datalist id="snip-courses">
                {courses.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
          </div>
          <label className="field">
            <span>
              Note <small className="hint">(optional, shown with the question)</small>
            </span>
            <textarea className="snip-short" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
          </label>
          <label className="field">
            <span>
              Answer <small className="hint">(optional)</small>
            </span>
            <textarea className="snip-short" value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
          </label>
          <p className="hint">From {draft.source}</p>
          <div className="actions">
            <button type="submit">Save card</button>
            <button type="button" className="secondary" disabled={mode === "answer"} onClick={() => (setMode("answer"), setRect(null))}>
              {draft.back ? "Re-crop the answer" : "Crop the answer too"}
            </button>
            <button type="button" className="ghost" onClick={() => (setDraft(null), setMode("question"))}>
              Discard
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className={message.ok ? "snip-ok" : "error"} role={message.ok ? "status" : "alert"}>
          {message.text}
        </p>
      )}

      <section className="panel snip-saved" aria-labelledby="snip-saved-h">
        <div className="result-head">
          <h2 id="snip-saved-h">Your cards ({cards.length})</h2>
          <div className="actions">
            <button type="button" className="secondary small" disabled={!cards.length} onClick={() => download(`study-forge-my-cards-${new Date().toISOString().slice(0, 10)}.json`, store.exportJson())}>
              Export
            </button>
            <label className="button secondary small snip-file-btn">
              Import
              <input type="file" accept="application/json,.json" className="sr-only" onChange={onImportCards} />
            </label>
          </div>
        </div>
        {cards.length ? (
          <>
            <p className="hint">About {usedKb >= 1024 ? `${(usedKb / 1024).toFixed(1)} MB` : `${usedKb} KB`} of images. Browsers keep roughly 5 MB per site, so export now and then.</p>
            <ul className="snip-list">
              {cards.map((c) => (
                <li key={c.id}>
                  <img src={c.front} alt="" loading="lazy" />
                  <div className="snip-meta">
                    <strong>{c.title}</strong>
                    <span className="hint">
                      {c.course || "No course"} · {dueLabel(c, now)}
                      {c.back || c.answer ? " · has answer" : ""}
                    </span>
                  </div>
                  <button type="button" className="danger small" onClick={() => remove(c)} aria-label={`Delete ${c.title}`}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="hint">No cards yet. Saved crops show up here and in your daily review.</p>
        )}
      </section>
    </main>
  );
}
