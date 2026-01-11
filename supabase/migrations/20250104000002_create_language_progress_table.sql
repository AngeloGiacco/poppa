-- Migration: Create language_progress table
-- Per-language progress tracking with proficiency and streak data

CREATE TABLE language_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- Proficiency Tracking
  proficiency_level TEXT DEFAULT 'beginner'
    CHECK (proficiency_level IN (
      'beginner', 'elementary', 'intermediate',
      'upper_intermediate', 'advanced', 'mastery'
    )),
  proficiency_score NUMERIC(5,2) DEFAULT 0,

  -- Curriculum Progress (for structured languages)
  current_lesson_id INTEGER,
  completed_lesson_ids INTEGER[] DEFAULT '{}',

  -- Time Investment
  total_session_count INTEGER DEFAULT 0,
  total_practice_minutes INTEGER DEFAULT 0,

  -- Streak & Consistency
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_practice_at TIMESTAMPTZ,

  -- Mastery Counts (denormalized for fast access)
  vocabulary_learned_count INTEGER DEFAULT 0,
  vocabulary_mastered_count INTEGER DEFAULT 0,
  grammar_learned_count INTEGER DEFAULT 0,
  grammar_mastered_count INTEGER DEFAULT 0,

  -- AI-Generated Language Summary
  progress_summary TEXT,
  summary_updated_at TIMESTAMPTZ,

  -- Recommended Focus Areas (AI-generated)
  recommended_focus JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_language UNIQUE (user_id, language_code)
);

-- Indexes
CREATE INDEX idx_language_progress_user ON language_progress(user_id);
CREATE INDEX idx_language_progress_lang ON language_progress(language_code);
CREATE INDEX idx_language_progress_last_practice ON language_progress(last_practice_at);
CREATE INDEX idx_language_progress_user_lang ON language_progress(user_id, language_code);

-- Enable RLS
ALTER TABLE language_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own progress" ON language_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access progress" ON language_progress
  FOR ALL USING (
    (SELECT auth.jwt()->>'role') = 'service_role'
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_language_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_language_progress_updated_at
  BEFORE UPDATE ON language_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_language_progress_updated_at();

-- Function to get or create language progress
CREATE OR REPLACE FUNCTION get_or_create_language_progress(
  p_user_id UUID,
  p_language_code TEXT
)
RETURNS language_progress AS $$
DECLARE
  v_progress language_progress;
BEGIN
  -- Try to get existing progress
  SELECT * INTO v_progress
  FROM language_progress
  WHERE user_id = p_user_id AND language_code = p_language_code;

  -- Create if not exists
  IF v_progress IS NULL THEN
    INSERT INTO language_progress (user_id, language_code)
    VALUES (p_user_id, p_language_code)
    RETURNING * INTO v_progress;
  END IF;

  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
