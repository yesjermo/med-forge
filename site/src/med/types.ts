/**
 * Content model for a medical-science course pack. Text fields are MedForge markup:
 * plain text with $math$ / $$display$$, "- " bullets, "1. " steps and "> " callouts.
 */

export interface Course {
  /** URL slug, e.g. "anatomy-physiology". */
  id: string;
  /** Short code shown on cards, e.g. "A&P", or a real course number such as "BIOL 105" for a course aligned with a university syllabus. */
  code: string;
  title: string;
  description: string;
  /** Topic names in teaching order; every concept/question/lecture names one of these. */
  topics: string[];
  concepts: Concept[];
  lectures: Lecture[];
  questions: Question[];
  labs: Lab[];
  cases: ClinicalCase[];
  skills: Skill[];
}

export interface Concept {
  slug: string;
  title: string;
  topic: string;
  /** One or two sentences for cards and the revision sheet. */
  summary: string;
  /** Key formulas in LaTeX, shown on the revision sheet. */
  formulas?: string[];
  body: string;
  /** "Clinical pearls": short facts that connect the concept to patients. */
  pearls: string[];
  /** Id of an interactive 3D model from site/src/med/model3d/models.ts, shown on the concept page. */
  model?: string;
}

export type InsightType = "exam_tip" | "clinical_link" | "intuition";

export interface Lecture {
  id: string;
  week: number;
  title: string;
  topic: string;
  summary: string;
  notes: string;
  insights: LectureInsight[];
  /** Recording of the lecture (http(s) URL). Streamed by the browser, never downloaded in full. */
  audio?: string;
  /** Timestamped sections of the recording, sorted by `at`. */
  chapters?: LectureChapter[];
}

export interface LectureInsight {
  type: InsightType;
  text: string;
  conceptSlug?: string;
  /** Seconds into the lecture's recording where this point is made. */
  at?: number;
}

export interface LectureChapter {
  /** Seconds into the recording. */
  at: number;
  title: string;
}

interface QuestionBase {
  id: string;
  topic: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  hints: string[];
  explanation: string;
  /** Concept slugs this question practises. */
  concepts: string[];
}

export interface McqQuestion extends QuestionBase {
  type: "mcq";
  options: string[];
  /** Index into options. */
  answer: number;
}

export interface NumericQuestion extends QuestionBase {
  type: "numeric";
  answer: number;
  /** Accepted absolute difference from the answer. */
  tolerance: number;
  unit: string;
}

export type Question = McqQuestion | NumericQuestion;

export interface Lab {
  id: string;
  title: string;
  topic: string;
  objective: string;
  safety: string[];
  materials: string[];
  steps: { text: string; why?: string }[];
  /** Calculation drills from the lab's own data. */
  drills: { id: string; prompt: string; answer: number; tolerance: number; unit: string; working: string }[];
  resultsGuide: string;
}

export interface CaseOption {
  text: string;
  /** Good choice for this stage (correct finding to ask for, appropriate test, right diagnosis…). */
  good: boolean;
  /** Shown after choosing: the answer the patient gives, the test result, or why it's right/wrong. */
  feedback: string;
}

export interface CaseStage {
  title: string;
  /** What the student sees before choosing. */
  prompt: string;
  /** "multi" lets the student pick several (history questions, tests); "single" needs one answer. */
  mode: "multi" | "single";
  options: CaseOption[];
  /** Shown once the stage is submitted. */
  debrief: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  topic: string;
  setting: string;
  presentation: string;
  stages: CaseStage[];
  teachingPoints: string[];
}

export interface Skill {
  id: string;
  title: string;
  /** Why the skill matters, one line. */
  purpose: string;
  items: { text: string; critical?: boolean }[];
}
