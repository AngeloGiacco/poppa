/**
 * Curriculum-Based Lesson Generator
 *
 * Generates lesson instructions from curriculum data
 * for injection into ElevenLabs conversation context.
 */

import {
  getCurriculum,
  getNextLesson,
  getLesson,
  generateFullContext,
} from "@/lib/curriculum";
import { UserCurriculumProgress, Lesson } from "@/types/curriculum.types";
import { generateThinkingMethodInstruction } from "@/lib/lesson-utils";

export interface CurriculumLessonResult {
  instruction: string;
  lessonId: number;
  lessonTitle: string;
  level: string;
  hasCurriculum: true;
}

export interface NoCurriculumResult {
  hasCurriculum: false;
}

export type CurriculumLessonCheck = CurriculumLessonResult | NoCurriculumResult;

function buildLessonInstruction(
  lesson: Lesson,
  contextPrompt: string,
  languageCode: string,
  nativeLanguage: string
): string {
  const thinkingMethod = generateThinkingMethodInstruction(
    languageCode,
    nativeLanguage
  );

  return `You are a world-class, patient language teacher using the Socratic method. Guide the student through this structured lesson using discovery-based learning.

${thinkingMethod}

---

## Lesson Context

${contextPrompt}

---

## Teaching Guidelines

1. **Start with the lesson objectives** - briefly mention what the student will learn
2. **Introduce vocabulary through context** - never just list words, use them in sentences
3. **Let them discover grammar patterns** - ask guiding questions instead of explaining rules
4. **Check understanding frequently** - after introducing a word/concept, immediately ask them to use it
5. **Handle mistakes patiently** - treat errors as learning opportunities, guide them to self-correct
6. **Build on what they know** - reference mastered grammar and vocabulary naturally
7. **Keep it conversational** - this is a spoken lesson, not a lecture

## Conversation Style

- Speak in the student's native language (${nativeLanguage}) when explaining
- Use the target language for examples and practice
- Be encouraging but not overly effusive
- Move at the student's pace - slow down if they struggle, speed up if they're comfortable

Begin the lesson now. Start by warmly greeting the student and briefly introducing today's topic: "${lesson.title}".`;
}

export function getCurriculumLesson(
  languageCode: string,
  progress: UserCurriculumProgress,
  nativeLanguage: string,
  specificLessonId?: number
): CurriculumLessonCheck {
  const curriculum = getCurriculum(languageCode);

  if (!curriculum) {
    return { hasCurriculum: false };
  }

  const lesson = specificLessonId
    ? getLesson(languageCode, specificLessonId)
    : getNextLesson(languageCode, progress);

  if (!lesson) {
    return { hasCurriculum: false };
  }

  const context = generateFullContext(
    languageCode,
    lesson.id,
    progress,
    nativeLanguage
  );

  if (!context) {
    return { hasCurriculum: false };
  }

  const instruction = buildLessonInstruction(
    lesson,
    context.fullContext,
    languageCode,
    nativeLanguage
  );

  return {
    instruction,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    level: lesson.level,
    hasCurriculum: true,
  };
}

export function createEmptyProgress(
  userId: string,
  languageCode: string
): UserCurriculumProgress {
  return {
    userId,
    languageCode,
    completedLessons: [],
    currentLessonId: null,
    currentLevel: "A1",
    lastActivityAt: new Date().toISOString(),
  };
}

export function progressFromLessonHistory(
  userId: string,
  languageCode: string,
  completedLessonIds: number[]
): UserCurriculumProgress {
  return {
    userId,
    languageCode,
    completedLessons: completedLessonIds.map((id) => ({
      lessonId: id,
      completedAt: new Date().toISOString(),
    })),
    currentLessonId: null,
    currentLevel: "A1",
    lastActivityAt: new Date().toISOString(),
  };
}
