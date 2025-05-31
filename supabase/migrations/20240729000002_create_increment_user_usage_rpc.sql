-- Function to atomically increment user usage and return the updated row
CREATE OR REPLACE FUNCTION increment_user_usage(p_user_id UUID, p_increment_by INTEGER DEFAULT 1)
RETURNS TABLE (
    id BIGINT,
    user_id UUID,
    usage_count INTEGER,
    usage_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE, -- Added created_at
    updated_at TIMESTAMP WITH TIME ZONE
)
AS $$
BEGIN
    -- Check if user exists in the usage table. If not, create them with a default limit.
    -- This is important if a webhook comes for a user who somehow doesn't have a usage row yet.
    -- Adjust default usage_limit as necessary, or remove this block if users are guaranteed to exist.
    IF NOT EXISTS (SELECT 1 FROM usage WHERE usage.user_id = p_user_id) THEN
        INSERT INTO usage (user_id, usage_count, usage_limit, created_at, updated_at)
        VALUES (p_user_id, 0, 0, timezone('utc'::text, now()), timezone('utc'::text, now())) -- Default limit 0, adjust if needed
        ON CONFLICT (user_id) DO NOTHING; -- Should not happen due to the IF NOT EXISTS, but as a safeguard
    END IF;

    RETURN QUERY
    UPDATE usage
    SET 
        usage_count = usage.usage_count + p_increment_by, 
        updated_at = timezone('utc'::text, now())
    WHERE usage.user_id = p_user_id
    RETURNING usage.id, usage.user_id, usage.usage_count, usage.usage_limit, usage.created_at, usage.updated_at;

    -- If the user was just created by the block above, their usage_count would be p_increment_by.
    -- If the UPDATE did not find the row (e.g. user_id is invalid or was not inserted above),
    -- this function will return an empty set. The calling code should handle this.
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the authenticated role (or any other role that needs it)
-- Make sure 'authenticated' role (or the role your PostgREST uses for API calls) can execute this.
GRANT EXECUTE ON FUNCTION increment_user_usage(UUID, INTEGER) TO authenticated;
-- If your service role makes these calls (e.g. from a secure backend), grant to service_role as well/instead.
-- GRANT EXECUTE ON FUNCTION increment_user_usage(UUID, INTEGER) TO service_role;
