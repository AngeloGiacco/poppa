/**
 * Lesson Context Generator
 * Generates comprehensive context for AI tutor at lesson start
 */

import supabaseClient from "@/lib/supabase";
import type {
  LessonContext,
  LearnerProfile,
  LanguageProgress,
  VocabularyMemory,
  GrammarMemory,
  LessonSession,
  VocabSummary,
  GrammarSummary,
  VocabWithErrors,
  GrammarWithErrors,
  SessionHighlight,
  ConceptReference,
  SessionType,
  ErrorPattern,
} from "@/types/memory.types";

import { getTransferableKnowledge } from "./cross-language";
import {
  getMasteredVocabulary,
  getMasteredGrammar,
  getVocabularyDueForReview,
  getGrammarDueForReview,
  getVocabularyStrugglePoints,
  getGrammarStrugglePoints,
  getRecentSessions,
} from "./realtime-queries";

export interface GenerateContextOptions {
  useCurriculum?: boolean;
  customTopic?: string;
  sessionType?: SessionType;
  lessonId?: number;
  lessonTitle?: string;
  lessonLevel?: string;
  lessonGrammar?: Array<{ name: string; explanation: string }>;
  lessonVocabulary?: Array<{ term: string; translation: string }>;
}

/**
 * Generate comprehensive lesson context for the AI tutor
 */
export async function generateLessonContext(
  userId: string,
  languageCode: string,
  options?: GenerateContextOptions
): Promise<LessonContext> {
  // Fetch all required data in parallel
  const [
    userProfile,
    learnerProfile,
    languageProgress,
    masteredVocab,
    masteredGrammar,
    vocabDueForReview,
    grammarDueForReview,
    strugglingVocab,
    strugglingGrammar,
    recentSessions,
    transferableKnowledge,
  ] = await Promise.all([
    getUserProfile(userId),
    getLearnerProfile(userId),
    getLanguageProgress(userId, languageCode),
    getMasteredVocabulary(userId, languageCode, 30),
    getMasteredGrammar(userId, languageCode, 15),
    getVocabularyDueForReview(userId, languageCode, 15),
    getGrammarDueForReview(userId, languageCode, 5),
    getVocabularyStrugglePoints(userId, languageCode, 10),
    getGrammarStrugglePoints(userId, languageCode, 5),
    getRecentSessions(userId, languageCode, 5),
    getTransferableKnowledge(userId, languageCode),
  ]);

  // Build context object
  const context: LessonContext = {
    user: {
      firstName: userProfile?.first_name || null,
      nativeLanguage: userProfile?.native_language || "English",
      learnerProfile,
    },
    languageProgress: buildLanguageProgressSection(languageProgress),
    recentSessions: buildRecentSessionsSection(recentSessions),
    masteredContent: {
      vocabulary: masteredVocab.map(toVocabSummary),
      grammar: masteredGrammar.map(toGrammarSummary),
    },
    dueForReview: {
      vocabulary: vocabDueForReview,
      grammar: grammarDueForReview,
    },
    strugglingAreas: buildStrugglingAreasSection(strugglingVocab, strugglingGrammar),
    recommendedFocus: buildRecommendedFocus(
      vocabDueForReview,
      grammarDueForReview,
      strugglingVocab,
      strugglingGrammar,
      options?.customTopic
    ),
  };

  // Add curriculum context if provided
  if (options?.useCurriculum && options.lessonId) {
    context.curriculum = {
      lessonId: options.lessonId,
      lessonTitle: options.lessonTitle || "",
      lessonLevel: options.lessonLevel || "",
      lessonGrammar: options.lessonGrammar || [],
      lessonVocabulary: options.lessonVocabulary || [],
    };
  }

  // Add cross-language advantage if applicable
  if (transferableKnowledge && transferableKnowledge.accelerationOpportunities.length > 0) {
    context.crossLanguageAdvantage = {
      relatedLanguages: transferableKnowledge.relatedLanguages,
      transferableConcepts: transferableKnowledge.transferableConcepts.map(
        (c) => c.concept_display
      ),
      accelerationOpportunities: transferableKnowledge.accelerationOpportunities,
    };
  }

  return context;
}

// Helper functions

async function getUserProfile(
  userId: string
): Promise<{ first_name: string | null; native_language: string } | null> {
  const { data } = await supabaseClient
    .from("users")
    .select("first_name, native_language")
    .eq("id", userId)
    .single();

  return data;
}

async function getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
  const { data } = await supabaseClient
    .from("learner_profile")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data as LearnerProfile | null;
}

