"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export type Memo = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

// Create a new memo
export async function createMemo(title: string = "新規メモ") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Get user ID
  const { data: user } = await supabase
    .schema("next_auth")
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) throw new Error("User not found");

  // Check storage limit
  const STORAGE_LIMIT = 2 * 1024 * 1024; // 2MB
  const { data: currentUsage } = await supabase.rpc("get_user_storage_usage", {
    target_user_id: user.id
  });
  
  const newSize = new Blob([title]).size + new Blob([""]).size; // title + empty content
  
  if ((currentUsage || 0) + newSize > STORAGE_LIMIT) {
    throw new Error("Storage limit exceeded (2MB total for Memo + Todo)");
  }

  const { data, error } = await supabase
    .schema("next_auth")
    .from("memos")
    .insert({
      user_id: user.id,
      title: title,
      content: "",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Memo;
}

// Get all memos for the current user
export async function getMemos() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: user } = await supabase
    .schema("next_auth")
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) return [];

  const { data, error } = await supabase
    .schema("next_auth")
    .from("memos")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching memos:", error);
    return [];
  }
  return data as Memo[];
}

// Update a memo
export async function updateMemo(id: string, title: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  // Check storage limit
  const STORAGE_LIMIT = 2 * 1024 * 1024; // 2MB
  
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Get user ID first (needed for usage check)
  const { data: user } = await supabase
    .schema("next_auth")
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) throw new Error("User not found");

  const { data: currentUsage } = await supabase.rpc("get_user_storage_usage", {
    target_user_id: user.id,
    exclude_table: 'memos',
    exclude_id: id
  });

  const newSize = new Blob([title]).size + new Blob([content]).size;

  if ((currentUsage || 0) + newSize > STORAGE_LIMIT) {
    throw new Error("Storage limit exceeded (2MB total for Memo + Todo)");
  }

  const { error } = await supabase
    .schema("next_auth")
    .from("memos")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

// Delete a memo
export async function deleteMemo(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { error } = await supabase
    .schema("next_auth")
    .from("memos")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}
