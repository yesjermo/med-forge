import { Crumbs } from "../ui";

const TOOLS: { href: string; title: string; what: string; for: string }[] = [
  { href: "#/nursing", title: "Dosage calculations", what: "Practise D/H × Q, weight-based doses, IV and drip rates with hypothetical orders.", for: "Nursing" },
  { href: "#/reference", title: "Normal values", what: "Vital signs, electrolytes, blood counts, blood gases, diabetes and lipid targets.", for: "Clinical" },
  { href: "#/terms", title: "Medical terminology", what: "Prefixes, roots and suffixes as flashcards with spaced review.", for: "Everyone" },
  { href: "#/lab", title: "Lab calculators", what: "Dilutions, solute mass, plate counts, hemocytometer, Beer–Lambert, pH.", for: "Lab" },
  { href: "#/research", title: "Research toolkit", what: "PICO question to PubMed search, 2×2 statistics, evidence guide, citations from a DOI.", for: "Research" },
  { href: "#/generate", title: "Generate study blocks", what: "Turn your lecture notes or a case into cited study blocks for medicine, nursing, pre-med or vet track.", for: "Everyone" },
  { href: "#/import", title: "Question snipper", what: "Open a past exam or tutorial sheet (PDF or screenshot), box a problem, and it becomes a card in your daily review.", for: "Everyone" },
  { href: "#/lecture-import", title: "Lecture recording to insights", what: "Play a lecture recording with synced notes; the AI pulls timed exam tips from its captions (Echo360 .vtt/.srt/.txt).", for: "Everyone" },
  { href: "#/courses", title: "Add or import a course", what: "Set up your own university course from files, or import a classmate's pack.", for: "Courses" },
];

/** The study tools, shown on the home page and on the Tools page. */
export function ToolsList() {
  return (
    <ul className="tools-list">
      {TOOLS.map((t) => (
        <li key={t.href}>
          <a href={t.href}>{t.title}</a>
          <span className="tag">{t.for}</span>
          <span className="hint">{t.what}</span>
        </li>
      ))}
    </ul>
  );
}

export function ToolsPage() {
  return (
    <main className="shell narrow">
      <Crumbs here="Tools" />
      <h1>Study tools</h1>
      <p className="lede">Practice and reference tools for medical, nursing and research students.</p>
      <section className="panel">
        <ToolsList />
      </section>
    </main>
  );
}
