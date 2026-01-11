-- Migration: Add vector embeddings for semantic search
-- Requires pgvector extension (available in Supabase)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns to vocabulary_memory
ALTER TABLE vocabulary_memory
ADD COLUMN IF NOT EXISTS context_embedding vector(1536);

-- Add embedding column to lesson_sessions for transcript search
ALTER TABLE lesson_sessions
ADD COLUMN IF NOT EXISTS transcript_embedding vector(1536);

-- Add embedding column to grammar_memory
ALTER TABLE grammar_memory
ADD COLUMN IF NOT EXISTS concept_embedding vector(1536);

-- Create indexes for vector similarity search (IVFFlat for performance)
-- Note: These indexes should be created after initial data load for best performance
CREATE INDEX IF NOT EXISTS idx_vocab_embedding ON vocabulary_memory
USING ivfflat (context_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_session_embedding ON lesson_sessions
USING ivfflat (transcript_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_grammar_embedding ON grammar_memory
USING ivfflat (concept_embedding vector_cosine_ops)
WITH (lists = 100);

-- Function to match vocabulary by semantic similarity
CREATE OR REPLACE FUNCTION match_vocabulary(
  query_embedding vector(1536),
  match_user_id UUID,
  match_language TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  term TEXT,
  translation TEXT,
  category TEXT,
  mastery_level NUMERIC,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    vocabulary_memory.id,
    vocabulary_memory.term,
    vocabulary_memory.translation,
    vocabulary_memory.category,
    vocabulary_memory.mastery_level,
    1 - (vocabulary_memory.context_embedding <=> query_embedding) AS similarity
  FROM vocabulary_memory
  WHERE vocabulary_memory.user_id = match_user_id
    AND vocabulary_memory.language_code = match_language
    AND vocabulary_memory.context_embedding IS NOT NULL
    AND 1 - (vocabulary_memory.context_embedding <=> query_embedding) > match_threshold
  ORDER BY vocabulary_memory.context_embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to match grammar concepts by semantic similarity
CREATE OR REPLACE FUNCTION match_grammar(
  query_embedding vector(1536),
  match_user_id UUID,
  match_language TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  concept_name TEXT,
  concept_display TEXT,
  category TEXT,
  mastery_level NUMERIC,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    grammar_memory.id,
    grammar_memory.concept_name,
    grammar_memory.concept_display,
    grammar_memory.category,
    grammar_memory.mastery_level,
    1 - (grammar_memory.concept_embedding <=> query_embedding) AS similarity
  FROM grammar_memory
  WHERE grammar_memory.user_id = match_user_id
    AND grammar_memory.language_code = match_language
    AND grammar_memory.concept_embedding IS NOT NULL
    AND 1 - (grammar_memory.concept_embedding <=> query_embedding) > match_threshold
  ORDER BY grammar_memory.concept_embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to match lesson sessions by transcript similarity
CREATE OR REPLACE FUNCTION match_sessions(
  query_embedding vector(1536),
  match_user_id UUID,
  match_language TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  started_at TIMESTAMPTZ,
  lesson_title TEXT,
  transcript_summary TEXT,
  vocabulary_introduced TEXT[],
  grammar_introduced TEXT[],
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lesson_sessions.id,
    lesson_sessions.started_at,
    lesson_sessions.lesson_title,
    lesson_sessions.transcript_summary,
    lesson_sessions.vocabulary_introduced,
    lesson_sessions.grammar_introduced,
    1 - (lesson_sessions.transcript_embedding <=> query_embedding) AS similarity
  FROM lesson_sessions
  WHERE lesson_sessions.user_id = match_user_id
    AND lesson_sessions.language_code = match_language
    AND lesson_sessions.transcript_embedding IS NOT NULL
    AND 1 - (lesson_sessions.transcript_embedding <=> query_embedding) > match_threshold
  ORDER BY lesson_sessions.transcript_embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
