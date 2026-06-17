-- Add last_login column to users table
ALTER TABLE next_auth.users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
