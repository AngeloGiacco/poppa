-- Add referral columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(12) UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- Create referrals table to track referral events
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code VARCHAR(12) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'credited')),
    credits_awarded INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(referrer_id, referred_id)
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view referrals they made"
ON referrals
FOR SELECT
USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view referrals where they are referred"
ON referrals
FOR SELECT
USING (auth.uid() = referred_id);

-- Function to generate unique referral code for a user
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID)
RETURNS VARCHAR(12)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_code VARCHAR(12);
    v_exists BOOLEAN;
BEGIN
    -- Check if user already has a code
    SELECT referral_code INTO v_code
    FROM users
    WHERE id = p_user_id;

    IF v_code IS NOT NULL THEN
        RETURN v_code;
    END IF;

    -- Generate new unique code
    LOOP
        v_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = v_code) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;

    -- Save code to user
    UPDATE users
    SET referral_code = v_code
    WHERE id = p_user_id;

    RETURN v_code;
END;
$$;

-- Function to process a referral
CREATE OR REPLACE FUNCTION process_referral(
    p_referral_code VARCHAR(12),
    p_referred_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referrer_id UUID;
    v_referral_id UUID;
    v_credits_bonus INT := 10; -- 10 minutes bonus for each party
BEGIN
    -- Find the referrer by code
    SELECT id INTO v_referrer_id
    FROM users
    WHERE referral_code = UPPER(p_referral_code);

    IF v_referrer_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Invalid referral code');
    END IF;

    -- Can't refer yourself
    IF v_referrer_id = p_referred_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Cannot use your own referral code');
    END IF;

    -- Check if this user was already referred
    IF EXISTS(SELECT 1 FROM referrals WHERE referred_id = p_referred_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'User already has a referrer');
    END IF;

    -- Create referral record
    INSERT INTO referrals (referrer_id, referred_id, referral_code, status, credits_awarded)
    VALUES (v_referrer_id, p_referred_user_id, UPPER(p_referral_code), 'completed', v_credits_bonus)
    RETURNING id INTO v_referral_id;

    -- Mark user as referred
    UPDATE users
    SET referred_by = v_referrer_id
    WHERE id = p_referred_user_id;

    -- Credit both users
    UPDATE users SET credits = credits + v_credits_bonus WHERE id = v_referrer_id;
    UPDATE users SET credits = credits + v_credits_bonus WHERE id = p_referred_user_id;

    -- Update referral status
    UPDATE referrals
    SET status = 'credited', completed_at = NOW()
    WHERE id = v_referral_id;

    RETURN json_build_object(
        'success', true,
        'referral_id', v_referral_id,
        'credits_awarded', v_credits_bonus
    );
END;
$$;

-- Create index for faster referral lookups
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
