/**
 * Curriculum Framework Index
 *
 * Central export point for all curriculum-related functionality.
 * Import curricula and register them here.
 */

// Core framework
export {
  registerCurriculum,
  getCurriculum,
  getAllCurriculumCodes,
  getLesson,
  getLessonsByLevel,
  getNextLesson,
  getLevelForLesson,
  getMasteredContent,
  calculateProgress,
  CEFR_LEVELS,
} from "@/lib/curriculum/curriculum-framework";

// Context injection
export {
  buildLessonContext,
  generateLessonPrompt,
  generateSystemContext,
  generateFullContext,
  generateQuickContext,
} from "@/lib/curriculum/context-injection";

// Lesson generator
export {
  getCurriculumLesson,
  createEmptyProgress,
  progressFromLessonHistory,
} from "@/lib/curriculum/lesson-generator";

// Types
export type {
  CEFRLevel,
  LessonCategory,
  VocabularyItem,
  GrammarPoint,
  Lesson,
  CurriculumLevel,
  LanguageCurriculum,
  UserLessonProgress,
  UserCurriculumProgress,
  LessonContext,
  CurriculumRegistry,
} from "@/types/curriculum.types";

export type { InjectionContext } from "@/lib/curriculum/context-injection";
export type {
  CurriculumLessonResult,
  NoCurriculumResult,
  CurriculumLessonCheck,
} from "@/lib/curriculum/lesson-generator";

// Language curricula
import { spanishCurriculum } from "@/lib/curriculum/languages/spanish";
import { registerCurriculum } from "@/lib/curriculum/curriculum-framework";

// Auto-register all curricula on import
registerCurriculum(spanishCurriculum);

// Export individual curricula for direct access
export { spanishCurriculum };
