-- Migration: Create vocabulary_memory table
-- Vocabulary item mastery with spaced repetition

CREATE TABLE vocabulary_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- The Vocabulary Item
  term TEXT NOT NULL,
  translation TEXT NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  category TEXT,

  -- Example Contexts (from actual conversations)
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
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,

  -- Error Patterns
  common_errors TEXT[] DEFAULT '{}',

  -- Source Tracking
  first_introduced_at TIMESTAMPTZ DEFAULT NOW(),
  introduced_in_session UUID,
  curriculum_lesson_id INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_vocab UNIQUE (user_id, language_code, term)
);

-- Indexes for common queries
CREATE INDEX idx_vocab_user_lang ON vocabulary_memory(user_id, language_code);
CREATE INDEX idx_vocab_next_review ON vocabulary_memory(user_id, next_review_at);
CREATE INDEX idx_vocab_mastery ON vocabulary_memory(user_id, language_code, mastery_level);
CREATE INDEX idx_vocab_category ON vocabulary_memory(user_id, language_code, category);
CREATE INDEX idx_vocab_term ON vocabulary_memory(user_id, language_code, term);

-- Enable RLS
ALTER TABLE vocabulary_memory ENABLE ROW LEVEL SECURITY;

-- Users can view their own vocabulary
CREATE POLICY "Users can view own vocabulary" ON vocabulary_memory
  FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access vocabulary" ON vocabulary_memory
  FOR ALL USING (
    (SELECT auth.jwt()->>'role') = 'service_role'
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_vocabulary_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vocabulary_memory_updated_at
  BEFORE UPDATE ON vocabulary_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_vocabulary_memory_updated_at();

-- Function to upsert vocabulary with spaced repetition update
CREATE OR REPLACE FUNCTION upsert_vocabulary_memory(
  p_user_id UUID,
  p_language_code TEXT,
  p_term TEXT,
  p_translation TEXT,
  p_category TEXT DEFAULT NULL,
  p_part_of_speech TEXT DEFAULT NULL,
  p_phonetic TEXT DEFAULT NULL,
  p_session_id UUID DEFAULT NULL,
  p_lesson_id INTEGER DEFAULT NULL
)
RETURNS vocabulary_memory AS $$
DECLARE
  v_vocab vocabulary_memory;
BEGIN
  INSERT INTO vocabulary_memory (
    user_id, language_code, term, translation,
    category, part_of_speech, phonetic,
    introduced_in_session, curriculum_lesson_id,
    next_review_at
  )
  VALUES (
    p_user_id, p_language_code, p_term, p_translation,
    p_category, p_part_of_speech, p_phonetic,
    p_session_id, p_lesson_id,
    NOW() + INTERVAL '1 day'
  )
  ON CONFLICT (user_id, language_code, term) DO UPDATE SET
    translation = COALESCE(EXCLUDED.translation, vocabulary_memory.translation),
    category = COALESCE(EXCLUDED.category, vocabulary_memory.category),
    part_of_speech = COALESCE(EXCLUDED.part_of_speech, vocabulary_memory.part_of_speech),
    phonetic = COALESCE(EXCLUDED.phonetic, vocabulary_memory.phonetic),
    updated_at = NOW()
  RETURNING * INTO v_vocab;

  RETURN v_vocab;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
