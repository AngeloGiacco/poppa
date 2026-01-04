/**
 * Mock utilities for memory framework tests
 */

import type {
  LearnerProfile,
  LanguageProgress,
  VocabularyMemory,
  GrammarMemory,
  LessonSession,
  ConceptEvent,
  LessonContext,
  TranscriptMessage,
} from "@/types/memory.types";

// Mock Supabase client with explicit typing
interface MockChain {
  from: jest.Mock;
  select: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  upsert: jest.Mock;
  delete: jest.Mock;
  eq: jest.Mock;
  neq: jest.Mock;
  lt: jest.Mock;
  lte: jest.Mock;
  gt: jest.Mock;
  gte: jest.Mock;
  in: jest.Mock;
  contains: jest.Mock;
  is: jest.Mock;
  order: jest.Mock;
  limit: jest.Mock;
  range: jest.Mock;
  single: jest.Mock;
  rpc: jest.Mock;
}

export const mockSupabaseClient: MockChain = {} as MockChain;
mockSupabaseClient.from = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.select = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.insert = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.update = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.upsert = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.delete = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.eq = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.neq = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.lt = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.lte = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.gt = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.gte = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.in = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.contains = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.is = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.order = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.limit = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.range = jest.fn(() => mockSupabaseClient);
mockSupabaseClient.single = jest.fn(() => Promise.resolve({ data: null, error: null }));
mockSupabaseClient.rpc = jest.fn(() => Promise.resolve({ data: null, error: null }));

// Reset all mocks
export const resetMocks = (): void => {
  Object.values(mockSupabaseClient).forEach((mock: jest.Mock) => {
    mock.mockClear();
  });
};

// Factory functions for creating test data

export const createMockLearnerProfile = (
  overrides: Partial<LearnerProfile> = {}
): LearnerProfile => ({
  id: "profile-1",
  user_id: "user-1",
  learning_style: {
    prefers_music_examples: false,
    responds_well_to_humor: false,
    needs_extra_repetition: false,
  },
  interests: [],
  session_preferences: {
    preferred_pace: "moderate",
    correction_style: "gentle",
  },
  cross_language_notes: null,
  learner_summary: null,
  summary_updated_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockLanguageProgress = (
  overrides: Partial<LanguageProgress> = {}
): LanguageProgress => ({
  id: "progress-1",
  user_id: "user-1",
  language_code: "spa",
  proficiency_level: "beginner",
  proficiency_score: 0,
  current_lesson_id: null,
  completed_lesson_ids: [],
  total_session_count: 0,
  total_practice_minutes: 0,
  current_streak_days: 0,
  longest_streak_days: 0,
  last_practice_at: null,
  vocabulary_learned_count: 0,
  vocabulary_mastered_count: 0,
  grammar_learned_count: 0,
  grammar_mastered_count: 0,
  progress_summary: null,
  summary_updated_at: null,
  recommended_focus: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockVocabulary = (
  overrides: Partial<VocabularyMemory> = {}
): VocabularyMemory => ({
  id: "vocab-1",
  user_id: "user-1",
  language_code: "spa",
  term: "hola",
  translation: "hello",
  phonetic: "oh-lah",
  part_of_speech: "interjection",
  category: "greetings",
  example_sentences: [],
  mastery_level: 0.5,
  easiness_factor: 2.5,
  interval_days: 3,
  repetitions: 2,
  next_review_at: new Date().toISOString(),
  last_reviewed_at: new Date().toISOString(),
  times_seen: 5,
  times_correct: 4,
  times_incorrect: 1,
  common_errors: [],
  first_introduced_at: new Date().toISOString(),
  introduced_in_session: null,
  curriculum_lesson_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockGrammar = (overrides: Partial<GrammarMemory> = {}): GrammarMemory => ({
  id: "grammar-1",
  user_id: "user-1",
  language_code: "spa",
  concept_name: "present_tense_regular_ar",
  concept_display: "Present Tense: Regular -AR Verbs",
  category: "tense",
  difficulty_tier: 1,
  prerequisites: [],
  unlocks: ["present_tense_irregular"],
  explanation: "Regular -AR verbs conjugate by dropping -ar and adding personal endings.",
  example_sentences: [],
  mastery_level: 0.5,
  easiness_factor: 2.5,
  interval_days: 3,
  repetitions: 2,
  next_review_at: new Date().toISOString(),
  last_reviewed_at: new Date().toISOString(),
  times_practiced: 5,
  times_correct: 4,
  times_struggled: 1,
  error_patterns: [],
  first_introduced_at: new Date().toISOString(),
  introduced_in_session: null,
  curriculum_lesson_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockSession = (overrides: Partial<LessonSession> = {}): LessonSession => ({
  id: "session-1",
  user_id: "user-1",
  language_code: "spa",
  started_at: new Date().toISOString(),
  ended_at: null,
  duration_seconds: null,
  curriculum_lesson_id: null,
  lesson_title: "Greetings and Introductions",
  lesson_level: "beginner",
  session_type: "lesson",
  vocabulary_introduced: [],
  vocabulary_reviewed: [],
  grammar_introduced: [],
  grammar_reviewed: [],
  custom_topic: null,
  performance_metrics: {},
  conversation_id: null,
  transcript_summary: null,
  highlights: [],
  next_session_recommendations: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockConceptEvent = (overrides: Partial<ConceptEvent> = {}): ConceptEvent => ({
  id: "event-1",
  user_id: "user-1",
  session_id: "session-1",
  language_code: "spa",
  event_type: "correct",
  concept_type: "vocabulary",
  concept_id: "vocab-1",
  concept_identifier: "hola",
  context: {},
  occurred_at: new Date().toISOString(),
  session_timestamp_seconds: null,
  ...overrides,
});

export const createMockTranscript = (): TranscriptMessage[] => [
  {
    role: "agent",
    message: "Welcome! Today we're going to learn some basic greetings in Spanish.",
    time_in_call_secs: 0,
  },
  {
    role: "agent",
    message: "The word for hello in Spanish is 'hola'. Can you say that?",
    time_in_call_secs: 5,
  },
  {
    role: "user",
    message: "Hola",
    time_in_call_secs: 8,
  },
  {
    role: "agent",
    message: "Perfect! Now, how would you say goodbye? It's 'adiós'.",
    time_in_call_secs: 12,
  },
  {
    role: "user",
    message: "Adiós",
    time_in_call_secs: 15,
  },
];

export const createMockLessonContext = (overrides: Partial<LessonContext> = {}): LessonContext => ({
  user: {
    firstName: "Maria",
    nativeLanguage: "English",
    learnerProfile: null,
  },
  languageProgress: {
    proficiencyLevel: "beginner",
    proficiencyScore: 15,
    totalSessions: 3,
    totalMinutes: 45,
    currentStreak: 3,
    lastPracticeAt: new Date().toISOString(),
  },
  recentSessions: {
    count: 3,
    lastSessionSummary: "Practiced greetings and basic introductions.",
    conceptsCoveredRecently: ["hola", "adios", "present_tense"],
    recentHighlights: [],
  },
  masteredContent: {
    vocabulary: [],
    grammar: [],
  },
  dueForReview: {
    vocabulary: [],
    grammar: [],
  },
  strugglingAreas: {
    vocabulary: [],
    grammar: [],
    patterns: [],
  },
  recommendedFocus: {
    reviewPriority: [],
    newConceptsReady: [],
    suggestedTopic: null,
  },
  ...overrides,
});
