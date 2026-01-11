-- Migration: Create lesson_sessions table
-- Enhanced lesson tracking with performance metrics

CREATE TABLE lesson_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- Session Metadata
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  -- Curriculum Reference (if structured lesson)
  curriculum_lesson_id INTEGER,
  lesson_title TEXT,
  lesson_level TEXT,

  -- Session Type
  session_type TEXT DEFAULT 'lesson'
    CHECK (session_type IN ('lesson', 'review', 'practice', 'assessment')),

  -- What Was Covered
  vocabulary_introduced TEXT[] DEFAULT '{}',
  vocabulary_reviewed TEXT[] DEFAULT '{}',
  grammar_introduced TEXT[] DEFAULT '{}',
  grammar_reviewed TEXT[] DEFAULT '{}',

  -- Custom Topic (if user-requested)
  custom_topic TEXT,

  -- Performance Metrics (AI-analyzed post-session)
  performance_metrics JSONB DEFAULT '{}'::jsonb,

  -- Transcript Reference
  conversation_id TEXT,
  transcript_summary TEXT,

  -- Key Moments (notable events from the session)
  highlights JSONB DEFAULT '[]'::jsonb,

  -- AI Recommendations (for next session)
  next_session_recommendations JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user ON lesson_sessions(user_id);
CREATE INDEX idx_sessions_user_lang ON lesson_sessions(user_id, language_code);
CREATE INDEX idx_sessions_started ON lesson_sessions(started_at DESC);
CREATE INDEX idx_sessions_conversation ON lesson_sessions(conversation_id);
CREATE INDEX idx_sessions_user_lang_started ON lesson_sessions(user_id, language_code, started_at DESC);

-- Enable RLS
ALTER TABLE lesson_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON lesson_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access sessions" ON lesson_sessions
  FOR ALL USING (
    (SELECT auth.jwt()->>'role') = 'service_role'
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_lesson_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lesson_sessions_updated_at
  BEFORE UPDATE ON lesson_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_sessions_updated_at();

-- Function to create a new lesson session
CREATE OR REPLACE FUNCTION create_lesson_session(
  p_user_id UUID,
  p_language_code TEXT,
  p_session_type TEXT DEFAULT 'lesson',
  p_curriculum_lesson_id INTEGER DEFAULT NULL,
  p_lesson_title TEXT DEFAULT NULL,
  p_lesson_level TEXT DEFAULT NULL,
  p_custom_topic TEXT DEFAULT NULL
)
RETURNS lesson_sessions AS $$
DECLARE
  v_session lesson_sessions;
BEGIN
  INSERT INTO lesson_sessions (
    user_id, language_code, session_type,
    curriculum_lesson_id, lesson_title, lesson_level,
    custom_topic
  )
  VALUES (
    p_user_id, p_language_code, p_session_type,
    p_curriculum_lesson_id, p_lesson_title, p_lesson_level,
    p_custom_topic
  )
  RETURNING * INTO v_session;

  RETURN v_session;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end a lesson session
CREATE OR REPLACE FUNCTION end_lesson_session(
  p_session_id UUID,
  p_conversation_id TEXT DEFAULT NULL,
  p_vocabulary_introduced TEXT[] DEFAULT '{}',
  p_vocabulary_reviewed TEXT[] DEFAULT '{}',
  p_grammar_introduced TEXT[] DEFAULT '{}',
  p_grammar_reviewed TEXT[] DEFAULT '{}',
  p_performance_metrics JSONB DEFAULT '{}'::jsonb,
  p_highlights JSONB DEFAULT '[]'::jsonb,
  p_transcript_summary TEXT DEFAULT NULL,
  p_next_session_recommendations JSONB DEFAULT '{}'::jsonb
)
RETURNS lesson_sessions AS $$
DECLARE
  v_session lesson_sessions;
BEGIN
  UPDATE lesson_sessions SET
    ended_at = NOW(),
    duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
    conversation_id = p_conversation_id,
    vocabulary_introduced = p_vocabulary_introduced,
    vocabulary_reviewed = p_vocabulary_reviewed,
    grammar_introduced = p_grammar_introduced,
    grammar_reviewed = p_grammar_reviewed,
    performance_metrics = p_performance_metrics,
    highlights = p_highlights,
    transcript_summary = p_transcript_summary,
    next_session_recommendations = p_next_session_recommendations,
    updated_at = NOW()
  WHERE id = p_session_id
  RETURNING * INTO v_session;

  RETURN v_session;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
