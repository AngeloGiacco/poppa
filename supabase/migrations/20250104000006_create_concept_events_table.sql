-- Migration: Create concept_events table
-- Append-only event log for analytics and mastery tracking

CREATE TABLE concept_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES lesson_sessions(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL,

  -- Event Details
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'introduced',
      'reviewed',
      'correct',
      'incorrect',
      'struggled',
      'mastered',
      'forgot',
      'self_corrected'
    )),

  -- Concept Reference
  concept_type TEXT NOT NULL CHECK (concept_type IN ('vocabulary', 'grammar')),
  concept_id UUID,
  concept_identifier TEXT NOT NULL,

  -- Event Context
  context JSONB DEFAULT '{}'::jsonb,

  -- Timing
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  session_timestamp_seconds INTEGER
);

-- Indexes for analytics
CREATE INDEX idx_events_user ON concept_events(user_id);
CREATE INDEX idx_events_user_lang ON concept_events(user_id, language_code);
CREATE INDEX idx_events_session ON concept_events(session_id);
CREATE INDEX idx_events_type ON concept_events(event_type);
CREATE INDEX idx_events_occurred ON concept_events(occurred_at DESC);
CREATE INDEX idx_events_concept ON concept_events(concept_type, concept_identifier);
CREATE INDEX idx_events_user_concept ON concept_events(user_id, concept_type, concept_identifier);

-- Enable RLS
ALTER TABLE concept_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own events
CREATE POLICY "Users can view own events" ON concept_events
  FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access events" ON concept_events
  FOR ALL USING (
    (SELECT auth.jwt()->>'role') = 'service_role'
  );

-- Function to record a concept event
CREATE OR REPLACE FUNCTION record_concept_event(
  p_user_id UUID,
  p_session_id UUID,
  p_language_code TEXT,
  p_event_type TEXT,
  p_concept_type TEXT,
  p_concept_identifier TEXT,
  p_concept_id UUID DEFAULT NULL,
  p_context JSONB DEFAULT '{}'::jsonb,
  p_session_timestamp_seconds INTEGER DEFAULT NULL
)
RETURNS concept_events AS $$
DECLARE
  v_event concept_events;
BEGIN
  INSERT INTO concept_events (
    user_id, session_id, language_code,
    event_type, concept_type, concept_id, concept_identifier,
    context, session_timestamp_seconds
  )
  VALUES (
    p_user_id, p_session_id, p_language_code,
    p_event_type, p_concept_type, p_concept_id, p_concept_identifier,
    p_context, p_session_timestamp_seconds
  )
  RETURNING * INTO v_event;

  RETURN v_event;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent events for a concept
CREATE OR REPLACE FUNCTION get_concept_events(
  p_user_id UUID,
  p_language_code TEXT,
  p_concept_type TEXT,
  p_concept_identifier TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF concept_events AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM concept_events
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND concept_type = p_concept_type
    AND concept_identifier = p_concept_identifier
  ORDER BY occurred_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
