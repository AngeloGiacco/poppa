/**
 * Curriculum Framework Types
 *
 * Defines the structure for language learning curricula with progressive
 * lessons that build grammar and vocabulary over time.
 */

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonCategory =
  | "greetings"
  | "basics"
  | "numbers"
  | "time"
  | "food"
  | "travel"
  | "shopping"
  | "directions"
  | "weather"
  | "family"
  | "work"
  | "health"
  | "hobbies"
  | "culture"
  | "emotions"
  | "opinions"
  | "hypotheticals"
  | "formal"
  | "idioms"
  | "advanced";

export interface VocabularyItem {
  term: string;
  translation: string;
  example?: string;
}

export interface GrammarPoint {
  name: string;
  description: string;
  examples: string[];
}

export interface Lesson {
  id: number;
  title: string;
  titleTranslationKey?: string;
  level: CEFRLevel;
  category: LessonCategory;
  description: string;
  objectives: string[];
  grammarPoints: GrammarPoint[];
  vocabulary: VocabularyItem[];
  conversationPrompt: string;
  prerequisiteLessonIds: number[];
  estimatedMinutes: number;
}

export interface CurriculumLevel {
  level: CEFRLevel;
  name: string;
  description: string;
  lessonRange: {
    start: number;
    end: number;
  };
}

export interface LanguageCurriculum {
  languageCode: string;
  languageName: string;
  nativeLanguageName: string;
  levels: CurriculumLevel[];
  lessons: Lesson[];
}

export interface UserLessonProgress {
  lessonId: number;
  completedAt: string;
  score?: number;
  notes?: string;
}

export interface UserCurriculumProgress {
  userId: string;
  languageCode: string;
  completedLessons: UserLessonProgress[];
  currentLessonId: number | null;
  currentLevel: CEFRLevel;
  lastActivityAt: string;
}

export interface LessonContext {
  currentLesson: Lesson;
  previousLessons: Lesson[];
  masteredGrammar: GrammarPoint[];
  masteredVocabulary: VocabularyItem[];
  userNativeLanguage: string;
  targetLanguage: string;
}

export interface CurriculumRegistry {
  [languageCode: string]: LanguageCurriculum;
}
