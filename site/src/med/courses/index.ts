import type { Course } from "../types";
import { anatomyPhysiology } from "./anatomy-physiology";
import { biochemistry } from "./biochemistry";
import { microbiology } from "./microbiology";

/** Course packs in display order. Add a course by writing a pack file and listing it here. */
export const COURSES: Course[] = [anatomyPhysiology, microbiology, biochemistry];

export function findCourse(id: string | undefined): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
