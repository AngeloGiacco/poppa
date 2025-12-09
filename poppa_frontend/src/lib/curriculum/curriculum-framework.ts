import {
  LanguageCurriculum,
  Lesson,
  UserProgress,
  GrammarPoint,
  VocabularyItem,
} from "@/types/curriculum.types";

const registry: Record<string, LanguageCurriculum> = {};

export function registerCurriculum(curriculum: LanguageCurriculum): void {
  registry[curriculum.languageCode] = curriculum;
}

export function getCurriculum(languageCode: string): LanguageCurriculum | undefined {
  return registry[languageCode];
}

export function getLesson(languageCode: string, lessonId: number): Lesson | undefined {
  return registry[languageCode]?.lessons.find((l) => l.id === lessonId);
}

export function getNextLesson(languageCode: string, progress: UserProgress): Lesson | undefined {
  const curriculum = registry[languageCode];
  if (!curriculum) return undefined;

  const completed = new Set(progress.completedLessonIds);
  return curriculum.lessons.find((l) => !completed.has(l.id));
}

export function getMasteredContent(
  languageCode: string,
  progress: UserProgress
): { grammar: GrammarPoint[]; vocabulary: VocabularyItem[] } {
  const curriculum = registry[languageCode];
  if (!curriculum) return { grammar: [], vocabulary: [] };

  const completed = new Set(progress.completedLessonIds);
  const grammar: GrammarPoint[] = [];
  const vocabulary: VocabularyItem[] = [];
  const seenGrammar = new Set<string>();
  const seenVocab = new Set<string>();

  for (const lesson of curriculum.lessons) {
    if (!completed.has(lesson.id)) continue;

    for (const g of lesson.grammar) {
      if (!seenGrammar.has(g.name)) {
        seenGrammar.add(g.name);
        grammar.push(g);
      }
    }

    for (const v of lesson.vocabulary) {
      if (!seenVocab.has(v.term)) {
        seenVocab.add(v.term);
        vocabulary.push(v);
      }
    }
  }

  return { grammar, vocabulary };
}
