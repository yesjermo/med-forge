import katex from "katex";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPES[c]!);
}

function math(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { displayMode, throwOnError: false, trust: false, strict: "ignore" });
}

const INLINE_MATH_RE = /\$([^$\n]+?)\$/g;

const BOLD = "\u0001";

/** Escape plain text, mark `**` for bold, and turn `[S3]` source tags into links to the evidence list. */
function textHtml(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*/g, BOLD)
    .replace(/\[(S\d{1,3})\]/g, '<a class="src-tag" href="#src-$1">[$1]</a>');
}

/** Escape text and render `$...$` inline math, `**bold**` and `[S#]` source links. */
export function renderInline(text: string): string {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(INLINE_MATH_RE)) {
    out += textHtml(text.slice(last, m.index));
    out += math(m[1]!, false);
    last = m.index! + m[0].length;
  }
  out += textHtml(text.slice(last));
  // Pair the markers (bold may wrap inline math); an unpaired one goes back to literal "**".
  return out.replace(new RegExp(`${BOLD}([\\s\\S]+?)${BOLD}`, "g"), "<strong>$1</strong>").replaceAll(BOLD, "**");
}

/**
 * Render a block section body to safe HTML.
 * Supports `$$` display math (single or multi-line), `$` inline math,
 * `- ` bullets, `- [ ]` / `- [x]` checklists, `1.` numbered lists and `> ` quotes.
 * All other text is escaped, so model output can never inject markup.
 */
export function renderSection(body: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  let list: "ul" | "ol" | null = null;
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  const openList = (kind: "ul" | "ol") => {
    if (list !== kind) {
      closeList();
      out.push(kind === "ul" ? '<ul>' : "<ol>");
      list = kind;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const t = line.trim();

    if (t.startsWith("$$")) {
      closeList();
      let tex = t.slice(2);
      if (tex.trimEnd().endsWith("$$") && tex.trim() !== "") {
        tex = tex.trimEnd().slice(0, -2);
      } else {
        const buf = [tex];
        while (++i < lines.length) {
          const l = lines[i]!;
          if (l.trimEnd().endsWith("$$")) {
            buf.push(l.trimEnd().slice(0, -2));
            break;
          }
          buf.push(l);
        }
        tex = buf.join("\n");
      }
      out.push(`<div class="math-display">${math(tex.trim(), true)}</div>`);
      continue;
    }

    if (t === "") {
      closeList();
      continue;
    }

    const check = /^[-*]\s+\[([ xX])\]\s+(.*)$/.exec(t);
    if (check) {
      openList("ul");
      const checked = check[1] !== " ";
      out.push(
        `<li class="check"><input type="checkbox" disabled${checked ? " checked" : ""} aria-label="stress test"> ${renderInline(check[2]!)}</li>`,
      );
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(t);
    if (bullet) {
      openList("ul");
      out.push(`<li>${renderInline(bullet[1]!)}</li>`);
      continue;
    }
    const num = /^\d+[.)]\s+(.*)$/.exec(t);
    if (num) {
      openList("ol");
      out.push(`<li>${renderInline(num[1]!)}</li>`);
      continue;
    }
    closeList();
    const quote = /^>\s?(.*)$/.exec(t);
    if (quote) {
      out.push(`<blockquote>${renderInline(quote[1]!)}</blockquote>`);
      continue;
    }
    out.push(`<p>${renderInline(t)}</p>`);
  }
  closeList();
  return out.join("");
}
