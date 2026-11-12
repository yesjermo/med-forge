import type { Issue } from "@/engine/types";

export function IssueList({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return <p className="lint-ok">No format problems found.</p>;
  return (
    <ul className="issues">
      {issues.map((i, n) => (
        <li key={n} className={`issue issue-${i.severity}`}>
          <span className="issue-line">line {i.line}</span>
          <code>{i.code}</code>
          <span>{i.message}</span>
        </li>
      ))}
    </ul>
  );
}
