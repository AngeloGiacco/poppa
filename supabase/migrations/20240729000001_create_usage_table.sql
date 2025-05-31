-- Create the usage table
CREATE TABLE usage (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE, -- Each user has one usage row
    usage_count INTEGER DEFAULT 0,
    usage_limit INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage
CREATE POLICY "Allow users to select their own usage"
ON usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Deny all other operations on usage"
ON usage
FOR ALL
USING (false);
