-- Function to cascade completion status to all descendant todos
CREATE OR REPLACE FUNCTION next_auth.cascade_complete_todo(
  target_todo_id UUID,
  target_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  WITH RECURSIVE descendants AS (
    SELECT id FROM next_auth.todos WHERE parent_id = target_todo_id
    UNION
    SELECT t.id FROM next_auth.todos t
    INNER JOIN descendants d ON t.parent_id = d.id
  )
  UPDATE next_auth.todos
  SET is_completed = TRUE,
      updated_at = NOW()
  WHERE id IN (SELECT id FROM descendants) 
  AND user_id = target_user_id
  AND is_completed = FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION next_auth.cascade_complete_todo TO service_role;
GRANT EXECUTE ON FUNCTION next_auth.cascade_complete_todo TO authenticated;
