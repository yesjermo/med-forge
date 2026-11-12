import type { NotebookPost } from "./notebook";
import oxygenPack from "../../examples/oxygen-pack.md?raw";

/** Read-only example posts that show how the Study Hub exchange works. */
const day = 24 * 60 * 60 * 1000;
const hour = 3600_000;
const base = Date.UTC(2026, 10, 1);
const post = (p: Omit<NotebookPost, "demo" | "author" | "replies" | "acceptedReplyId"> & Partial<NotebookPost>): NotebookPost => ({
  demo: true,
  author: "example_student",
  replies: [],
  acceptedReplyId: null,
  ...p,
});

export const DEMO_POSTS: NotebookPost[] = [
  post({
    id: "demo-question",
    kind: "question",
    title: "Which of these four patients do I see first?",
    major: "Nursing",
    course: "NURS 320",
    createdAt: base + 3 * day,
    body: `Practice question from our med-surg review. At the start of the shift:

1. A post-op patient asking for pain relief, pain 6/10
2. A patient with COPD whose SpO₂ is 89%, their usual baseline
3. A patient two days after a hip replacement who is suddenly short of breath and anxious
4. A patient with diabetes waiting for a breakfast tray

- [ ] Pick one and explain the priority
- [ ] Say what you'd check first`,
    replies: [
      {
        id: "demo-question-r1",
        kind: "solution",
        author: "peer_reviewer",
        createdAt: base + 3 * day + hour,
        body: "Patient 3. Sudden dyspnoea and anxiety after orthopaedic surgery is an acute change in breathing (think pulmonary embolism), so it comes first under ABCs. Patient 2 is at their baseline, so they're stable for now.",
      },
      {
        id: "demo-question-r2",
        kind: "comment",
        author: "example_student",
        createdAt: base + 3 * day + 2 * hour,
        body: "That makes sense: acute and unexpected beats chronic and expected. Thanks.",
      },
    ],
    acceptedReplyId: "demo-question-r1",
  }),
  post({
    id: "demo-proof",
    kind: "proof",
    title: "Deriving the Henderson–Hasselbalch equation",
    major: "Pre-med",
    course: "CHEM 230",
    createdAt: base + 2 * day,
    body: `Claim: for a weak acid $HA \\rightleftharpoons H^+ + A^-$,

$$ \\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]} $$

Proof:
1. $K_a = [H^+][A^-]/[HA]$
2. Take $-\\log$ of both sides: $\\text{p}K_a = \\text{pH} - \\log([A^-]/[HA])$
3. Rearrange.

I'm unsure when it stops being accurate.`,
    replies: [
      {
        id: "demo-proof-r1",
        kind: "critique",
        author: "peer_reviewer",
        createdAt: base + 2 * day + 1.5 * hour,
        body: "The algebra is right. It assumes the equilibrium concentrations equal what you added, so it breaks down for very dilute buffers or when $[A^-]/[HA]$ is far from 1 (outside about 0.1–10). Say that before step 3.",
      },
    ],
  }),
  post({
    id: "demo-idea",
    kind: "idea",
    title: "Flashcards for species differences in normal vital signs",
    major: "Pre-vet & Veterinary",
    course: "",
    createdAt: base + day,
    body: `Problem / gap:
Our animal physiology notes list dog, cat, horse and cow vitals in one long table that nobody remembers.

Idea:
A small deck that drills one species against another (e.g. resting heart rate, dog vs horse).

Trade-offs I see:
- Gain: comparisons stick better than a table
- Cost: ranges vary between textbooks, so each card needs its source

Stress-test it:
- [ ] Which textbook's ranges should we use?
- [ ] Does it cover age and breed differences?`,
  }),
  post({
    id: "demo-pack",
    kind: "pack",
    title: "Oxygen–haemoglobin dissociation (study pack)",
    major: "Pre-med",
    course: "BIOL 310",
    createdAt: base,
    body: oxygenPack.trim(),
  }),
];
