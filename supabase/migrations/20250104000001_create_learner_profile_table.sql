-- Migration: Create learner_profile table
-- Cross-language user memory for learning patterns and preferences

CREATE TABLE learner_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Learning Style Insights (updated by AI analysis)
  learning_style JSONB DEFAULT '{}'::jsonb,

  -- Preferred Topics (for contextual examples)
  interests TEXT[] DEFAULT '{}',

  -- Session Preferences
  session_preferences JSONB DEFAULT '{}'::jsonb,

  -- Cross-Language Observations
  cross_language_notes TEXT,

  -- AI-Generated Summary (refreshed periodically)
  learner_summary TEXT,
  summary_updated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Index for fast lookup
CREATE INDEX idx_learner_profile_user ON learner_profile(user_id);

-- Enable RLS
ALTER TABLE learner_profile ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON learner_profile
  FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access profile" ON learner_profile
  FOR ALL USING (
    (SELECT auth.jwt()->>'role') = 'service_role'
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_learner_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_learner_profile_updated_at
  BEFORE UPDATE ON learner_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_learner_profile_updated_at();