async function getLanguageProgress(
  userId: string,
  languageCode: string
): Promise<LanguageProgress | null> {
  const { data } = await supabaseClient
    .from("language_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .single();

  return data as LanguageProgress | null;
}

function buildLanguageProgressSection(
  progress: LanguageProgress | null
): LessonContext["languageProgress"] {
  if (!progress) {
    return {
      proficiencyLevel: "beginner",
      proficiencyScore: 0,
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      lastPracticeAt: null,
    };
  }

  return {
    proficiencyLevel: progress.proficiency_level,
    proficiencyScore: progress.proficiency_score,
    totalSessions: progress.total_session_count,
    totalMinutes: progress.total_practice_minutes,
    currentStreak: progress.current_streak_days,
    lastPracticeAt: progress.last_practice_at,
  };
}

function buildRecentSessionsSection(sessions: LessonSession[]): LessonContext["recentSessions"] {
  const lastSession = sessions[0];
  const allHighlights: SessionHighlight[] = [];
  const conceptsCovered: string[] = [];

  for (const session of sessions) {
    if (session.highlights) {
      allHighlights.push(...(session.highlights as SessionHighlight[]));
    }
    conceptsCovered.push(...session.vocabulary_introduced, ...session.grammar_introduced);
  }

  return {
    count: sessions.length,
    lastSessionSummary: lastSession?.transcript_summary || null,
    conceptsCoveredRecently: [...new Set(conceptsCovered)],
    recentHighlights: allHighlights.slice(0, 5),
  };
}

function buildStrugglingAreasSection(
  vocab: VocabularyMemory[],
  grammar: GrammarMemory[]
): LessonContext["strugglingAreas"] {
  const vocabWithErrors: VocabWithErrors[] = vocab.map((v) => ({
    term: v.term,
    translation: v.translation,
    category: v.category || undefined,
    mastery_level: v.mastery_level,
    common_errors: v.common_errors || [],
    times_incorrect: v.times_incorrect,
  }));

  const grammarWithErrors: GrammarWithErrors[] = grammar.map((g) => ({
    concept_name: g.concept_name,
    concept_display: g.concept_display,
    category: g.category || undefined,
    mastery_level: g.mastery_level,
    error_patterns: (g.error_patterns as ErrorPattern[]) || [],
    times_struggled: g.times_struggled,
  }));

  // Detect patterns in errors
  const patterns: string[] = [];
  const errorTypes = new Map<string, number>();

  for (const v of vocab) {
    for (const error of v.common_errors || []) {
      errorTypes.set(error, (errorTypes.get(error) || 0) + 1);
    }
  }

  for (const g of grammar) {
    for (const ep of (g.error_patterns as ErrorPattern[]) || []) {
      errorTypes.set(ep.error, (errorTypes.get(ep.error) || 0) + ep.frequency);
    }
  }

  for (const [error, count] of errorTypes) {
    if (count >= 3) {
      patterns.push(error);
    }
  }

  return {
    vocabulary: vocabWithErrors,
    grammar: grammarWithErrors,
    patterns,
  };
}

function buildRecommendedFocus(
  vocabDue: VocabularyMemory[],
  grammarDue: GrammarMemory[],
  vocabStruggling: VocabularyMemory[],
  grammarStruggling: GrammarMemory[],
  customTopic?: string
): LessonContext["recommendedFocus"] {
  const reviewPriority: ConceptReference[] = [];
  const newConceptsReady: ConceptReference[] = [];

  // Add struggling items as high priority
  for (const v of vocabStruggling.slice(0, 5)) {
    reviewPriority.push({
      type: "vocabulary",
      identifier: v.term,
      reason: "Needs reinforcement",
    });
  }

  for (const g of grammarStruggling.slice(0, 3)) {
    reviewPriority.push({
      type: "grammar",
      identifier: g.concept_name,
      reason: "Struggling with this concept",
    });
  }

  // Add due items
  for (const v of vocabDue.slice(0, 5)) {
    if (!reviewPriority.some((r) => r.identifier === v.term)) {
      reviewPriority.push({
        type: "vocabulary",
        identifier: v.term,
        reason: "Due for review",
      });
    }
  }

  for (const g of grammarDue.slice(0, 2)) {
    if (!reviewPriority.some((r) => r.identifier === g.concept_name)) {
      reviewPriority.push({
        type: "grammar",
        identifier: g.concept_name,
        reason: "Due for review",
      });
    }
  }

  return {
    reviewPriority,
    newConceptsReady,
    suggestedTopic: customTopic || null,
  };
}

function toVocabSummary(vocab: VocabularyMemory): VocabSummary {
  return {
    term: vocab.term,
    translation: vocab.translation,
    category: vocab.category || undefined,
    mastery_level: vocab.mastery_level,
  };
}

function toGrammarSummary(grammar: GrammarMemory): GrammarSummary {
  return {
    concept_name: grammar.concept_name,
    concept_display: grammar.concept_display,
    category: grammar.category || undefined,
    mastery_level: grammar.mastery_level,
  };
}
