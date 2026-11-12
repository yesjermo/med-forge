import type { ComponentType, ReactNode } from "react";
import { POST_KINDS, type PostKind } from "@/taxonomy";

type LinkLike = ComponentType<{ href: string; className?: string; children?: ReactNode }>;

export function timeAgo(ms: number, now = Date.now()): string {
  const s = Math.max(1, Math.floor((now - ms) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 60 ? `${d}d ago` : new Date(ms).toLocaleDateString();
}

/** One row of the Study Hub feed, used by the shared hub and the web-edition notebook. */
export function PostRow({
  href,
  title,
  kind,
  major,
  course,
  solved,
  example,
  count,
  countLabel,
  meta,
  link: LinkC = "a",
}: {
  href: string;
  title: string;
  kind: PostKind;
  major: string;
  course: string;
  solved: boolean;
  example?: boolean;
  /** The number in the left column (votes in the shared hub, replies in the notebook). */
  count: number;
  countLabel: string;
  meta: string;
  /** Link component: Next's Link in the full app (client-side navigation), a plain <a> in the web edition. */
  link?: LinkLike | "a";
}) {
  return (
    <li className="post-row">
      <div className="score" aria-label={`${count} ${countLabel}`} title={countLabel}>
        {count}
      </div>
      <div className="post-main">
        <LinkC href={href} className="post-title">
          {title}
        </LinkC>
        <div className="post-meta">
          <span className={`tag kind-${kind}`}>{POST_KINDS[kind].label}</span>
          <span className="tag">{major}</span>
          {course && <span className="tag">{course}</span>}
          {solved && <span className="tag tag-ok">Solved</span>}
          {example && <span className="tag kind-discussion">Example</span>}
          <span>{meta}</span>
        </div>
      </div>
    </li>
  );
}
