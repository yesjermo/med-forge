import { useEffect, useRef, useState } from "react";
import { getModel } from "./models";
import { draw } from "./render";

const SPIN = 0.35; // radians per second
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Interactive 3D model for a concept page: drag or arrow keys rotate it; it spins slowly unless paused or reduced motion is on. */
export function Model3D({ id }: { id: string }) {
  const model = getModel(id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(() => !reducedMotion());
  const playRef = useRef(playing);
  const view = useRef({ yaw: 0.6, pitch: model?.tilt ?? 0.3 });
  const kickRef = useRef<() => void>(() => {});
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);

  useEffect(() => {
    playRef.current = playing;
    kickRef.current();
  }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !model) return;
    let w = 0, h = 0, raf = 0, last = 0, visible = true;
    const frame = (t: number) => {
      raf = 0;
      if (playRef.current && last) view.current.yaw += (Math.min(t - last, 100) / 1000) * SPIN;
      last = t;
      ctx.setTransform(devicePixelRatio || 1, 0, 0, devicePixelRatio || 1, 0, 0);
      draw(ctx, model, w, h, view.current.yaw, view.current.pitch, getComputedStyle(canvas).color);
      if (playRef.current && visible) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const kick = () => { if (!raf && visible && w) raf = requestAnimationFrame(frame); };
    kickRef.current = kick;
    const resize = () => {
      const dpr = devicePixelRatio || 1;
      w = canvas.parentElement?.clientWidth ?? 300;
      h = Math.round(Math.min(380, Math.max(220, w * 0.72)));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      kick();
    };
    resize();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    if (canvas.parentElement) ro?.observe(canvas.parentElement);
    const io = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0; last = 0; } })
      : null;
    io?.observe(canvas);
    return () => {
      ro?.disconnect();
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      kickRef.current = () => {};
    };
  }, [model]);

  if (!model) return null;

  const turn = (dYaw: number, dPitch: number) => {
    const v = view.current;
    v.yaw += dYaw;
    v.pitch = Math.max(-1.5, Math.min(1.5, v.pitch + dPitch));
    kickRef.current();
  };
  return (
    <figure className="model3d">
      <div className="model3d-stage">
        <canvas
          ref={canvasRef}
          role="img"
          tabIndex={0}
          aria-label={`3D model: ${model.title}. ${model.caption} Use the arrow keys to rotate.`}
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.id !== e.pointerId) return;
            turn((e.clientX - d.x) * 0.01, (e.clientY - d.y) * 0.01);
            d.x = e.clientX;
            d.y = e.clientY;
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={(e) => {
            const k = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] }[e.key];
            if (!k) return;
            e.preventDefault();
            turn(k[0]!, k[1]!);
          }}
        />
        <button type="button" className="secondary model3d-play" onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <figcaption>
        <strong>{model.title}.</strong> {model.caption} <span className="hint">Drag or use the arrow keys to rotate.</span>
        <ul className="model3d-legend">
          {model.legend.map(([c, label]) => (
            <li key={label}>
              <span className="model3d-swatch" style={{ background: c }} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
