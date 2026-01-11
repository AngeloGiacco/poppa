-- Migration: Create helper functions for memory framework
-- Spaced repetition updates and aggregate queries

-- Function to update vocabulary after review (SM-2 algorithm)
CREATE OR REPLACE FUNCTION update_vocabulary_after_review(
  p_user_id UUID,
  p_language_code TEXT,
  p_term TEXT,
  p_quality INTEGER  -- 0-5 scale
)
RETURNS vocabulary_memory AS $$
DECLARE
  v_vocab vocabulary_memory;
  v_new_ef NUMERIC(3,2);
  v_new_interval INTEGER;
  v_new_reps INTEGER;
  v_new_mastery NUMERIC(3,2);
BEGIN
  -- Get current vocabulary state
  SELECT * INTO v_vocab
  FROM vocabulary_memory
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND term = p_term;

  IF v_vocab IS NULL THEN
    RAISE EXCEPTION 'Vocabulary item not found';
  END IF;

  -- Calculate new easiness factor (minimum 1.3)
  v_new_ef := GREATEST(
    1.3,
    v_vocab.easiness_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02))
  );

  -- Update interval and repetitions based on quality
  IF p_quality < 3 THEN
    -- Failed: reset
    v_new_reps := 0;
    v_new_interval := 1;
  ELSE
    -- Passed: increase interval
    v_new_reps := v_vocab.repetitions + 1;
    IF v_new_reps = 1 THEN
      v_new_interval := 1;
    ELSIF v_new_reps = 2 THEN
      v_new_interval := 3;
    ELSE
      v_new_interval := ROUND(v_vocab.interval_days * v_new_ef);
    END IF;
  END IF;

  -- Calculate mastery level (0-1)
  v_new_mastery := LEAST(
    1.0,
    (v_new_reps * 0.15) + ((v_new_ef - 1.3) / 1.2 * 0.25)
  );

  -- Update vocabulary record
  UPDATE vocabulary_memory SET
    easiness_factor = v_new_ef,
    interval_days = v_new_interval,
    repetitions = v_new_reps,
    mastery_level = v_new_mastery,
    next_review_at = NOW() + (v_new_interval || ' days')::INTERVAL,
    last_reviewed_at = NOW(),
    times_seen = times_seen + 1,
    times_correct = CASE WHEN p_quality >= 3 THEN times_correct + 1 ELSE times_correct END,
    times_incorrect = CASE WHEN p_quality < 3 THEN times_incorrect + 1 ELSE times_incorrect END,
    updated_at = NOW()
  WHERE id = v_vocab.id
  RETURNING * INTO v_vocab;

  RETURN v_vocab;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update grammar after practice (SM-2 algorithm)
CREATE OR REPLACE FUNCTION update_grammar_after_practice(
  p_user_id UUID,
  p_language_code TEXT,
  p_concept_name TEXT,
  p_quality INTEGER  -- 0-5 scale
)
RETURNS grammar_memory AS $$
DECLARE
  v_grammar grammar_memory;
  v_new_ef NUMERIC(3,2);
  v_new_interval INTEGER;
  v_new_reps INTEGER;
  v_new_mastery NUMERIC(3,2);
BEGIN
  -- Get current grammar state
  SELECT * INTO v_grammar
  FROM grammar_memory
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND concept_name = p_concept_name;

  IF v_grammar IS NULL THEN
    RAISE EXCEPTION 'Grammar concept not found';
  END IF;

  -- Calculate new easiness factor (minimum 1.3)
  v_new_ef := GREATEST(
    1.3,
    v_grammar.easiness_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02))
  );

  -- Update interval and repetitions based on quality
  IF p_quality < 3 THEN
    -- Failed: reset
    v_new_reps := 0;
    v_new_interval := 1;
  ELSE
    -- Passed: increase interval
    v_new_reps := v_grammar.repetitions + 1;
    IF v_new_reps = 1 THEN
      v_new_interval := 1;
    ELSIF v_new_reps = 2 THEN
      v_new_interval := 3;
    ELSE
      v_new_interval := ROUND(v_grammar.interval_days * v_new_ef);
    END IF;
  END IF;

  -- Calculate mastery level (0-1)
  v_new_mastery := LEAST(
    1.0,
    (v_new_reps * 0.15) + ((v_new_ef - 1.3) / 1.2 * 0.25)
  );

  -- Update grammar record
  UPDATE grammar_memory SET
    easiness_factor = v_new_ef,
    interval_days = v_new_interval,
    repetitions = v_new_reps,
    mastery_level = v_new_mastery,
    next_review_at = NOW() + (v_new_interval || ' days')::INTERVAL,
    last_reviewed_at = NOW(),
    times_practiced = times_practiced + 1,
    times_correct = CASE WHEN p_quality >= 3 THEN times_correct + 1 ELSE times_correct END,
    times_struggled = CASE WHEN p_quality < 3 THEN times_struggled + 1 ELSE times_struggled END,
    updated_at = NOW()
  WHERE id = v_grammar.id
  RETURNING * INTO v_grammar;

  RETURN v_grammar;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get vocabulary due for review
