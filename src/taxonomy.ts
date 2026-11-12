/** Tracks students can post under: the health and pre-health programmes MedForge is for. */
export const MAJORS = [
  "Medicine",
  "Nursing",
  "Pre-med",
  "Pre-vet & Veterinary",
  "Biomedical Science",
  "Biology",
  "Chemistry & Biochemistry",
  "Public Health",
  "Pharmacy",
  "Allied Health",
  "Other",
] as const;
export type Major = (typeof MAJORS)[number];

export const POST_KINDS = {
  question: { label: "Problem to solve", hint: "Post a problem; others reply with solutions and you accept the best one." },
  proof: { label: "Proof to check", hint: "Share a proof or derivation and ask for critiques." },
  idea: { label: "Idea / project", hint: "Pitch a research or project idea and invite stress tests." },
  pack: { label: "Study pack", hint: "Share proof / idea / exchange blocks, from the generator or written by hand." },
  discussion: { label: "Discussion", hint: "Anything else worth talking through." },
} as const;
export type PostKind = keyof typeof POST_KINDS;

/** Starter text for a new post of each kind. */
export const POST_TEMPLATES: Partial<Record<PostKind, string>> = {
  question: "State the problem clearly.\n\nWhat I've tried:\n- \n\nWhere I'm stuck:\n",
  proof: "Claim: $...$\n\nProof:\n1. \n2. \n\nI'm unsure about step:\n",
  idea: "Problem / gap:\n\nIdea:\n\nTrade-offs I see:\n- Gain: \n- Cost: \n\nStress-test it:\n- [ ] \n",
};

export const REPLY_KINDS = {
  solution: "Solution",
  critique: "Critique / stress test",
  comment: "Comment",
} as const;
export type ReplyKind = keyof typeof REPLY_KINDS;

export function isMajor(s: unknown): s is Major {
  return typeof s === "string" && (MAJORS as readonly string[]).includes(s);
}
export function isPostKind(s: unknown): s is PostKind {
  return typeof s === "string" && Object.prototype.hasOwnProperty.call(POST_KINDS, s);
}
export function isReplyKind(s: unknown): s is ReplyKind {
  return typeof s === "string" && Object.prototype.hasOwnProperty.call(REPLY_KINDS, s);
}

/** Suggested major for each generator pack, used when sharing a pack to the hub. */
export const PACK_TO_MAJOR: Record<string, Major> = {
  medicine: "Medicine",
  nursing: "Nursing",
  premed: "Pre-med",
  vet: "Pre-vet & Veterinary",
};
