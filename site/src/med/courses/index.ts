import type { Course } from "../types";
import { anatomyPhysiology } from "./anatomy-physiology";
import { biochemistry } from "./biochemistry";
import { microbiology } from "./microbiology";
import { usfBiol105 } from "./usf-biol-105";
import { usfBiol106 } from "./usf-biol-106";
import { usfChem111 } from "./usf-chem-111";
import { usfNurs220 } from "./usf-nurs-220";
import { usfNurs222 } from "./usf-nurs-222";

/** Course packs in display order. Add a course by writing a pack file and listing it here. */
export const COURSES: Course[] = [
  anatomyPhysiology,
  microbiology,
  biochemistry,
  // Aligned with University of San Francisco courses (codes and titles from USF; content original).
  usfBiol105,
  usfBiol106,
  usfChem111,
  usfNurs220,
  usfNurs222,
];

export function findCourse(id: string | undefined): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