CREATE OR REPLACE FUNCTION get_vocabulary_due_for_review(
  p_user_id UUID,
  p_language_code TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS SETOF vocabulary_memory AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM vocabulary_memory
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND next_review_at <= NOW()
  ORDER BY next_review_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get grammar due for review
CREATE OR REPLACE FUNCTION get_grammar_due_for_review(
  p_user_id UUID,
  p_language_code TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF grammar_memory AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM grammar_memory
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND next_review_at <= NOW()
  ORDER BY next_review_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get struggling vocabulary
CREATE OR REPLACE FUNCTION get_struggling_vocabulary(
  p_user_id UUID,
  p_language_code TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF vocabulary_memory AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM vocabulary_memory
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND mastery_level < 0.5
    AND times_seen > 1
  ORDER BY times_incorrect DESC, mastery_level ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get struggling grammar
CREATE OR REPLACE FUNCTION get_struggling_grammar(
  p_user_id UUID,
  p_language_code TEXT,
  p_limit INTEGER DEFAULT 5
)
RETURNS SETOF grammar_memory AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM grammar_memory
  WHERE user_id = p_user_id
    AND language_code = p_language_code
    AND mastery_level < 0.5
    AND times_practiced > 1
  ORDER BY times_struggled DESC, mastery_level ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update language progress after session
CREATE OR REPLACE FUNCTION update_language_progress_after_session(
  p_user_id UUID,
  p_language_code TEXT,
  p_session_duration_seconds INTEGER,
  p_vocab_introduced INTEGER DEFAULT 0,
  p_grammar_introduced INTEGER DEFAULT 0
)
RETURNS language_progress AS $$
DECLARE
  v_progress language_progress;
  v_today DATE := CURRENT_DATE;
  v_last_practice DATE;
  v_new_streak INTEGER;
BEGIN
  -- Get or create progress
  SELECT * INTO v_progress
  FROM language_progress
  WHERE user_id = p_user_id AND language_code = p_language_code;

  IF v_progress IS NULL THEN
    INSERT INTO language_progress (user_id, language_code)
    VALUES (p_user_id, p_language_code)
    RETURNING * INTO v_progress;
  END IF;

  -- Calculate streak
  v_last_practice := v_progress.last_practice_at::DATE;
  IF v_last_practice IS NULL OR v_last_practice < v_today - 1 THEN
    -- Streak broken or first practice
    v_new_streak := 1;
  ELSIF v_last_practice = v_today - 1 THEN
    -- Consecutive day
    v_new_streak := v_progress.current_streak_days + 1;
  ELSE
    -- Already practiced today
    v_new_streak := v_progress.current_streak_days;
  END IF;

  -- Update progress
  UPDATE language_progress SET
    total_session_count = total_session_count + 1,
    total_practice_minutes = total_practice_minutes + CEIL(p_session_duration_seconds / 60.0),
    current_streak_days = v_new_streak,
    longest_streak_days = GREATEST(longest_streak_days, v_new_streak),
    last_practice_at = NOW(),
    vocabulary_learned_count = vocabulary_learned_count + p_vocab_introduced,
    grammar_learned_count = grammar_learned_count + p_grammar_introduced,
    updated_at = NOW()
  WHERE id = v_progress.id
  RETURNING * INTO v_progress;

  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comprehensive memory context for a user/language
CREATE OR REPLACE FUNCTION get_memory_context(
  p_user_id UUID,
  p_language_code TEXT
)
RETURNS TABLE (
  progress_data JSONB,
  mastered_vocab_count BIGINT,
  mastered_grammar_count BIGINT,
  vocab_due_count BIGINT,
  grammar_due_count BIGINT,
  struggling_vocab_count BIGINT,
  struggling_grammar_count BIGINT,
  recent_session_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT row_to_json(lp.*) FROM language_progress lp
     WHERE lp.user_id = p_user_id AND lp.language_code = p_language_code)::JSONB AS progress_data,
    (SELECT COUNT(*) FROM vocabulary_memory vm
     WHERE vm.user_id = p_user_id AND vm.language_code = p_language_code AND vm.mastery_level >= 0.8) AS mastered_vocab_count,
    (SELECT COUNT(*) FROM grammar_memory gm
     WHERE gm.user_id = p_user_id AND gm.language_code = p_language_code AND gm.mastery_level >= 0.8) AS mastered_grammar_count,
    (SELECT COUNT(*) FROM vocabulary_memory vm
     WHERE vm.user_id = p_user_id AND vm.language_code = p_language_code AND vm.next_review_at <= NOW()) AS vocab_due_count,
    (SELECT COUNT(*) FROM grammar_memory gm
     WHERE gm.user_id = p_user_id AND gm.language_code = p_language_code AND gm.next_review_at <= NOW()) AS grammar_due_count,
    (SELECT COUNT(*) FROM vocabulary_memory vm
     WHERE vm.user_id = p_user_id AND vm.language_code = p_language_code AND vm.mastery_level < 0.5 AND vm.times_seen > 1) AS struggling_vocab_count,
    (SELECT COUNT(*) FROM grammar_memory gm
     WHERE gm.user_id = p_user_id AND gm.language_code = p_language_code AND gm.mastery_level < 0.5 AND gm.times_practiced > 1) AS struggling_grammar_count,
    (SELECT COUNT(*) FROM lesson_sessions ls
     WHERE ls.user_id = p_user_id AND ls.language_code = p_language_code AND ls.started_at > NOW() - INTERVAL '7 days') AS recent_session_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
