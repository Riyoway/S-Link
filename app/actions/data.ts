"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export type ExportData = {
  memos: { id: string; title: string; content: string; created_at: string; updated_at: string }[];
  todos: { id: string; content: string; is_completed: boolean; parent_id: string | null; created_at: string }[];
};

// Helper to get Supabase client with admin access
const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
};

// Helper to get current authenticated user's ID from next_auth table
const getCurrentUserId = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const supabase = getSupabase();
  const { data: user } = await supabase
    .schema("next_auth")
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  return user?.id;
};

export async function getAllUserData(): Promise<ExportData | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const supabase = getSupabase();

  // Fetch Memos
  const { data: memos, error: memoError } = await supabase
    .schema("next_auth")
    .from("memos")
    .select("*")
    .eq("user_id", userId);

  if (memoError) {
    console.error("Error fetching memos for export:", memoError);
    return null;
  }

  // Fetch Todos
  const { data: todos, error: todoError } = await supabase
    .schema("next_auth")
    .from("todos")
    .select("*")
    .eq("user_id", userId);

  if (todoError) {
    console.error("Error fetching todos for export:", todoError);
    return null;
  }

  return {
    memos: memos || [],
    todos: todos || [],
  };
}

export async function deleteAllMemos(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const supabase = getSupabase();
  const { error } = await supabase
    .schema("next_auth")
    .from("memos")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting all memos:", error);
    return false;
  }
  return true;
}

export async function deleteAllTodos(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const supabase = getSupabase();
  const { error } = await supabase
    .schema("next_auth")
    .from("todos")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting all todos:", error);
    return false;
  }
  return true;
}
