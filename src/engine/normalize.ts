/**
 * Clean up common writer habits before linting, mostly from local models:
 * - `\[ ... \]` display math → `$$ ... $$` on its own lines with blank lines around
 * - `\( ... \)` inline math → `$ ... $`
 * - a single markdown code fence wrapped around the whole answer
 * - template placeholders copied into ref attributes: `ref="{proof id='X'}"` → `ref="X"`;
 *   a ref with no real ID inside is dropped
 */
import { ID_RE } from "./ids";
import { DOMAIN_PREFIX } from "./types";
export function normalizeOutput(text: string): string {
  let t = text.replace(/\r\n?/g, "\n").trim();

  const fenced = /^```[a-z]*\n([\s\S]*?)\n```$/i.exec(t);
  if (fenced) t = fenced[1]!.trim();

  t = t.replace(/^(:::.*?)\s+ref="\{([^"]*)\}"/gm, (_m, head: string, inner: string) => {
    const id = /[A-Z]{3}-[A-Z]{3,6}-\d{4}/.exec(inner);
    return id ? `${head} ref="${id[0]}"` : head;
  });

  t = t.replace(
    /[ \t]*\\\[([\s\S]+?)\\\][ \t]*/g,
    (_m, tex: string) => `\n\n$$ ${tex.trim().replace(/\s*\n\s*/g, " ")} $$\n\n`,
  );
  t = t.replace(/\\\(([\s\S]+?)\\\)/g, (_m, tex: string) => `$${tex.trim()}$`);

  t = repairFences(t);
  t = repairIds(t);

  // Collapse the extra blank lines the display-math rewrite can leave behind.
  return t.replace(/\n{3,}/g, "\n\n").trim();
}

const OPEN_FENCE_RE = /^:::[ \t]*[A-Za-z_]/;
const CLOSE_FENCE_RE = /^:::[ \t]*$/;
const FENCED_TRAILER_RE = /^:::[ \t]*(open questions|references)[ \t]*:?[ \t]*$/i;
const TRAILER_RE = /^(open questions|references):[ \t]*$/i;

/**
 * Blocks are never nested, so a block opening while another is open means a missing
 * closing fence. Also unwraps `::: Open Questions:` / `::: References:` pseudo-blocks
 * back into the plain trailing lists, and closes a block left open at the end.
 */
function repairFences(text: string): string {
  const out: string[] = [];
  let open = false;
  let fencedTrailer = false;
  const close = () => {
    while (out.length && out[out.length - 1]!.trim() === "") out.pop();
    out.push(":::", "");
    open = false;
  };
  for (const line of text.split("\n")) {
    const trailer = FENCED_TRAILER_RE.exec(line);
    if (trailer) {
      if (open) close();
      out.push(trailer[1]!.toLowerCase() === "references" ? "References:" : "Open Questions:");
      fencedTrailer = true;
      continue;
    }
    if (CLOSE_FENCE_RE.test(line)) {
      if (fencedTrailer) {
        fencedTrailer = false;
        continue;
      }
      if (open) open = false;
      out.push(line);
      continue;
    }
    if (OPEN_FENCE_RE.test(line)) {
      if (open) close();
      open = true;
      fencedTrailer = false;
      out.push(line);
      continue;
    }
    if (open && TRAILER_RE.test(line.trim())) close();
    out.push(line);
  }
  if (open) close();
  return out.join("\n");
}

const ID_SHAPED_RE = /^[A-Z]{1,6}-([A-Z]{3,6})-\d{4}$/;
const PREFIX: Record<string, string> = DOMAIN_PREFIX;

/**
 * Give an invented ID prefix (e.g. EX-SEPSIS-0001 on an exchange block) the right one:
 * the block's domain prefix, otherwise the document's first valid
 * prefix. The number is the next free one for that topic; refs are rewritten to match.
 */
function repairIds(text: string): string {
  const heads = [...text.matchAll(/^:::[ \t]*(\w+)(.*)$/gm)].map((m) => ({
    type: m[1]!,
    id: /\bid="([^"]+)"/.exec(m[2]!)?.[1],
    domain: /\bdomain="([^"]+)"/.exec(m[2]!)?.[1],
  }));
  const used = new Set(heads.flatMap((h) => (h.id && ID_RE.test(h.id) ? [h.id] : [])));
  const docPrefix = [...used][0]?.slice(0, 3);
  let t = text;
  for (const h of heads) {
    if (!h.id || ID_RE.test(h.id)) continue;
    const shaped = ID_SHAPED_RE.exec(h.id);
    const prefix = (h.domain && PREFIX[h.domain]) || docPrefix;
    if (!shaped || !prefix) continue;
    const topic = shaped[1]!;
    let seq = 1;
    while (used.has(`${prefix}-${topic}-${String(seq).padStart(4, "0")}`)) seq++;
    const fixed = `${prefix}-${topic}-${String(seq).padStart(4, "0")}`;
    used.add(fixed);
    t = t.split(`id="${h.id}"`).join(`id="${fixed}"`).split(`ref="${h.id}"`).join(`ref="${fixed}"`);
  }
  return t;
}
