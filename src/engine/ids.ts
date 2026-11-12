import { DOMAIN_PREFIX, type Domain } from "./types";

export const ID_RE = new RegExp(`^(${Object.values(DOMAIN_PREFIX).join("|")})-([A-Z]{3,6})-(\\d{4})$`);

export interface ParsedId {
  prefix: string;
  topic: string;
  seq: number;
}

export function parseId(id: string): ParsedId | null {
  const m = ID_RE.exec(id);
  if (!m) return null;
  return { prefix: m[1]!, topic: m[2]!, seq: Number(m[3]) };
}

export function formatId(domain: Domain, topic: string, seq: number): string {
  const slug = topic.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
  if (slug.length < 3) throw new Error(`Topic "${topic}" needs at least 3 letters.`);
  if (!Number.isInteger(seq) || seq < 1 || seq > 9999) {
    throw new Error(`Sequence ${seq} must be an integer from 1 to 9999.`);
  }
  return `${DOMAIN_PREFIX[domain]}-${slug}-${String(seq).padStart(4, "0")}`;
}

/** Next free ID for a domain/topic given IDs already in use. */
export function nextId(existing: Iterable<string>, domain: Domain, topic: string): string {
  const prefix = DOMAIN_PREFIX[domain];
  const slug = topic.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
  let max = 0;
  for (const id of existing) {
    const p = parseId(id);
    if (p && p.prefix === prefix && p.topic === slug) max = Math.max(max, p.seq);
  }
  return formatId(domain, slug, max + 1);
}
