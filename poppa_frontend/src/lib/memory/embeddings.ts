/**
 * Vector Embeddings
 * Semantic search for memory using pgvector
 */

import supabaseClient from "@/lib/supabase";
import type { VocabularyMemory, GrammarMemory, LessonSession } from "@/types/memory.types";

// Semantic search result types (partial matches from RPC functions)
interface VocabSearchResult {
  id: string;
  term: string;
  translation: string;
  category: string | null;
  mastery_level: number;
  similarity: number;
}

interface GrammarSearchResult {
  id: string;
  concept_name: string;
  concept_display: string;
  category: string | null;
  mastery_level: number;
  similarity: number;
}

interface SessionSearchResult {
  id: string;
  started_at: string;
  lesson_title: string | null;
  transcript_summary: string | null;
  vocabulary_introduced: string[];
  grammar_introduced: string[];
  similarity: number;
}

/**
 * Generate embeddings using OpenAI API
 * Note: Requires OPENAI_API_KEY environment variable
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate and store embedding for a vocabulary item
 */
export async function embedVocabulary(
  userId: string,
  languageCode: string,
  term: string
): Promise<void> {
  // Get the vocabulary item
  const { data: vocab } = await supabaseClient
    .from("vocabulary_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .eq("term", term)
    .single();

  if (!vocab) {
    return;
  }

  // Generate embedding from term + translation + category + examples
  const textToEmbed = buildVocabEmbeddingText(vocab as unknown as VocabularyMemory);
  const embedding = await generateEmbedding(textToEmbed);

  // Store embedding
  await supabaseClient
    .from("vocabulary_memory")
    .update({ context_embedding: embedding })
    .eq("id", vocab.id);
}

/**
 * Generate and store embedding for a grammar concept
 */
export async function embedGrammar(
  userId: string,
  languageCode: string,
  conceptName: string
): Promise<void> {
  const { data: grammar } = await supabaseClient
    .from("grammar_memory")
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .eq("concept_name", conceptName)
    .single();

  if (!grammar) {
    return;
  }

  const textToEmbed = buildGrammarEmbeddingText(grammar as unknown as GrammarMemory);
  const embedding = await generateEmbedding(textToEmbed);

  await supabaseClient
    .from("grammar_memory")
    .update({ concept_embedding: embedding })
    .eq("id", grammar.id);
}

/**
 * Generate and store embedding for a lesson session
 */
export async function embedSession(sessionId: string): Promise<void> {
  const { data: session } = await supabaseClient
    .from("lesson_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session || !session.transcript_summary) {
    return;
  }

  const textToEmbed = buildSessionEmbeddingText(session as unknown as LessonSession);
  const embedding = await generateEmbedding(textToEmbed);

  await supabaseClient
    .from("lesson_sessions")
    .update({ transcript_embedding: embedding })
    .eq("id", sessionId);
}

/**
 * Search vocabulary by semantic similarity
 */
export async function searchVocabularySemantic(
  userId: string,
  languageCode: string,
  query: string,
  limit = 10,
  threshold = 0.7
): Promise<VocabSearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabaseClient.rpc("match_vocabulary", {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_language: languageCode,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.error("Semantic search error:", error);
    return [];
  }

  return data || [];
}

/**
 * Search grammar by semantic similarity
 */
export async function searchGrammarSemantic(
  userId: string,
  languageCode: string,
  query: string,
  limit = 10,
  threshold = 0.7
): Promise<GrammarSearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabaseClient.rpc("match_grammar", {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_language: languageCode,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.error("Semantic search error:", error);
    return [];
  }

  return data || [];
}

/**
 * Search sessions by semantic similarity
 */
export async function searchSessionsSemantic(
  userId: string,
  languageCode: string,
  query: string,
  limit = 5,
  threshold = 0.7
): Promise<SessionSearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabaseClient.rpc("match_sessions", {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_language: languageCode,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.error("Semantic search error:", error);
    return [];
  }

  return data || [];
}

/**
 * Find similar vocabulary to a given term
 */
export async function findSimilarVocabulary(
  userId: string,
  languageCode: string,
  term: string,
  limit = 5
): Promise<VocabSearchResult[]> {
  // Get the embedding for the source term
  const { data: source } = await supabaseClient
    .from("vocabulary_memory")
    .select("context_embedding")
    .eq("user_id", userId)
    .eq("language_code", languageCode)
    .eq("term", term)
    .single();

  if (!source?.context_embedding) {
    return [];
  }

  const { data, error } = await supabaseClient.rpc("match_vocabulary", {
    query_embedding: source.context_embedding,
    match_user_id: userId,
    match_language: languageCode,
    match_threshold: 0.6,
    match_count: limit + 1, // +1 because source will match itself
  });

  if (error) {
    console.error("Similar vocabulary search error:", error);
    return [];
  }

  // Filter out the source term
  return (data || []).filter((v: VocabSearchResult) => v.term !== term);
}

/**
 * Batch embed all vocabulary for a user/language
 */
export async function batchEmbedVocabulary(
  userId: string,
  languageCode: string,
  batchSize = 50
): Promise<{ processed: number; errors: number }> {
  let processed = 0;
  let errors = 0;
  let offset = 0;

  while (true) {
    // Get batch of vocabulary without embeddings
    const { data: batch } = await supabaseClient
      .from("vocabulary_memory")
      .select("id, term, translation, category, example_sentences")
      .eq("user_id", userId)
      .eq("language_code", languageCode)
      .is("context_embedding", null)
      .range(offset, offset + batchSize - 1);

    if (!batch || batch.length === 0) {
      break;
    }

    for (const vocab of batch) {
      try {
        const textToEmbed = buildVocabEmbeddingText(vocab as unknown as VocabularyMemory);
        const embedding = await generateEmbedding(textToEmbed);

        await supabaseClient
          .from("vocabulary_memory")
          .update({ context_embedding: embedding })
          .eq("id", vocab.id);

        processed++;
      } catch (error) {
        console.error(`Error embedding vocabulary ${vocab.term}:`, error);
        errors++;
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    offset += batchSize;
  }

  return { processed, errors };
}

// Helper functions to build embedding text

function buildVocabEmbeddingText(vocab: VocabularyMemory): string {
  const parts = [
    vocab.term,
    vocab.translation,
    vocab.category ? `Category: ${vocab.category}` : "",
    vocab.part_of_speech ? `Part of speech: ${vocab.part_of_speech}` : "",
  ];

  if (vocab.example_sentences && vocab.example_sentences.length > 0) {
    parts.push(`Examples: ${vocab.example_sentences.map((e) => e.sentence).join("; ")}`);
  }

  return parts.filter(Boolean).join(". ");
}

function buildGrammarEmbeddingText(grammar: GrammarMemory): string {
  const parts = [
    grammar.concept_display,
    grammar.explanation || "",
    grammar.category ? `Category: ${grammar.category}` : "",
  ];

  if (grammar.example_sentences && grammar.example_sentences.length > 0) {
    parts.push(
      `Examples: ${grammar.example_sentences.map((e) => `${e.target} (${e.native})`).join("; ")}`
    );
  }

  return parts.filter(Boolean).join(". ");
}

function buildSessionEmbeddingText(session: LessonSession): string {
  const parts = [
    session.lesson_title || "",
    session.transcript_summary || "",
    session.custom_topic ? `Topic: ${session.custom_topic}` : "",
  ];

  if (session.vocabulary_introduced.length > 0) {
    parts.push(`Vocabulary: ${session.vocabulary_introduced.join(", ")}`);
  }

  if (session.grammar_introduced.length > 0) {
    parts.push(`Grammar: ${session.grammar_introduced.join(", ")}`);
  }

  return parts.filter(Boolean).join(". ");
}
