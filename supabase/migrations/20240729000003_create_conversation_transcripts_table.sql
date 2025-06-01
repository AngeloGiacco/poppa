-- Create the conversation_transcripts table
CREATE TABLE conversation_transcripts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    conversation_id TEXT NOT NULL UNIQUE,
    target_language TEXT,
    transcript JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_conversation_transcripts_user_id ON conversation_transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_transcripts_conversation_id ON conversation_transcripts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_transcripts_target_language ON conversation_transcripts(target_language);

-- Enable RLS
ALTER TABLE conversation_transcripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_transcripts

-- Allow users to select their own transcripts
CREATE POLICY "Allow users to select their own conversation transcripts"
ON conversation_transcripts
FOR SELECT
USING (auth.uid() = user_id);

-- Allow service_role to perform all operations (needed for the webhook to insert data)
-- The webhook will call Supabase with the service_role key to bypass RLS for inserts.
CREATE POLICY "Allow service_role to insert transcripts"
ON conversation_transcripts
FOR INSERT
WITH CHECK (true); -- No specific check, service role has broad permissions

-- Deny all other operations for other roles
CREATE POLICY "Deny all other operations on conversation_transcripts"
ON conversation_transcripts
FOR ALL
USING (false)
WITH CHECK (false);

-- Grant usage on the sequence for the id column to service_role if necessary, though GENERATED ALWAYS AS IDENTITY usually handles this.
-- However, explicit grants can sometimes be needed depending on Supabase version or specific setups.
-- For now, we assume default behavior is sufficient. If inserts fail due to permission on sequence, this might be needed:
-- GRANT USAGE, SELECT ON SEQUENCE conversation_transcripts_id_seq TO service_role;
