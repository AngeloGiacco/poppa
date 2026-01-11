-- Migration: Create grammar_memory table
-- Grammar concept mastery with spaced repetition

CREATE TABLE grammar_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- The Grammar Concept
  concept_name TEXT NOT NULL,
  concept_display TEXT NOT NULL,
  category TEXT,
  difficulty_tier INTEGER DEFAULT 1 CHECK (difficulty_tier >= 1 AND difficulty_tier <= 5),

  -- Related Concepts (for prerequisite/follow-up)
  prerequisites TEXT[] DEFAULT '{}',
  unlocks TEXT[] DEFAULT '{}',

  -- Explanation & Examples
  explanation TEXT,
  example_sentences JSONB DEFAULT '[]'::jsonb,

  -- Mastery & Spaced Repetition
  mastery_level NUMERIC(3,2) DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 1),

  -- SM-2 Algorithm Fields
  easiness_factor NUMERIC(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,

  -- Performance Tracking
  times_practiced INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_struggled INTEGER DEFAULT 0,

  -- Common Errors (for targeted remediation)
  error_patterns JSONB DEFAULT '[]'::jsonb,

  -- Source Tracking
  first_introduced_at TIMESTAMPTZ DEFAULT NOW(),
  introduced_in_session UUID,
  curriculum_lesson_id INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_grammar UNIQUE (user_id, language_code, concept_name)
);

-- Indexes
CREATE INDEX idx_grammar_user_lang ON grammar_memory(user_id, language_code);
CREATE INDEX idx_grammar_next_review ON grammar_memory(user_id, next_review_at);
CREATE INDEX idx_grammar_mastery ON grammar_memory(user_id, language_code, mastery_level);
CREATE INDEX idx_grammar_category ON grammar_memory(user_id, language_code, category);
CREATE INDEX idx_grammar_concept ON grammar_memory(user_id, language_code, concept_name);

-- Enable RLS
ALTER TABLE grammar_memory ENABLE ROW LEVEL SECURITY;

-- Users can view their own grammar
CREATE POLICY "Users can view own grammar" ON grammar_memory
  FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access grammar" ON grammar_memory
  FOR ALL USING (
    (SELECT auth.jwt()->>'role') = 'service_role'
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_grammar_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_grammar_memory_updated_at
  BEFORE UPDATE ON grammar_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_grammar_memory_updated_at();

-- Function to upsert grammar memory
CREATE OR REPLACE FUNCTION upsert_grammar_memory(
  p_user_id UUID,
  p_language_code TEXT,
  p_concept_name TEXT,
  p_concept_display TEXT,
  p_category TEXT DEFAULT NULL,
  p_explanation TEXT DEFAULT NULL,
  p_difficulty_tier INTEGER DEFAULT 1,
  p_prerequisites TEXT[] DEFAULT '{}',
  p_unlocks TEXT[] DEFAULT '{}',
  p_session_id UUID DEFAULT NULL,
  p_lesson_id INTEGER DEFAULT NULL
)
RETURNS grammar_memory AS $$
DECLARE
  v_grammar grammar_memory;
BEGIN
  INSERT INTO grammar_memory (
    user_id, language_code, concept_name, concept_display,
    category, explanation, difficulty_tier,
    prerequisites, unlocks,
    introduced_in_session, curriculum_lesson_id,
    next_review_at
  )
  VALUES (
    p_user_id, p_language_code, p_concept_name, p_concept_display,
    p_category, p_explanation, p_difficulty_tier,
    p_prerequisites, p_unlocks,
    p_session_id, p_lesson_id,
    NOW() + INTERVAL '1 day'
  )
  ON CONFLICT (user_id, language_code, concept_name) DO UPDATE SET
    concept_display = COALESCE(EXCLUDED.concept_display, grammar_memory.concept_display),
    category = COALESCE(EXCLUDED.category, grammar_memory.category),
    explanation = COALESCE(EXCLUDED.explanation, grammar_memory.explanation),
    updated_at = NOW()
  RETURNING * INTO v_grammar;

  RETURN v_grammar;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
