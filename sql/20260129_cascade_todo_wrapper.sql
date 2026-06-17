-- Wrapper function in public schema to call next_auth.cascade_complete_todo
CREATE OR REPLACE FUNCTION public.cascade_complete_todo(
  target_todo_id UUID,
  target_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM next_auth.cascade_complete_todo(target_todo_id, target_user_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.cascade_complete_todo TO service_role;
GRANT EXECUTE ON FUNCTION public.cascade_complete_todo TO authenticated;
