/**
 * ElevenLabs Client Tools
 * Memory functions available during voice conversations
 */

import {
  checkVocabularyHistory,
  getVocabularyDueForReview,
  getGrammarDueForReview,
  getLastSessionSummary,
  getGrammarStrugglePoints,
  getVocabularyStrugglePoints,
  getRelatedVocabulary,
  checkGrammarHistory,
} from "./realtime-queries";
import { queryMemoryNaturalLanguage } from "./natural-language-query";
import { createLessonSession } from "./session-processor";
import supabaseClient from "@/lib/supabase";
import type { ConceptEventType } from "@/types/memory.types";

/**
 * Format relative time for display
 */
function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "never";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

/**
 * Create memory client tools for ElevenLabs conversation
 */
export function createMemoryClientTools(
  userId: string,
  languageCode: string,
  sessionId: string
) {
  return {
    /**
     * Check if student has seen a vocabulary word before
     */
    checkVocabulary: async ({ term }: { term: string }) => {
      const result = await checkVocabularyHistory(userId, languageCode, term);

      if (!result.seen) {
        return `Student has not seen "${term}" before. This is new vocabulary.`;
      }

      const mastery = Math.round(result.mastery * 100);
      let response = `Student knows "${term}" (mastery: ${mastery}%). `;
      response += `Last practiced: ${formatRelativeTime(result.lastSeen)}. `;

      if (result.errorPatterns.length > 0) {
        response += `Common errors: ${result.errorPatterns.join(", ")}`;
      } else {
        response += "No common errors recorded.";
      }

      return response;
    },

    /**
     * Check if a grammar concept has been introduced
     */
    checkGrammar: async ({ concept }: { concept: string }) => {
      const result = await checkGrammarHistory(userId, languageCode, concept);

      if (!result.introduced) {
        return `Grammar concept "${concept}" has not been introduced yet.`;
      }

      const mastery = Math.round(result.mastery * 100);
      let response = `Student has studied "${concept}" (mastery: ${mastery}%). `;
      response += `Last practiced: ${formatRelativeTime(result.lastPracticed)}. `;

      if (result.errorPatterns.length > 0) {
        response += `Common error: ${result.errorPatterns[0].error}`;
      }

      return response;
    },

    /**
     * Get items due for review
     */
    getReviewItems: async () => {
      const [vocab, grammar] = await Promise.all([
        getVocabularyDueForReview(userId, languageCode, 5),
        getGrammarDueForReview(userId, languageCode, 3),
      ]);

      if (vocab.length === 0 && grammar.length === 0) {
        return "No items are currently due for review.";
      }

      let response = "Due for review:\n";
      if (vocab.length > 0) {
        response += `Vocabulary: ${vocab.map((v) => v.term).join(", ")}\n`;
      }
      if (grammar.length > 0) {
        response += `Grammar: ${grammar.map((g) => g.concept_display).join(", ")}`;
      }

      return response;
    },

    /**
     * Get what was covered in the last session
     */
    getLastSession: async () => {
      const session = await getLastSessionSummary(userId, languageCode);

      if (!session) {
        return "This is the student's first session in this language.";
      }

      let response = `Last session (${formatRelativeTime(session.date)}):\n`;
      if (session.summary) {
        response += `Summary: ${session.summary}\n`;
      }
      if (session.vocabularyCovered.length > 0) {
        response += `Vocabulary covered: ${session.vocabularyCovered.join(", ")}\n`;
      }
      if (session.grammarCovered.length > 0) {
        response += `Grammar covered: ${session.grammarCovered.join(", ")}`;
      }

      return response;
    },

    /**
     * Get areas the student struggles with
     */
    getStrugglingAreas: async () => {
      const [vocab, grammar] = await Promise.all([
        getVocabularyStrugglePoints(userId, languageCode, 5),
        getGrammarStrugglePoints(userId, languageCode, 3),
      ]);

      if (vocab.length === 0 && grammar.length === 0) {
        return "No significant struggle points identified yet.";
      }

      let response = "Areas needing work:\n";
      if (vocab.length > 0) {
        response += `Vocabulary: ${vocab.map((v) => `${v.term} (${v.times_incorrect} errors)`).join(", ")}\n`;
      }
      if (grammar.length > 0) {
        response += `Grammar: ${grammar.map((g) => g.concept_display).join(", ")}`;
      }

      return response;
    },

    /**
     * Get related vocabulary by category
     */
    getRelatedWords: async ({ category }: { category: string }) => {
      const vocab = await getRelatedVocabulary(
        userId,
        languageCode,
        category,
        5
      );

      if (vocab.length === 0) {
        return `No vocabulary found in the "${category}" category.`;
      }

      return `Related ${category} vocabulary: ${vocab.map((v) => `${v.term} (${v.translation})`).join(", ")}`;
    },

    /**
     * Record when student demonstrates vocabulary correctly/incorrectly
     */
    recordVocabularyUsage: async ({
      term,
      correct,
      context,
    }: {
      term: string;
      correct: boolean;
      context?: string;
    }) => {
      const eventType: ConceptEventType = correct ? "correct" : "incorrect";

      await supabaseClient.from("concept_events").insert({
        user_id: userId,
        session_id: sessionId,
        language_code: languageCode,
        event_type: eventType,
        concept_type: "vocabulary",
        concept_identifier: term,
        context: context ? { user_response: context } : {},
      });

      // Update vocabulary memory
      if (correct) {
        await supabaseClient.rpc("update_vocabulary_after_review", {
          p_user_id: userId,
          p_language_code: languageCode,
          p_term: term,
          p_quality: 4, // Correct response
        });
      } else {
        await supabaseClient.rpc("update_vocabulary_after_review", {
          p_user_id: userId,
          p_language_code: languageCode,
          p_term: term,
          p_quality: 1, // Incorrect response
        });
      }

      return correct
        ? `Recorded successful use of "${term}"`
        : `Recorded difficulty with "${term}" - will reinforce`;
    },

    /**
     * Record when student demonstrates grammar correctly/incorrectly
     */
    recordGrammarUsage: async ({
      concept,
      correct,
      context,
    }: {
      concept: string;
      correct: boolean;
      context?: string;
    }) => {
      const eventType: ConceptEventType = correct ? "correct" : "struggled";

      await supabaseClient.from("concept_events").insert({
        user_id: userId,
        session_id: sessionId,
        language_code: languageCode,
        event_type: eventType,
        concept_type: "grammar",
        concept_identifier: concept,
        context: context ? { user_response: context } : {},
      });

      // Update grammar memory
      if (correct) {
        await supabaseClient.rpc("update_grammar_after_practice", {
          p_user_id: userId,
          p_language_code: languageCode,
          p_concept_name: concept,
          p_quality: 4,
        });
      } else {
        await supabaseClient.rpc("update_grammar_after_practice", {
          p_user_id: userId,
          p_language_code: languageCode,
          p_concept_name: concept,
          p_quality: 1,
        });
      }

      return correct
        ? `Recorded successful use of ${concept}`
        : `Recorded struggle with ${concept}`;
    },

    /**
     * Natural language query about the student
     */
    askAboutStudent: async ({ question }: { question: string }) => {
      const result = await queryMemoryNaturalLanguage(
        userId,
        languageCode,
        question
      );

      return result.answer;
    },

    /**
     * Log a new vocabulary word introduced in this session
     */
    logNewVocabulary: async ({
      term,
      translation,
      category,
    }: {
      term: string;
      translation: string;
      category?: string;
    }) => {
      await supabaseClient.from("vocabulary_memory").upsert(
        {
          user_id: userId,
          language_code: languageCode,
          term,
          translation,
          category,
          introduced_in_session: sessionId,
          times_seen: 1,
          next_review_at: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        { onConflict: "user_id,language_code,term" }
      );

      await supabaseClient.from("concept_events").insert({
        user_id: userId,
        session_id: sessionId,
        language_code: languageCode,
        event_type: "introduced" as ConceptEventType,
        concept_type: "vocabulary",
        concept_identifier: term,
        context: { translation, category },
      });

      return `Logged new vocabulary: ${term} (${translation})`;
    },

    /**
     * Log a new grammar concept introduced in this session
     */
    logNewGrammar: async ({
      conceptName,
      conceptDisplay,
      category,
    }: {
      conceptName: string;
      conceptDisplay: string;
      category?: string;
    }) => {
      await supabaseClient.from("grammar_memory").upsert(
        {
          user_id: userId,
          language_code: languageCode,
          concept_name: conceptName,
          concept_display: conceptDisplay,
          category,
          introduced_in_session: sessionId,
          times_practiced: 1,
          next_review_at: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        { onConflict: "user_id,language_code,concept_name" }
      );

      await supabaseClient.from("concept_events").insert({
        user_id: userId,
        session_id: sessionId,
        language_code: languageCode,
        event_type: "introduced" as ConceptEventType,
        concept_type: "grammar",
        concept_identifier: conceptName,
        context: { display: conceptDisplay, category },
      });

      return `Logged new grammar concept: ${conceptDisplay}`;
    },
  };
}

/**
 * Get tool definitions for ElevenLabs agent configuration
 */
export function getMemoryToolDefinitions() {
  return [
    {
      name: "checkVocabulary",
      description:
        "Check if the student has seen a vocabulary word before and their mastery level",
      parameters: {
        type: "object",
        properties: {
          term: {
            type: "string",
            description: "The vocabulary term to check",
          },
        },
        required: ["term"],
      },
    },
    {
      name: "checkGrammar",
      description:
        "Check if a grammar concept has been introduced and the student's mastery level",
      parameters: {
        type: "object",
        properties: {
          concept: {
            type: "string",
            description: "The grammar concept name to check",
          },
        },
        required: ["concept"],
      },
    },
    {
      name: "getReviewItems",
      description:
        "Get vocabulary and grammar items that are due for spaced repetition review",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "getLastSession",
      description:
        "Get a summary of what was covered in the student's last session",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "getStrugglingAreas",
      description:
        "Get vocabulary and grammar concepts the student struggles with",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "getRelatedWords",
      description: "Get vocabulary words the student knows in a specific category",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "The vocabulary category (e.g., 'food', 'travel', 'family')",
          },
        },
        required: ["category"],
      },
    },
    {
      name: "recordVocabularyUsage",
      description:
        "Record when the student uses a vocabulary word correctly or incorrectly",
      parameters: {
        type: "object",
        properties: {
          term: {
            type: "string",
            description: "The vocabulary term used",
          },
          correct: {
            type: "boolean",
            description: "Whether the usage was correct",
          },
          context: {
            type: "string",
            description: "Optional context about the usage",
          },
        },
        required: ["term", "correct"],
      },
    },
    {
      name: "recordGrammarUsage",
      description:
        "Record when the student demonstrates a grammar concept correctly or incorrectly",
      parameters: {
        type: "object",
        properties: {
          concept: {
            type: "string",
            description: "The grammar concept demonstrated",
          },
          correct: {
            type: "boolean",
            description: "Whether the demonstration was correct",
          },
          context: {
            type: "string",
            description: "Optional context about the usage",
          },
        },
        required: ["concept", "correct"],
      },
    },
    {
      name: "askAboutStudent",
      description:
        "Ask a natural language question about the student's learning history",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The question to ask about the student",
          },
        },
        required: ["question"],
      },
    },
    {
      name: "logNewVocabulary",
      description: "Log a new vocabulary word introduced in this session",
      parameters: {
        type: "object",
        properties: {
          term: {
            type: "string",
            description: "The new vocabulary term",
          },
          translation: {
            type: "string",
            description: "The translation in the student's native language",
          },
          category: {
            type: "string",
            description: "Optional category (e.g., 'food', 'travel')",
          },
        },
        required: ["term", "translation"],
      },
    },
    {
      name: "logNewGrammar",
      description: "Log a new grammar concept introduced in this session",
      parameters: {
        type: "object",
        properties: {
          conceptName: {
            type: "string",
            description: "Machine-readable concept name (e.g., 'present_tense_ar_verbs')",
          },
          conceptDisplay: {
            type: "string",
            description: "Human-readable name (e.g., 'Present Tense: -AR Verbs')",
          },
          category: {
            type: "string",
            description: "Optional category (e.g., 'tense', 'mood')",
          },
        },
        required: ["conceptName", "conceptDisplay"],
      },
    },
  ];
}
