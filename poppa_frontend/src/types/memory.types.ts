/**
 * Memory Framework Types
 * Types for the personalized learning memory system
 */

import type { Json } from "./database.types";

// =============================================================================
// Proficiency & Mastery
// =============================================================================

export type ProficiencyLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced"
  | "mastery";

export type SessionType = "lesson" | "review" | "practice" | "assessment";

export type ConceptEventType =
  | "introduced"
  | "reviewed"
  | "correct"
  | "incorrect"
  | "struggled"
  | "mastered"
  | "forgot"
  | "self_corrected";

export type ConceptType = "vocabulary" | "grammar";

// =============================================================================
// Learner Profile
// =============================================================================

export interface LearningStyle {
  visual_learner?: boolean;
  prefers_music_examples?: boolean;
  needs_extra_repetition?: boolean;
  responds_well_to_humor?: boolean;
  optimal_session_length_mins?: number;
  preferred_pace?: "slow" | "moderate" | "fast";
  correction_style?: "gentle" | "direct" | "minimal";
}

export interface SessionPreferences {
  preferred_pace?: "slow" | "moderate" | "fast";
  correction_style?: "gentle" | "direct" | "minimal";
  preferred_session_length?: number;
}

export interface LearnerProfile {
  id: string;
  user_id: string;
  learning_style: LearningStyle;
  interests: string[];
  session_preferences: SessionPreferences;
  cross_language_notes: string | null;
  learner_summary: string | null;
  summary_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Language Progress
// =============================================================================

export interface RecommendedFocus {
  type: "grammar" | "vocabulary";
  concept: string;
  reason: "struggled_recently" | "due_for_review" | "prerequisite" | "next_in_curriculum";
}

export interface LanguageProgress {
  id: string;
  user_id: string;
  language_code: string;
  proficiency_level: ProficiencyLevel;
  proficiency_score: number;
  current_lesson_id: number | null;
  completed_lesson_ids: number[];
  total_session_count: number;
  total_practice_minutes: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_practice_at: string | null;
  vocabulary_learned_count: number;
  vocabulary_mastered_count: number;
  grammar_learned_count: number;
  grammar_mastered_count: number;
  progress_summary: string | null;
  summary_updated_at: string | null;
  recommended_focus: RecommendedFocus[];
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Vocabulary Memory
// =============================================================================

export interface ExampleSentence {
  sentence: string;
  translation: string;
  session_id?: string;
  timestamp?: string;
}

export interface VocabularyMemory {
  id: string;
  user_id: string;
  language_code: string;
  term: string;
  translation: string;
  phonetic: string | null;
  part_of_speech: string | null;
  category: string | null;
  example_sentences: ExampleSentence[];
  mastery_level: number;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  times_seen: number;
  times_correct: number;
  times_incorrect: number;
  common_errors: string[];
  first_introduced_at: string;
  introduced_in_session: string | null;
  curriculum_lesson_id: number | null;
  context_embedding?: number[] | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Grammar Memory
// =============================================================================

export interface GrammarExample {
  target: string;
  native: string;
  pattern?: string;
  session_id?: string;
}

export interface ErrorPattern {
  error: string;
  frequency: number;
  last_occurrence: string;
}

export interface GrammarMemory {
  id: string;
  user_id: string;
  language_code: string;
  concept_name: string;
  concept_display: string;
  category: string | null;
  difficulty_tier: number;
  prerequisites: string[];
  unlocks: string[];
  explanation: string | null;
  example_sentences: GrammarExample[];
  mastery_level: number;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  times_practiced: number;
  times_correct: number;
  times_struggled: number;
  error_patterns: ErrorPattern[];
  first_introduced_at: string;
  introduced_in_session: string | null;
  curriculum_lesson_id: number | null;
  concept_embedding?: number[] | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Lesson Sessions
// =============================================================================

export interface PerformanceMetrics {
  overall_score?: number;
  fluency_score?: number;
  accuracy_score?: number;
  response_time_avg_ms?: number;
  self_corrections?: number;
  tutor_corrections?: number;
}

export interface SessionHighlight {
  type: "breakthrough" | "struggle" | "milestone" | "error_pattern";
  description: string;
  timestamp?: number;
  concept?: string;
}

export interface NextSessionRecommendations {
  review_concepts?: string[];
  introduce_next?: string[];
  suggested_focus?: string;
  difficulty_adjustment?: "easier" | "same" | "harder";
}

export interface LessonSession {
  id: string;
  user_id: string;
  language_code: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  curriculum_lesson_id: number | null;
  lesson_title: string | null;
  lesson_level: string | null;
  session_type: SessionType;
  vocabulary_introduced: string[];
  vocabulary_reviewed: string[];
  grammar_introduced: string[];
  grammar_reviewed: string[];
  custom_topic: string | null;
  performance_metrics: PerformanceMetrics;
  conversation_id: string | null;
  transcript_summary: string | null;
  highlights: SessionHighlight[];
  next_session_recommendations: NextSessionRecommendations;
  transcript_embedding?: number[] | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Concept Events
// =============================================================================

export interface ConceptEventContext {
  expected?: string;
  actual?: string;
  error_type?: string;
  tutor_response?: string;
  user_response?: string;
  self_corrected?: boolean;
  response_time_ms?: number;
  close_attempt?: boolean;
}

export interface ConceptEvent {
  id: string;
  user_id: string;
  session_id: string | null;
  language_code: string;
  event_type: ConceptEventType;
  concept_type: ConceptType;
  concept_id: string | null;
  concept_identifier: string;
  context: ConceptEventContext;
  occurred_at: string;
  session_timestamp_seconds: number | null;
}

// =============================================================================
// Lesson Context (for AI prompt generation)
// =============================================================================

export interface VocabSummary {
  term: string;
  translation: string;
  category?: string;
  mastery_level: number;
}

export interface GrammarSummary {
  concept_name: string;
  concept_display: string;
  category?: string;
  mastery_level: number;
}

export interface VocabWithErrors extends VocabSummary {
  common_errors: string[];
  times_incorrect: number;
}

export interface GrammarWithErrors extends GrammarSummary {
  error_patterns: ErrorPattern[];
  times_struggled: number;
}

export interface ConceptReference {
  type: ConceptType;
  identifier: string;
  reason: string;
}

export interface LessonContext {
  user: {
    firstName: string | null;
    nativeLanguage: string;
    learnerProfile: LearnerProfile | null;
  };
  languageProgress: {
    proficiencyLevel: ProficiencyLevel;
    proficiencyScore: number;
    totalSessions: number;
    totalMinutes: number;
    currentStreak: number;
    lastPracticeAt: string | null;
  };
  recentSessions: {
    count: number;
    lastSessionSummary: string | null;
    conceptsCoveredRecently: string[];
    recentHighlights: SessionHighlight[];
  };
  masteredContent: {
    vocabulary: VocabSummary[];
    grammar: GrammarSummary[];
  };
  dueForReview: {
    vocabulary: VocabularyMemory[];
    grammar: GrammarMemory[];
  };
  strugglingAreas: {
    vocabulary: VocabWithErrors[];
    grammar: GrammarWithErrors[];
    patterns: string[];
  };
  recommendedFocus: {
    reviewPriority: ConceptReference[];
    newConceptsReady: ConceptReference[];
    suggestedTopic: string | null;
  };
  curriculum?: {
    lessonId: number;
    lessonTitle: string;
    lessonLevel: string;
    lessonGrammar: { name: string; explanation: string }[];
    lessonVocabulary: { term: string; translation: string }[];
  };
  crossLanguageAdvantage?: {
    relatedLanguages: string[];
    transferableConcepts: string[];
    accelerationOpportunities: string[];
  };
}

// =============================================================================
// Memory Context Summary (from DB function)
// =============================================================================

export interface MemoryContextSummary {
  progress_data: Json | null;
  mastered_vocab_count: number;
  mastered_grammar_count: number;
  vocab_due_count: number;
  grammar_due_count: number;
  struggling_vocab_count: number;
  struggling_grammar_count: number;
  recent_session_count: number;
}

// =============================================================================
// Natural Language Query
// =============================================================================

export interface QueryPlan {
  queries: QueryDefinition[];
  intent: string;
  confidence: number;
}

export interface QueryDefinition {
  table: "vocabulary_memory" | "grammar_memory" | "lesson_sessions" | "concept_events";
  filters: Record<string, unknown>;
  orderBy?: string;
  limit?: number;
}

export interface NLQueryResult {
  answer: string;
  sources: {
    table: string;
    records: unknown[];
  }[];
  confidence: number;
}

// =============================================================================
// Spaced Repetition
// =============================================================================

export interface ReviewResult {
  quality: number; // 0-5 scale
}

export interface SpacedRepetitionUpdate {
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: Date;
  mastery_level: number;
}

// =============================================================================
// Session Processing
// =============================================================================

export interface TranscriptMessage {
  role: "user" | "agent";
  message: string;
  time_in_call_secs?: number;
}

export interface TranscriptAnalysis {
  vocabularyEvents: VocabularyEvent[];
  grammarEvents: GrammarEvent[];
  performanceMetrics: PerformanceMetrics;
  highlights: SessionHighlight[];
  summary: string;
  recommendations: NextSessionRecommendations;
  learnerInsights?: Partial<LearningStyle>;
}

export interface VocabularyEvent {
  term: string;
  translation: string;
  category?: string;
  event_type: ConceptEventType;
  context?: ConceptEventContext;
  timestamp_seconds?: number;
}

export interface GrammarEvent {
  concept_name: string;
  concept_display: string;
  event_type: ConceptEventType;
  context?: ConceptEventContext;
  timestamp_seconds?: number;
}

// =============================================================================
// Cross-Language Intelligence
// =============================================================================

export interface LanguageFamily {
  name: string;
  languages: string[];
  sharedConcepts: string[];
}

export interface TransferableKnowledge {
  relatedLanguages: string[];
  transferableConcepts: GrammarMemory[];
  accelerationOpportunities: string[];
}

// =============================================================================
// Client Tool Types
// =============================================================================

export interface CheckVocabularyResult {
  seen: boolean;
  mastery: number;
  lastSeen: string | null;
  errorPatterns: string[];
}

export interface ReviewItemsResult {
  vocabulary: VocabularyMemory[];
  grammar: GrammarMemory[];
}

export interface LastSessionResult {
  date: string;
  summary: string;
  vocabularyCovered: string[];
  grammarCovered: string[];
  highlights: SessionHighlight[];
}

// =============================================================================
// API Request/Response Types
// =============================================================================

export interface GenerateContextRequest {
  userId: string;
  languageCode: string;
  options?: {
    useCurriculum?: boolean;
    customTopic?: string;
    sessionType?: SessionType;
    lessonId?: number;
  };
}

export interface GenerateContextResponse {
  context: LessonContext;
  tutorPrompt: string;
}

export interface MemoryQueryRequest {
  userId: string;
  languageCode: string;
  queryType:
    | "check_vocabulary"
    | "get_review_items"
    | "get_last_session"
    | "get_struggling_areas"
    | "get_related_vocabulary"
    | "natural_language";
  params?: Record<string, unknown>;
}

export interface RecordEventRequest {
  userId: string;
  sessionId: string;
  languageCode: string;
  eventType: ConceptEventType;
  conceptType: ConceptType;
  conceptIdentifier: string;
  conceptId?: string;
  context?: ConceptEventContext;
  sessionTimestampSeconds?: number;
}

export interface ProcessSessionRequest {
  userId: string;
  languageCode: string;
  conversationId: string;
  transcript: TranscriptMessage[];
  sessionId: string;
}
