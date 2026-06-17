"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

import fs from "fs/promises";
import path from "path";

export type DashboardStats = {
  storageUsage: number;
  storageLimit: number;
  memoCount: number;
  todoCount: number;
};

export type ChangelogItem = {
  version: string;
  date: string;
  title: string;
  content: string;
};

export async function getChangelog(): Promise<ChangelogItem[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "changelog.json");
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    return json.updates || [];
  } catch (error) {
    console.error("Failed to read changelog:", error);
    return [];
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { storageUsage: 0, storageLimit: 2 * 1024 * 1024, memoCount: 0, todoCount: 0 };
  }

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

  if (!user) {
    return { storageUsage: 0, storageLimit: 2 * 1024 * 1024, memoCount: 0, todoCount: 0 };
  }

  // Get Storage Usage
  const { data: usage } = await supabase.rpc("get_user_storage_usage", {
    target_user_id: user.id
  });

  // Get Counts
  const { count: memoCount } = await supabase
    .schema("next_auth")
    .from("memos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: todoCount } = await supabase
    .schema("next_auth")
    .from("todos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return {
    storageUsage: usage || 0,
    storageLimit: 2 * 1024 * 1024, // 2MB
    memoCount: memoCount || 0,
    todoCount: todoCount || 0
  };
}
