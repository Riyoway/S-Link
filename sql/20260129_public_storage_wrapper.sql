CREATE OR REPLACE FUNCTION public.get_user_storage_usage(
  target_user_id UUID,
  exclude_table TEXT DEFAULT NULL,
  exclude_id UUID DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN next_auth.get_user_storage_usage(target_user_id, exclude_table, exclude_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_storage_usage TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_storage_usage TO authenticated;
