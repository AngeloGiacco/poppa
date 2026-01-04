-- Create user_stats table for streak tracking
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_lessons INT DEFAULT 0,
    total_minutes INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_lesson_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own stats"
ON user_stats
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
ON user_stats
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
ON user_stats
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update streaks
CREATE OR REPLACE FUNCTION update_user_streak(
    p_user_id UUID,
    p_minutes INT DEFAULT 0
)
RETURNS TABLE(
    current_streak INT,
    longest_streak INT,
    total_lessons INT,
    total_minutes INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_last_lesson_date DATE;
    v_today DATE := CURRENT_DATE;
    v_current_streak INT;
    v_longest_streak INT;
    v_total_lessons INT;
    v_total_minutes INT;
BEGIN
    -- Get or create user stats
    INSERT INTO user_stats (user_id, total_lessons, total_minutes, current_streak, longest_streak, last_lesson_date)
    VALUES (p_user_id, 0, 0, 0, 0, NULL)
    ON CONFLICT (user_id) DO NOTHING;

    -- Get current stats
    SELECT us.last_lesson_date, us.current_streak, us.longest_streak, us.total_lessons, us.total_minutes
    INTO v_last_lesson_date, v_current_streak, v_longest_streak, v_total_lessons, v_total_minutes
    FROM user_stats us
    WHERE us.user_id = p_user_id;

    -- Calculate new streak
    IF v_last_lesson_date IS NULL THEN
        -- First lesson ever
        v_current_streak := 1;
    ELSIF v_last_lesson_date = v_today THEN
        -- Already had a lesson today, don't increment streak
        NULL;
    ELSIF v_last_lesson_date = v_today - INTERVAL '1 day' THEN
        -- Consecutive day, increment streak
        v_current_streak := v_current_streak + 1;
    ELSE
        -- Streak broken, start fresh
        v_current_streak := 1;
    END IF;

    -- Update longest streak if needed
    IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
    END IF;

    -- Update total counts
    v_total_lessons := v_total_lessons + 1;
    v_total_minutes := v_total_minutes + p_minutes;

    -- Save updated stats
    UPDATE user_stats
    SET current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        total_lessons = v_total_lessons,
        total_minutes = v_total_minutes,
        last_lesson_date = v_today,
        updated_at = NOW()
    WHERE user_stats.user_id = p_user_id;

    RETURN QUERY SELECT v_current_streak, v_longest_streak, v_total_lessons, v_total_minutes;
END;
$$;

-- Create index for faster lookups
CREATE INDEX idx_user_stats_last_lesson ON user_stats(last_lesson_date);
