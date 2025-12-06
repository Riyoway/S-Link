"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { redirect } from "next/navigation";

// サーバーアクション: プロフィール更新
export async function updateProfile(data: {
  grade: string;
  class?: string;
  course?: string;
  department?: string;
  commuteMethod?: number;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Supabase接続 (Adapter経由が一番簡単だが、直接Clientを使う手もある)
  // ここではSupabase Clientを直接使用して更新する
  // (Adapterのインスタンスを直接使うのは難しいため)
  
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // next_auth.users テーブルを更新
  // next-authは email をキーにしている
  const { error } = await supabase
    .schema("next_auth")
    .from("users")
    .update({
      grade: data.grade,
      class: data.class || null,
      course: data.course || null,
      department: data.department || null,
      commute_method: data.commuteMethod || null,
    })
    .eq("email", session.user.email);

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }

  // 成功したらホームへ
  redirect("/");
}

// サーバーアクション: プロフィール取得
export async function getProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data } = await supabase
    .schema("next_auth")
    .from("users")
    .select("grade")
    .eq("email", session.user.email)
    .single();

  return data;
}
