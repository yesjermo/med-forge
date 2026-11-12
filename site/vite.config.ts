import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Two builds:
 * - GitHub Pages (default): multi-file, served from /<repo>/ (override with BASE_PATH).
 * - SINGLE_FILE=1: one self-contained index.html (code, styles and fonts inlined) written to
 *   web/index.html at the repo root. It opens by double-clicking, because browsers won't load
 *   module scripts from file:// pages.
 */
const webDir = fileURLToPath(new URL("../web", import.meta.url));

// `--mode single` (works in every shell, including Windows); SINGLE_FILE=1 still works too.
export default defineConfig(({ mode }) => {
  const single = mode === "single" || Boolean(process.env.SINGLE_FILE);
  return {
    root: fileURLToPath(new URL(".", import.meta.url)),
    base: single ? "./" : (process.env.BASE_PATH ?? "/study-forge/"),
    plugins: [
      react(),
      // site/index.html carries a "source file, not the app" note for people browsing the repo;
      // keep it out of the built pages.
      {
        name: "strip-source-note",
        transformIndexHtml: (html: string) => html.replace(/<!--\s*SOURCE FILE[\s\S]*?-->\s*/, ""),
      },
      // Smaller fonts: every current browser loads woff2, so drop KaTeX's woff/ttf fallbacks, and
      // drop font subsets the site never shows (Cyrillic, Vietnamese).
      {
        name: "trim-fonts",
        enforce: "pre" as const,
        transform(code: string, id: string) {
          if (!id.endsWith(".css") || !/katex|@fontsource/.test(id)) return null;
          return code
            .replace(/,\s*url\([^)]*\.(?:woff|ttf)\)\s*format\("(?:woff|truetype)"\)/g, "")
            .replace(/(?:\/\*[^*]*\*\/\s*)?@font-face\s*\{[^}]*-(?:cyrillic|cyrillic-ext|vietnamese)-[^}]*\}/g, "");
        },
      },
      ...(single ? [viteSingleFile({ removeViteModuleLoader: true })] : []),
    ],
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    build: {
      outDir: single ? webDir : "dist",
      emptyOutDir: true,
      // KaTeX (math rendering) is most of the bundle.
      chunkSizeWarningLimit: single ? 4000 : 700,
      ...(single ? { assetsInlineLimit: Number.MAX_SAFE_INTEGER, cssCodeSplit: false } : {}),
    },
  };
});
