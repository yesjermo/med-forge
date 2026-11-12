import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  createScratchStore,
  denormalise,
  eraseAt,
  normalisePoint,
  scaledSize,
  THIN_DISTANCE,
  type ScratchStore,
  type Stroke,
  type Tool,
} from "./strokes";
import "./scratchpad.css";

/** Swatch ids; each maps to a CSS custom property tuned for light and dark themes. */
const SWATCHES = [
  { id: "ink", label: "Ink" },
  { id: "blue", label: "Blue" },
  { id: "red", label: "Red" },
  { id: "green", label: "Green" },
  { id: "amber", label: "Amber" },
  { id: "violet", label: "Violet" },
] as const;

const SIZES = [
  { id: "s", label: "Thin", pen: 2, highlighter: 14, eraser: 6 },
  { id: "m", label: "Medium", pen: 4, highlighter: 22, eraser: 12 },
  { id: "l", label: "Thick", pen: 8, highlighter: 34, eraser: 22 },
] as const;

type SizeId = (typeof SIZES)[number]["id"];

const TOOL_LABELS: Record<Tool, string> = { pen: "Pen", highlighter: "Highlighter", eraser: "Eraser" };
const HIGHLIGHT_ALPHA = 0.32;
const SAVE_DELAY = 400;
const MAX_HISTORY = 100;

let sharedStore: ScratchStore | null = null;
function getStore(): ScratchStore {
  if (!sharedStore) {
    let storage: Storage | null = null;
    try {
      storage = typeof window !== "undefined" ? window.localStorage : null;
    } catch {
      storage = null;
    }
    sharedStore = createScratchStore(storage);
  }
  return sharedStore;
}

/** Resolve a swatch id (or raw CSS colour) to a colour string for the canvas. */
function resolveColor(el: Element | null, color: string): string {
  if (!el || !/^[a-z]+$/.test(color)) return color;
  const v = getComputedStyle(el).getPropertyValue(`--scratch-${color}`).trim();
  return v || color;
}

function tracePath(ctx: CanvasRenderingContext2D, px: number[]) {
  ctx.beginPath();
  ctx.moveTo(px[0]!, px[1]!);
  const n = px.length / 2;
  if (n === 2) {
    ctx.lineTo(px[2]!, px[3]!);
    return;
  }
  // Quadratic curves through midpoints: each sample is a control point.
  for (let i = 1; i < n - 1; i++) {
    const cx = px[i * 2]!;
    const cy = px[i * 2 + 1]!;
    const nx = px[(i + 1) * 2]!;
    const ny = px[(i + 1) * 2 + 1]!;
    ctx.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2);
  }
  ctx.lineTo(px[(n - 1) * 2]!, px[(n - 1) * 2 + 1]!);
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke, w: number, h: number, color: string) {
  if (s.points.length < 2) return;
  const px = denormalise(s.points, w, h);
  const lw = Math.max(0.5, scaledSize(s.size, w));
  ctx.globalAlpha = s.tool === "highlighter" ? HIGHLIGHT_ALPHA : 1;
  if (px.length < 4) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px[0]!, px[1]!, lw / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = s.tool === "highlighter" ? "square" : "round";
  ctx.lineJoin = "round";
  tracePath(ctx, px);
  ctx.stroke();
}

interface Live {
  pointerId: number;
  tool: Tool;
  stroke: Stroke | null; // pen / highlighter in progress
  pressureSum: number;
  pressureCount: number;
  before: readonly Stroke[]; // snapshot for the undo step
}

