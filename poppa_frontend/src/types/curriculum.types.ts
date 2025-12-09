export type ProficiencyLevel = "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced" | "mastery";

export interface VocabularyItem {
  term: string;
  translation: string;
}

export interface GrammarPoint {
  name: string;
  explanation: string;
}

export interface Lesson {
  id: number;
  title: string;
  level: ProficiencyLevel;
  focus: string;
  grammar: GrammarPoint[];
  vocabulary: VocabularyItem[];
  conversationPrompt: string;
}

export interface LanguageCurriculum {
  languageCode: string;
  languageName: string;
  lessons: Lesson[];
}

export interface UserProgress {
  completedLessonIds: number[];
}
