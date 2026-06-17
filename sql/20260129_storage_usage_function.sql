-- Function to calculate total storage usage for a user
-- Returns total bytes used by memos (title + content) and todos (content)
-- Optional parameters to exclude a specific record (useful for updates)

CREATE OR REPLACE FUNCTION next_auth.get_user_storage_usage(
  target_user_id UUID,
  exclude_table TEXT DEFAULT NULL,
  exclude_id UUID DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  memo_size BIGINT;
  todo_size BIGINT;
BEGIN
  -- Calculate Memos size
  SELECT COALESCE(SUM(OCTET_LENGTH(COALESCE(title, '')) + OCTET_LENGTH(COALESCE(content, ''))), 0)
  INTO memo_size
  FROM next_auth.memos
  WHERE user_id = target_user_id
  AND (exclude_table IS DISTINCT FROM 'memos' OR id IS DISTINCT FROM exclude_id);

  -- Calculate Todos size
  SELECT COALESCE(SUM(OCTET_LENGTH(COALESCE(content, ''))), 0)
  INTO todo_size
  FROM next_auth.todos
  WHERE user_id = target_user_id
  AND (exclude_table IS DISTINCT FROM 'todos' OR id IS DISTINCT FROM exclude_id);

  RETURN memo_size + todo_size;
END;
$$;

GRANT EXECUTE ON FUNCTION next_auth.get_user_storage_usage TO service_role;
GRANT EXECUTE ON FUNCTION next_auth.get_user_storage_usage TO authenticated;
