import { buildConversationContext } from "@/lib/curriculum/context-injection";
import { getCurriculum, getLesson, getNextLesson } from "@/lib/curriculum/curriculum-framework";
import { type UserProgress } from "@/types/curriculum.types";

export interface CurriculumLessonResult {
  hasCurriculum: boolean;
  instruction?: string;
  lessonId?: number;
  lessonTitle?: string;
  level?: string;
}

export function createEmptyProgress(_userId: string, _languageCode: string): UserProgress {
  return {
    completedLessonIds: [],
  };
}

export function progressFromLessonHistory(
  _userId: string,
  _languageCode: string,
  completedLessonIds: number[]
): UserProgress {
  return {
    completedLessonIds,
  };
}

export function getCurriculumLesson(
  languageCode: string,
  progress: UserProgress,
  nativeLanguage: string,
  lessonId?: number
): CurriculumLessonResult {
  const curriculum = getCurriculum(languageCode);
  if (!curriculum) {
    return { hasCurriculum: false };
  }

  const lesson = lessonId
    ? getLesson(languageCode, lessonId)
    : getNextLesson(languageCode, progress);

  if (!lesson) {
    return { hasCurriculum: false };
  }

  const context = buildConversationContext(languageCode, lesson.id, progress, nativeLanguage);
  if (!context) {
    return { hasCurriculum: false };
  }

  const instruction = `You are a world-class language teacher using the Socratic method. Guide the student through this structured lesson using questioning and discovery.

${context}

Remember:
- Use the Socratic method - guide through questions, not direct instruction
- When introducing new vocabulary, immediately ask the student to recall it
- Be patient and encouraging
- Speak to the student in their native language (${nativeLanguage}) when explaining concepts
- Use the target language for examples and practice`;

  return {
    hasCurriculum: true,
    instruction,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    level: lesson.level,
  };
}
