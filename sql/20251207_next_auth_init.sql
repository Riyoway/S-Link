-- UUID拡張
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- スキーマ作成
CREATE SCHEMA next_auth;

-- 権限付与
GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA next_auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA next_auth GRANT ALL ON TABLES TO service_role;

-- Usersテーブル
CREATE TABLE next_auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  grade TEXT,
  class TEXT,
  course TEXT,
  department TEXT,
  commute_method INTEGER
);

-- Accountsテーブル
CREATE TABLE next_auth.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  oauth_token_secret TEXT,
  oauth_token TEXT,
  UNIQUE(provider, "providerAccountId")
);

-- Sessionsテーブル
CREATE TABLE next_auth.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT UNIQUE NOT NULL
);

-- Verification Tokensテーブル
CREATE TABLE next_auth.verification_tokens (
  identifier TEXT,
  token TEXT PRIMARY KEY,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(token),
  UNIQUE(identifier, token)
);
