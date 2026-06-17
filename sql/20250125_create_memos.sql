-- Create memos table
CREATE TABLE IF NOT EXISTS next_auth.memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user_id
CREATE INDEX IF NOT EXISTS memos_user_id_idx ON next_auth.memos(user_id);
