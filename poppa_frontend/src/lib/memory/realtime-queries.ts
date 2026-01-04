/**
 * Real-time Memory Queries
 * Functions for mid-lesson memory lookups
 */

import supabaseClient from "@/lib/supabase";
import type {
  VocabularyMemory,
  GrammarMemory,
  LessonSession,
  CheckVocabularyResult,
  ReviewItemsResult,
  LastSessionResult,
  SessionHighlight,
} from "@/types/memory.types";

/**
 * Check if a student has seen a vocabulary item before
 */
export async function checkVocabularyHistory(
  userId: string,
  languageCode: string,
  term: string
): Promise<CheckVocabularyResult> {
  const { data: vocab } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .eq("term", term)
    .single();

  if (!vocab) {
    return {
      seen: false,
      mastery: 0,
      lastSeen: null,
      errorPatterns: [],
    };
  }

  return {
    seen: true,
    mastery: vocab.mastery_level,
    lastSeen: vocab.last_reviewed_at,
    errorPatterns: vocab.common_errors || [],
  };
}

/**
 * Get vocabulary items due for review
 */
export async function getVocabularyDueForReview(
  userId: string,
  languageCode: string,
  limit: number = 10
): Promise<VocabularyMemory[]> {
  const { data } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true })
    .limit(limit);

  return (data as VocabularyMemory[]) || [];
}

/**
 * Get grammar concepts due for review
 */
export async function getGrammarDueForReview(
  userId: string,
  languageCode: string,
  limit: number = 5
): Promise<GrammarMemory[]> {
  const { data } = await supabaseClient
    .from("grammar_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true })
    .limit(limit);

  return (data as GrammarMemory[]) || [];
}

/**
 * Get all items due for review
 */
export async function getReviewItems(
  userId: string,
  languageCode: string
): Promise<ReviewItemsResult> {
  const [vocabulary, grammar] = await Promise.all([
    getVocabularyDueForReview(userId, languageCode),
    getGrammarDueForReview(userId, languageCode),
  ]);

  return { vocabulary, grammar };
}

/**
 * Get grammar concepts the student struggles with
 */
export async function getGrammarStrugglePoints(
  userId: string,
  languageCode: string,
  limit: number = 5
): Promise<GrammarMemory[]> {
  const { data } = await supabaseClient
    .from("grammar_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .lt("mastery_level", 0.5)
    .gt("times_practiced", 1)
    .order("times_struggled", { ascending: false })
    .limit(limit);

  return (data as GrammarMemory[]) || [];
}

/**
 * Get vocabulary items the student struggles with
 */
export async function getVocabularyStrugglePoints(
  userId: string,
  languageCode: string,
  limit: number = 10
): Promise<VocabularyMemory[]> {
  const { data } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .lt("mastery_level", 0.5)
    .gt("times_seen", 1)
    .order("times_incorrect", { ascending: false })
    .limit(limit);

  return (data as VocabularyMemory[]) || [];
}

/**
 * Get the last session summary
 */
export async function getLastSessionSummary(
  userId: string,
  languageCode: string
): Promise<LastSessionResult | null> {
  const { data } = await supabaseClient
    .from("lesson_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;

  const session = data as LessonSession;

  return {
    date: session.started_at,
    summary: session.transcript_summary || "",
    vocabularyCovered: [
      ...session.vocabulary_introduced,
      ...session.vocabulary_reviewed,
    ],
    grammarCovered: [
      ...session.grammar_introduced,
      ...session.grammar_reviewed,
    ],
    highlights: session.highlights as SessionHighlight[],
  };
}

/**
 * Get recent sessions
 */
export async function getRecentSessions(
  userId: string,
  languageCode: string,
  limit: number = 5
): Promise<LessonSession[]> {
  const { data } = await supabaseClient
    .from("lesson_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .order("started_at", { ascending: false })
    .limit(limit);

  return (data as LessonSession[]) || [];
}

/**
 * Get related vocabulary by category
 */
export async function getRelatedVocabulary(
  userId: string,
  languageCode: string,
  category: string,
  limit: number = 5
): Promise<VocabularyMemory[]> {
  const { data } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .eq("category", category)
    .order("mastery_level", { ascending: false })
    .limit(limit);

  return (data as VocabularyMemory[]) || [];
}

/**
 * Get mastered vocabulary
 */
export async function getMasteredVocabulary(
  userId: string,
  languageCode: string,
  limit: number = 50
): Promise<VocabularyMemory[]> {
  const { data } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .gte("mastery_level", 0.8)
    .order("mastery_level", { ascending: false })
    .limit(limit);

  return (data as VocabularyMemory[]) || [];
}

/**
 * Get mastered grammar
 */
export async function getMasteredGrammar(
  userId: string,
  languageCode: string,
  limit: number = 20
): Promise<GrammarMemory[]> {
  const { data } = await supabaseClient
    .from("grammar_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .gte("mastery_level", 0.8)
    .order("mastery_level", { ascending: false })
    .limit(limit);

  return (data as GrammarMemory[]) || [];
}

/**
 * Check if a grammar concept has been introduced
 */
export async function checkGrammarHistory(
  userId: string,
  languageCode: string,
  conceptName: string
): Promise<{
  introduced: boolean;
  mastery: number;
  lastPracticed: string | null;
  errorPatterns: { error: string; frequency: number }[];
}> {
  const { data: grammar } = await supabaseClient
    .from("grammar_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .eq("concept_name", conceptName)
    .single();

  if (!grammar) {
    return {
      introduced: false,
      mastery: 0,
      lastPracticed: null,
      errorPatterns: [],
    };
  }

  return {
    introduced: true,
    mastery: grammar.mastery_level,
    lastPracticed: grammar.last_reviewed_at,
    errorPatterns: (grammar.error_patterns as { error: string; frequency: number }[]) || [],
  };
}

/**
 * Get vocabulary by mastery range
 */
export async function getVocabularyByMastery(
  userId: string,
  languageCode: string,
  minMastery: number,
  maxMastery: number,
  limit: number = 20
): Promise<VocabularyMemory[]> {
  const { data } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .gte("mastery_level", minMastery)
    .lte("mastery_level", maxMastery)
    .order("mastery_level", { ascending: true })
    .limit(limit);

  return (data as VocabularyMemory[]) || [];
}
