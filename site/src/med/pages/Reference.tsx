import { useState } from "react";
import { NORMALS } from "../nursing/normals";
import "../nursing/nursing.css";
import { Crumbs } from "../ui";

/** Adult normal values, searchable by name. For learning only. */
export function Reference() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const groups = NORMALS.map((g) => ({ ...g, items: g.items.filter((it) => it.name.toLowerCase().includes(needle)) })).filter((g) => g.items.length);
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <main className="shell narrow">
      <Crumbs here="Normal values" />
      <h1>Normal values</h1>
      <div className="notice nursing-notice" role="note">
        <p>
          <strong>For learning only.</strong> Typical adult ranges. Reference ranges vary by laboratory, age, sex and pregnancy, so the local
          lab&apos;s reference range always wins.
        </p>
      </div>
      <label className="field nursing-search">
        <span>Search by name</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. potassium, PaCO₂, haemoglobin" />
      </label>
      <p className="hint" role="status" aria-live="polite">
        {q.trim() ? `${count} match${count === 1 ? "" : "es"}` : `${count} values`}
      </p>
      {groups.map((g) => (
        <section key={g.group} className="panel nursing-group" aria-labelledby={`g-${g.group}`}>
          <h2 id={`g-${g.group}`}>{g.group}</h2>
          <div className="normals-scroll">
            <table className="normals">
              <thead>
                <tr>
                  {["Test", "Range", "Unit", "Notes"].map((h) => <th key={h} scope="col">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {g.items.map((it) => (
                  <tr key={it.name}>
                    <th scope="row" data-label="Test">{it.name}</th>
                    <td data-label="Range" className="normals-range">{it.range}</td>
                    <td data-label="Unit">{it.unit || "—"}</td>
                    <td data-label="Notes" className="normals-note">
                      {it.si && <span className="normals-si">SI: {it.si}</span>}
                      {it.note && <span>{it.note}</span>}
                      {!it.si && !it.note && "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {groups.length === 0 && <p className="empty">No values match “{q.trim()}”.</p>}
    </main>
  );
}
