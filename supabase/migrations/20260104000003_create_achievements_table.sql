-- Create user_achievements table for tracking unlocked achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

-- Create index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Create index for finding unnotified achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_notified ON user_achievements(notified) WHERE notified = FALSE;

-- Enable Row Level Security
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Achievements can be inserted by service role (server-side)
CREATE POLICY "Service role can insert achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (TRUE);

-- Policy: Service role can update achievements (for marking as notified)
CREATE POLICY "Service role can update achievements"
  ON user_achievements
  FOR UPDATE
  USING (TRUE);

-- Function to check and unlock achievements for a user
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats RECORD;
  v_new_achievements TEXT[] := ARRAY[]::TEXT[];
  v_achievement_id TEXT;
  v_referral_count INT;
  v_languages_started INT;
BEGIN
  -- Get user stats
  SELECT * INTO v_stats FROM user_stats WHERE user_id = p_user_id;

  IF v_stats IS NULL THEN
    RETURN json_build_object('new_achievements', v_new_achievements);
  END IF;

  -- Get referral count
  SELECT COUNT(*) INTO v_referral_count
  FROM referrals
  WHERE referrer_id = p_user_id AND status = 'credited';

  -- Get languages started
  SELECT COUNT(DISTINCT target_language) INTO v_languages_started
  FROM conversation_transcripts
  WHERE user_id = p_user_id;

  -- Check lesson milestones
  IF v_stats.total_lessons >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'first_lesson')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'first_lesson'); END IF;
  END IF;

  IF v_stats.total_lessons >= 10 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'ten_lessons')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'ten_lessons'); END IF;
  END IF;

  IF v_stats.total_lessons >= 50 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'fifty_lessons')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'fifty_lessons'); END IF;
  END IF;

  IF v_stats.total_lessons >= 100 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'hundred_lessons')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'hundred_lessons'); END IF;
  END IF;

  -- Check time milestones
  IF v_stats.total_minutes >= 60 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'one_hour')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'one_hour'); END IF;
  END IF;

  IF v_stats.total_minutes >= 600 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'ten_hours')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'ten_hours'); END IF;
  END IF;

  -- Check streak milestones
  IF v_stats.current_streak >= 3 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'three_day_streak')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'three_day_streak'); END IF;
  END IF;

  IF v_stats.current_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'seven_day_streak')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'seven_day_streak'); END IF;
  END IF;

  IF v_stats.current_streak >= 30 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'thirty_day_streak')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'thirty_day_streak'); END IF;
  END IF;

  -- Check referral milestones
  IF v_referral_count >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'first_referral')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'first_referral'); END IF;
  END IF;

  IF v_referral_count >= 5 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'five_referrals')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'five_referrals'); END IF;
  END IF;

  -- Check language diversity
  IF v_languages_started >= 3 THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, 'polyglot_starter')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    IF FOUND THEN v_new_achievements := array_append(v_new_achievements, 'polyglot_starter'); END IF;
  END IF;

  RETURN json_build_object('new_achievements', v_new_achievements);
END;
$$;

-- Function to mark achievement as notified
CREATE OR REPLACE FUNCTION mark_achievement_notified(p_user_id UUID, p_achievement_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_achievements
  SET notified = TRUE
  WHERE user_id = p_user_id AND achievement_id = p_achievement_id;

  RETURN FOUND;
END;
$$;

-- Function to get user's unnotified achievements
CREATE OR REPLACE FUNCTION get_unnotified_achievements(p_user_id UUID)
RETURNS TABLE(achievement_id VARCHAR(50), unlocked_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ua.achievement_id, ua.unlocked_at
  FROM user_achievements ua
  WHERE ua.user_id = p_user_id AND ua.notified = FALSE
  ORDER BY ua.unlocked_at DESC;
END;
$$;
