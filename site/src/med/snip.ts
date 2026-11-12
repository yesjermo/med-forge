/**
 * Browser-only helpers for the question snipper: open a PDF with pdf.js (loaded on demand),
 * and turn a canvas region into a small image data URL. Nothing here sends files anywhere.
 *
 * pdf.js worker: the worker source is bundled as a string (`?raw`) in a lazy chunk and started
 * from a blob: URL as a *classic* worker. That works for the hosted build and for the single
 * self-contained HTML opened from file:// (Chromium refuses module workers from blob: URLs on
 * file:// pages, but allows classic ones). If no worker starts, the same source is imported as
 * a module on the main thread and pdf.js runs in its "fake worker" mode (slower, still works).
 */
import type { PDFDocumentProxy } from "pdfjs-dist";

type PdfJs = typeof import("pdfjs-dist");

/**
 * PDF support is left out of the single-file build (web/index.html): pdf.js would add about 2 MB to a
 * file that should stay small enough to send to a classmate. Images and screenshots still work there.
 */
export const PDF_SUPPORTED = import.meta.env.MODE !== "single";

/** Decoders pdf.js fetches on demand (scanned pages often use JBIG2 or JPEG 2000). */
const WASM: Record<string, () => Promise<{ default: string }>> = PDF_SUPPORTED
  ? {
      "jbig2.wasm": () => import("pdfjs-dist/wasm/jbig2.wasm?url"),
      "openjpeg.wasm": () => import("pdfjs-dist/wasm/openjpeg.wasm?url"),
      "qcms_bg.wasm": () => import("pdfjs-dist/wasm/qcms_bg.wasm?url"),
    }
  : {};

/** Serves wasm from the bundle instead of a URL folder; fonts and CMaps aren't bundled. */
class BundledData {
  async fetch({ kind, filename }: { kind: string; filename: string }): Promise<Uint8Array> {
    const load = kind === "wasmUrl" ? WASM[filename] : undefined;
    if (!load) throw new Error(`${filename} isn't bundled`);
    const res = await fetch((await load()).default);
    if (!res.ok) throw new Error(`Couldn't load ${filename}`);
    return new Uint8Array(await res.arrayBuffer());
  }
}

/** Start a classic worker from `source`; resolves once pdf.js inside it says "ready". */
function startWorker(source: string): Promise<Worker | null> {
  return new Promise((resolve) => {
    let worker: Worker;
    let url = "";
    const finish = (w: Worker | null) => {
      clearTimeout(timer);
      if (url) URL.revokeObjectURL(url);
      resolve(w);
    };
    const timer = setTimeout(() => {
      worker?.terminate();
      finish(null);
    }, 8000);
    try {
      // A classic script can't contain `export` or `import.meta`.
      const classic = source.replace(/export\s*\{[^}]*\};?\s*$/, "").replace(/import\.meta\.url/g, "self.location.href");
      url = URL.createObjectURL(new Blob([classic], { type: "text/javascript" }));
      worker = new Worker(url);
    } catch {
      finish(null);
      return;
    }
    worker.addEventListener("error", () => {
      worker.terminate();
      finish(null);
    });
    const onMessage = (e: MessageEvent) => {
      if ((e.data as { action?: string } | null)?.action !== "ready") return;
      worker.removeEventListener("message", onMessage);
      finish(worker);
    };
    worker.addEventListener("message", onMessage);
  });
}

let pdfjsPromise: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
  if (!PDF_SUPPORTED) return Promise.reject(new Error("PDFs open in the online version of MedForge. Here, take a screenshot of the page and paste or drop it in."));
  pdfjsPromise ??= (async () => {
    const [pdfjs, { default: source }] = await Promise.all([
      import("pdfjs-dist/legacy/build/pdf.mjs") as Promise<PdfJs>,
      import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?raw"),
    ]);
    const worker = typeof Worker !== "undefined" ? await startWorker(source) : null;
    if (worker) {
      pdfjs.GlobalWorkerOptions.workerPort = worker;
    } else {
      // Main-thread fallback: the module sets globalThis.pdfjsWorker, which pdf.js picks up.
      const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
      try {
        await import(/* @vite-ignore */ url);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    return pdfjs;
  })();
  pdfjsPromise.catch(() => {
    pdfjsPromise = null;
  });
  return pdfjsPromise;
}

export async function openPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({
    data: new Uint8Array(data),
    BinaryDataFactory: BundledData,
    useWorkerFetch: false,
    // Purely local: never try to fetch anything for this document.
    disableAutoFetch: true,
    disableStream: true,
  });
  let needsPassword = false;
  task.onPassword = () => {
    needsPassword = true;
    void task.destroy();
  };
  try {
    return await task.promise;
  } catch (e) {
    const name = (e as { name?: string }).name;
    if (needsPassword || name === "PasswordException") throw new Error("This PDF is password-protected. Open it elsewhere and take a screenshot instead.");
    if (name === "InvalidPDFException") throw new Error("That file doesn't look like a valid PDF.");
    throw e;
  }
}

/** Largest canvas side and area we render (stays inside iOS Safari's canvas limits). */
export const MAX_CANVAS_SIDE = 4096;
export const MAX_CANVAS_AREA = 16_000_000;

export function fitCanvas(w: number, h: number): number {
  return Math.min(1, MAX_CANVAS_SIDE / w, MAX_CANVAS_SIDE / h, Math.sqrt(MAX_CANVAS_AREA / (w * h)));
}

/** A crop rectangle in fractions (0–1) of the page width and height. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Copy `rect` of `source` into a compressed image: at most `maxWidth` px wide, webp (quality 0.8)
 * where the browser can encode it, otherwise jpeg. White background, so transparent PNG
 * screenshots don't turn black.
 */
export function cropToDataUrl(source: HTMLCanvasElement, rect: Rect, maxWidth = 1200): string {
  const sx = Math.round(rect.x * source.width);
  const sy = Math.round(rect.y * source.height);
  const sw = Math.max(1, Math.round(rect.w * source.width));
  const sh = Math.max(1, Math.round(rect.h * source.height));
  const scale = Math.min(1, maxWidth / sw, 2400 / sh);
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(sw * scale));
  out.height = Math.max(1, Math.round(sh * scale));
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("This browser can't crop images (no canvas).");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, out.width, out.height);
  const webp = out.toDataURL("image/webp", 0.8);
  return webp.startsWith("data:image/webp") ? webp : out.toDataURL("image/jpeg", 0.82);
}

/** Approximate stored size of a data URL, for display. */
export function dataUrlKb(url: string): number {
  return Math.round((url.length * 0.75) / 1024);
}