export function Scratchpad({ id }: { id: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const [strokes, setStrokes] = useState<readonly Stroke[]>(() => getStore().load(id));
  const [undoStack, setUndoStack] = useState<(readonly Stroke[])[]>([]);
  const [redoStack, setRedoStack] = useState<(readonly Stroke[])[]>([]);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState<string>("ink");
  const [sizeId, setSizeId] = useState<SizeId>("m");
  const [grid, setGrid] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [loadedId, setLoadedId] = useState(id);

  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;
  const liveRef = useRef<Live | null>(null);
  const frameRef = useRef(0);

  // Reload when the question changes (render-time reset, so no flash of the old drawing).
  if (loadedId !== id) {
    setLoadedId(id);
    setStrokes(getStore().load(id));
    setUndoStack([]);
    setRedoStack([]);
    setConfirmClear(false);
  }

  /* ── drawing ─────────────────────────────────────────────────────────── */

  const redraw = useCallback(() => {
    frameRef.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = sizeRef.current;
    const dpr = canvas.width / Math.max(1, w);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const live = liveRef.current?.stroke;
    const all = live ? [...strokesRef.current, live] : strokesRef.current;
    const wrap = wrapRef.current;
    const cache = new Map<string, string>();
    const colorOf = (c: string) => {
      let v = cache.get(c);
      if (!v) cache.set(c, (v = resolveColor(wrap, c)));
      return v;
    };
    // Highlighter first so ink always sits on top of it.
    for (const s of all) if (s.tool === "highlighter") drawStroke(ctx, s, w, h, colorOf(s.color));
    for (const s of all) if (s.tool === "pen") drawStroke(ctx, s, w, h, colorOf(s.color));
    ctx.globalAlpha = 1;
  }, []);

  const scheduleRedraw = useCallback(() => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(redraw);
  }, [redraw]);

  useEffect(() => {
    scheduleRedraw();
  }, [strokes, scheduleRedraw]);

  // Size the backing store to the element and devicePixelRatio.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      sizeRef.current = { w: rect.width, h: rect.height };
      const bw = Math.max(1, Math.round(rect.width * dpr));
      const bh = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      redraw();
    };
    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    ro?.observe(canvas);
    // Theme switches change the swatch colours; dpr changes on zoom / moving screens.
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", fit);
    window.addEventListener("resize", fit);
    return () => {
      ro?.disconnect();
      mq?.removeEventListener?.("change", fit);
      window.removeEventListener("resize", fit);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [redraw]);

  /* ── auto-save (debounced, flushed on id change / unmount) ───────────── */

  const dirtyRef = useRef(false);
  useEffect(() => {
    if (!dirtyRef.current) return;
    const saveId = id;
    const data = strokes;
    const t = window.setTimeout(() => {
      dirtyRef.current = false;
      getStore().save(saveId, data);
    }, SAVE_DELAY);
    return () => {
      window.clearTimeout(t);
      // Flush if this effect is being torn down with unsaved work (id change or unmount).
      if (dirtyRef.current) {
        dirtyRef.current = false;
        getStore().save(saveId, data);
      }
    };
  }, [strokes, id]);

  /* ── history ─────────────────────────────────────────────────────────── */

  const commit = useCallback((before: readonly Stroke[], next: readonly Stroke[]) => {
    if (before === next) return;
    dirtyRef.current = true;
    setUndoStack((u) => [...u.slice(-(MAX_HISTORY - 1)), before]);
    setRedoStack([]);
    setStrokes(next);
  }, []);

  const undo = useCallback(() => {
    if (liveRef.current || undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1]!;
    dirtyRef.current = true;
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack((r) => [...r, strokesRef.current]);
    setStrokes(prev);
  }, [undoStack]);

  const redo = useCallback(() => {
    if (liveRef.current || redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1]!;
    dirtyRef.current = true;
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack((u) => [...u, strokesRef.current]);
    setStrokes(next);
  }, [redoStack]);

  const clearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setConfirmClear(false);
    commit(strokesRef.current, strokesRef.current.length ? [] : strokesRef.current);
  };

  useEffect(() => {
    if (!confirmClear) return;
    const t = window.setTimeout(() => setConfirmClear(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirmClear]);

  /* ── pointer input ───────────────────────────────────────────────────── */

  const sizeDef = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];

  const localPoint = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const addSample = (live: Live, e: PointerEvent) => {
    const { w, h } = sizeRef.current;
    const { x, y } = localPoint(e);
    if (live.tool === "eraser") {
      const radius = scaledSize(sizeDef.eraser, w);
      const next = eraseAt(strokesRef.current, x, y, radius, w, h);
      if (next !== strokesRef.current) {
        dirtyRef.current = true;
        strokesRef.current = next;
        setStrokes(next);
      }
      return;
    }
    const s = live.stroke!;
    const [nx, ny] = normalisePoint(x, y, w, h);
    const n = s.points.length;
    if (n >= 2) {
      const dx = nx - s.points[n - 2]!;
      const dy = ny - s.points[n - 1]!;
      if (dx * dx + dy * dy < (THIN_DISTANCE * THIN_DISTANCE) / 4) return;
    }
    s.points.push(nx, ny);
    if (e.pointerType === "pen" && e.pressure > 0) {
      live.pressureSum += e.pressure;
      live.pressureCount += 1;
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (liveRef.current) return; // one pointer at a time (ignores a resting palm / second finger)
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.focus({ preventScroll: true });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is best-effort.
    }
    setConfirmClear(false);
    const eraser = tool === "eraser" || (e.pointerType === "pen" && (e.buttons & 32) !== 0);
    const activeTool: Tool = eraser ? "eraser" : tool;
    const live: Live = {
      pointerId: e.pointerId,
      tool: activeTool,
      stroke:
        activeTool === "eraser"
          ? null
          : { tool: activeTool, color, size: activeTool === "pen" ? sizeDef.pen : sizeDef.highlighter, points: [] },
      pressureSum: 0,
      pressureCount: 0,
      before: strokesRef.current,
    };
    liveRef.current = live;
    addSample(live, e.nativeEvent);
    scheduleRedraw();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const live = liveRef.current;
    if (!live || live.pointerId !== e.pointerId) return;
    const native = e.nativeEvent;
    const samples = typeof native.getCoalescedEvents === "function" ? native.getCoalescedEvents() : [];
    for (const s of samples.length ? samples : [native]) addSample(live, s);
    scheduleRedraw();
  };

  const finish = (e: ReactPointerEvent<HTMLCanvasElement>, cancelled: boolean) => {
    const live = liveRef.current;
    if (!live || live.pointerId !== e.pointerId) return;
    liveRef.current = null;
    if (live.tool === "eraser") {
      commit(live.before, strokesRef.current);
      return;
    }
    const s = live.stroke!;
    if (cancelled || s.points.length < 2) {
      scheduleRedraw();
      return;
    }
    if (live.tool === "pen" && live.pressureCount > 0) {
      // Pen pressure scales the whole stroke (0.5× light … 1.5× firm).
      const avg = live.pressureSum / live.pressureCount;
      s.size = Math.round(s.size * (0.5 + Math.min(1, avg)) * 10) / 10;
    }
    commit(live.before, [...live.before, s]);
  };

  /* ── keyboard ────────────────────────────────────────────────────────── */

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "z" && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((k === "z" && e.shiftKey) || (k === "y" && e.ctrlKey && !e.metaKey)) {
      e.preventDefault();
      redo();
    }
  };

  /* ── render ──────────────────────────────────────────────────────────── */

  const toolButton = (t: Tool) => (
    <button
      key={t}
      type="button"
      className="sp-btn"
      aria-pressed={tool === t}
      onClick={() => setTool(t)}
      title={TOOL_LABELS[t]}
    >
      <ToolIcon tool={t} />
      <span className="sp-label">{TOOL_LABELS[t]}</span>
    </button>
  );

  return (
    <div className="scratchpad" ref={wrapRef} onKeyDown={onKeyDown}>
      <div className="sp-toolbar" role="toolbar" aria-label="Scratchpad tools">
        <div className="sp-group" role="group" aria-label="Tool">
          {(["pen", "highlighter", "eraser"] as const).map(toolButton)}
        </div>

        <div className="sp-group" role="group" aria-label="Colour">
          {SWATCHES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`sp-swatch sp-c-${s.id}`}
              aria-pressed={color === s.id}
              aria-label={s.label}
              title={s.label}
              disabled={tool === "eraser"}
              onClick={() => setColor(s.id)}
            />
          ))}
        </div>

        <div className="sp-group" role="group" aria-label="Size">
          {SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              className="sp-btn sp-size"
              aria-pressed={sizeId === s.id}
              aria-label={s.label}
              title={s.label}
              onClick={() => setSizeId(s.id)}
            >
              <span className={`sp-dot sp-dot-${s.id}`} aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="sp-group" role="group" aria-label="History">
          <button type="button" className="sp-btn" onClick={undo} disabled={undoStack.length === 0} aria-label="Undo" title="Undo (Ctrl/Cmd+Z)">
            <Icon d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />
          </button>
          <button type="button" className="sp-btn" onClick={redo} disabled={redoStack.length === 0} aria-label="Redo" title="Redo (Shift+Ctrl/Cmd+Z)">
            <Icon d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />
          </button>
          <button
            type="button"
            className="sp-btn"
            aria-pressed={grid}
            onClick={() => setGrid((g) => !g)}
            aria-label="Grid"
            title="Grid"
          >
            <Icon d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
          </button>
          <button
            type="button"
            className={`sp-btn sp-clear${confirmClear ? " is-confirm" : ""}`}
            onClick={clearAll}
            disabled={strokes.length === 0}
            aria-label={confirmClear ? "Confirm clear scratchpad" : "Clear scratchpad"}
          >
            <Icon d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
            <span className="sp-label">{confirmClear ? "Confirm?" : "Clear"}</span>
          </button>
        </div>
      </div>

      <div className={`sp-surface${grid ? " has-grid" : ""}`}>
        <canvas
          ref={canvasRef}
          className={`sp-canvas sp-tool-${tool}`}
          tabIndex={0}
          role="img"
          aria-label="Scratchpad for this question. Draw with a mouse, pen or finger."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => finish(e, false)}
          onPointerCancel={(e) => finish(e, true)}
          onLostPointerCapture={(e) => finish(e, false)}
          onContextMenu={(e) => e.preventDefault()}
        />
        {strokes.length === 0 && (
          <p className="sp-empty" aria-hidden="true">
            Sketch a pathway, an ECG trace or a dose calculation here.
          </p>
        )}
      </div>
      <p className="sp-hint">
        Saved in this browser for this question. Eraser removes whole strokes. Ctrl/Cmd+Z to undo.
      </p>
      <span className="sr-only" aria-live="polite">
        {confirmClear ? "Press Clear again to erase the whole scratchpad." : ""}
      </span>
    </div>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg className="sp-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolIcon({ tool }: { tool: Tool }) {
  if (tool === "pen") return <Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />;
  if (tool === "highlighter") return <Icon d="m9 11-6 6v3h9l3-3M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />;
  return <Icon d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 19M22 21H7M5 11l9 9" />;
}
