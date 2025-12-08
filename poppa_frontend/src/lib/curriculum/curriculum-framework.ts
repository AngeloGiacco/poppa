/**
 * Curriculum Framework
 *
 * Central registry and utilities for managing language curricula.
 * Each language has up to 70 lessons organized by CEFR levels.
 */

import {
  LanguageCurriculum,
  CurriculumRegistry,
  Lesson,
  CEFRLevel,
  CurriculumLevel,
  UserCurriculumProgress,
  GrammarPoint,
  VocabularyItem,
} from "@/types/curriculum.types";

const curriculumRegistry: CurriculumRegistry = {};

export const CEFR_LEVELS: CurriculumLevel[] = [
  {
    level: "A1",
    name: "Beginner",
    description: "Basic phrases, greetings, simple questions",
    lessonRange: { start: 1, end: 12 },
  },
  {
    level: "A2",
    name: "Elementary",
    description: "Everyday expressions, basic conversations",
    lessonRange: { start: 13, end: 24 },
  },
  {
    level: "B1",
    name: "Intermediate",
    description: "Main points on familiar topics, travel situations",
    lessonRange: { start: 25, end: 40 },
  },
  {
    level: "B2",
    name: "Upper Intermediate",
    description: "Complex texts, fluent interaction with native speakers",
    lessonRange: { start: 41, end: 55 },
  },
  {
    level: "C1",
    name: "Advanced",
    description: "Demanding texts, flexible and effective language use",
    lessonRange: { start: 56, end: 65 },
  },
  {
    level: "C2",
    name: "Mastery",
    description: "Near-native fluency, nuanced expression",
    lessonRange: { start: 66, end: 70 },
  },
];

export function registerCurriculum(curriculum: LanguageCurriculum): void {
  curriculumRegistry[curriculum.languageCode] = curriculum;
}

export function getCurriculum(
  languageCode: string
): LanguageCurriculum | undefined {
  return curriculumRegistry[languageCode];
}

export function getAllCurriculumCodes(): string[] {
  return Object.keys(curriculumRegistry);
}

export function getLesson(
  languageCode: string,
  lessonId: number
): Lesson | undefined {
  const curriculum = getCurriculum(languageCode);
  if (!curriculum) return undefined;
  return curriculum.lessons.find((l) => l.id === lessonId);
}

export function getLessonsByLevel(
  languageCode: string,
  level: CEFRLevel
): Lesson[] {
  const curriculum = getCurriculum(languageCode);
  if (!curriculum) return [];
  return curriculum.lessons.filter((l) => l.level === level);
}

export function getNextLesson(
  languageCode: string,
  progress: UserCurriculumProgress
): Lesson | undefined {
  const curriculum = getCurriculum(languageCode);
  if (!curriculum) return undefined;

  const completedIds = new Set(progress.completedLessons.map((l) => l.lessonId));

  for (const lesson of curriculum.lessons) {
    if (completedIds.has(lesson.id)) continue;

    const prerequisitesMet = lesson.prerequisiteLessonIds.every((id) =>
      completedIds.has(id)
    );

    if (prerequisitesMet) {
      return lesson;
    }
  }

  return undefined;
}

export function getLevelForLesson(lessonId: number): CEFRLevel {
  for (const level of CEFR_LEVELS) {
    if (
      lessonId >= level.lessonRange.start &&
      lessonId <= level.lessonRange.end
    ) {
      return level.level;
    }
  }
  return "A1";
}

export function getMasteredContent(
  languageCode: string,
  progress: UserCurriculumProgress
): {
  grammar: GrammarPoint[];
  vocabulary: VocabularyItem[];
} {
  const curriculum = getCurriculum(languageCode);
  if (!curriculum) {
    return { grammar: [], vocabulary: [] };
  }

  const completedIds = new Set(progress.completedLessons.map((l) => l.lessonId));
  const grammar: GrammarPoint[] = [];
  const vocabulary: VocabularyItem[] = [];
  const seenGrammar = new Set<string>();
  const seenVocab = new Set<string>();

  for (const lesson of curriculum.lessons) {
    if (!completedIds.has(lesson.id)) continue;

    for (const gp of lesson.grammarPoints) {
      if (!seenGrammar.has(gp.name)) {
        seenGrammar.add(gp.name);
        grammar.push(gp);
      }
    }

    for (const vi of lesson.vocabulary) {
      if (!seenVocab.has(vi.term)) {
        seenVocab.add(vi.term);
        vocabulary.push(vi);
      }
    }
  }

  return { grammar, vocabulary };
}

export function calculateProgress(
  languageCode: string,
  progress: UserCurriculumProgress
): {
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  currentLevel: CEFRLevel;
  levelsCompleted: CEFRLevel[];
} {
  const curriculum = getCurriculum(languageCode);
  if (!curriculum) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      percentComplete: 0,
      currentLevel: "A1",
      levelsCompleted: [],
    };
  }

  const completedIds = new Set(progress.completedLessons.map((l) => l.lessonId));
  const completedCount = completedIds.size;
  const totalCount = curriculum.lessons.length;

  const levelsCompleted: CEFRLevel[] = [];
  let currentLevel: CEFRLevel = "A1";

  for (const level of CEFR_LEVELS) {
    const levelLessons = curriculum.lessons.filter(
      (l) =>
        l.id >= level.lessonRange.start && l.id <= level.lessonRange.end
    );

    const allCompleted = levelLessons.every((l) => completedIds.has(l.id));

    if (allCompleted && levelLessons.length > 0) {
      levelsCompleted.push(level.level);
    } else if (levelLessons.some((l) => completedIds.has(l.id))) {
      currentLevel = level.level;
    } else if (!levelsCompleted.includes(level.level)) {
      currentLevel = level.level;
      break;
    }
  }

  return {
    totalLessons: totalCount,
    completedLessons: completedCount,
    percentComplete:
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    currentLevel,
    levelsCompleted,
  };
}
