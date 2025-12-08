/**
 * Context Injection Utilities
 *
 * Formats curriculum data and user progress for injection into
 * AI conversation context (ElevenLabs agent prompts).
 */

import {
  Lesson,
  UserCurriculumProgress,
  GrammarPoint,
  VocabularyItem,
  LessonContext,
} from "@/types/curriculum.types";
import {
  getCurriculum,
  getLesson,
  getMasteredContent,
  calculateProgress,
} from "@/lib/curriculum/curriculum-framework";

export interface InjectionContext {
  lessonPrompt: string;
  systemContext: string;
  fullContext: string;
}

function formatGrammarPoints(points: GrammarPoint[]): string {
  if (points.length === 0) return "None yet";

  return points
    .map((gp) => `- ${gp.name}: ${gp.description}`)
    .join("\n");
}

function formatVocabulary(vocab: VocabularyItem[], limit = 20): string {
  if (vocab.length === 0) return "None yet";

  const items = vocab.slice(-limit);
  return items.map((v) => `- ${v.term} = ${v.translation}`).join("\n");
}

function formatObjectives(objectives: string[]): string {
  return objectives.map((o, i) => `${i + 1}. ${o}`).join("\n");
}

export function buildLessonContext(
  languageCode: string,
  lessonId: number,
  progress: UserCurriculumProgress,
  userNativeLanguage: string
): LessonContext | null {
  const curriculum = getCurriculum(languageCode);
  const lesson = getLesson(languageCode, lessonId);

  if (!curriculum || !lesson) return null;

  const completedIds = new Set(progress.completedLessons.map((l) => l.lessonId));
  const previousLessons = curriculum.lessons.filter((l) =>
    completedIds.has(l.id)
  );

  const { grammar, vocabulary } = getMasteredContent(languageCode, progress);

  return {
    currentLesson: lesson,
    previousLessons,
    masteredGrammar: grammar,
    masteredVocabulary: vocabulary,
    userNativeLanguage,
    targetLanguage: curriculum.languageName,
  };
}

export function generateLessonPrompt(lesson: Lesson): string {
  return `
## Current Lesson: ${lesson.title}

${lesson.description}

### Learning Objectives
${formatObjectives(lesson.objectives)}

### Grammar Focus
${lesson.grammarPoints.map((gp) => `**${gp.name}**: ${gp.description}\nExamples: ${gp.examples.join(", ")}`).join("\n\n")}

### Key Vocabulary
${lesson.vocabulary.map((v) => `- **${v.term}** = ${v.translation}${v.example ? ` (e.g., "${v.example}")` : ""}`).join("\n")}

### Conversation Guidance
${lesson.conversationPrompt}
`.trim();
}

export function generateSystemContext(
  context: LessonContext,
  progress: UserCurriculumProgress
): string {
  const progressStats = calculateProgress(context.targetLanguage, progress);

  return `
## Student Profile

- Native Language: ${context.userNativeLanguage}
- Target Language: ${context.targetLanguage}
- Current Level: ${progressStats.currentLevel}
- Lessons Completed: ${progressStats.completedLessons}/${progressStats.totalLessons}
- Levels Completed: ${progressStats.levelsCompleted.join(", ") || "None yet"}

## Previously Mastered Grammar
${formatGrammarPoints(context.masteredGrammar)}

## Recently Learned Vocabulary (last 20 items)
${formatVocabulary(context.masteredVocabulary, 20)}

## Recent Lesson Topics
${context.previousLessons.slice(-5).map((l) => `- Lesson ${l.id}: ${l.title}`).join("\n") || "No previous lessons"}
`.trim();
}

export function generateFullContext(
  languageCode: string,
  lessonId: number,
  progress: UserCurriculumProgress,
  userNativeLanguage: string
): InjectionContext | null {
  const context = buildLessonContext(
    languageCode,
    lessonId,
    progress,
    userNativeLanguage
  );

  if (!context) return null;

  const lessonPrompt = generateLessonPrompt(context.currentLesson);
  const systemContext = generateSystemContext(context, progress);

  const fullContext = `
${systemContext}

---

${lessonPrompt}
`.trim();

  return {
    lessonPrompt,
    systemContext,
    fullContext,
  };
}

export function generateQuickContext(
  lesson: Lesson,
  masteredGrammarNames: string[],
  masteredVocabCount: number,
  currentLevel: string
): string {
  return `
LESSON: ${lesson.title} (${lesson.level})
STUDENT LEVEL: ${currentLevel}
PRIOR GRAMMAR: ${masteredGrammarNames.slice(-10).join(", ") || "None"}
VOCAB LEARNED: ${masteredVocabCount} words

OBJECTIVES:
${lesson.objectives.map((o) => `- ${o}`).join("\n")}

FOCUS: ${lesson.grammarPoints.map((g) => g.name).join(", ")}

${lesson.conversationPrompt}
`.trim();
}
