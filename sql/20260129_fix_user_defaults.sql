-- 1. Fix language default to 'ja_JP'
ALTER TABLE next_auth.users 
ALTER COLUMN language SET DEFAULT 'ja_JP';

-- 2. Add created_at and updated_at columns if they don't exist
ALTER TABLE next_auth.users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION next_auth.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON next_auth.users;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON next_auth.users
FOR EACH ROW
EXECUTE FUNCTION next_auth.handle_updated_at();

-- 5. Create function to update last_login on session creation
CREATE OR REPLACE FUNCTION next_auth.handle_new_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE next_auth.users
  SET last_login = NOW()
  WHERE id = NEW."userId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger for last_login on new session
DROP TRIGGER IF EXISTS update_last_login_on_session ON next_auth.sessions;
CREATE TRIGGER update_last_login_on_session
AFTER INSERT ON next_auth.sessions
FOR EACH ROW
EXECUTE FUNCTION next_auth.handle_new_session();

-- 7. Ensure last_login is set on user creation
CREATE OR REPLACE FUNCTION next_auth.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default language if null (redundant with column default but safe)
  IF NEW.language IS NULL THEN
    NEW.language := 'ja_JP';
  END IF;
  
  -- Set last_login
  NEW.last_login := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for user creation
DROP TRIGGER IF EXISTS set_defaults_on_user_create ON next_auth.users;
CREATE TRIGGER set_defaults_on_user_create
BEFORE INSERT ON next_auth.users
FOR EACH ROW
EXECUTE FUNCTION next_auth.handle_new_user();
