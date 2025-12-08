import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function requireAuth(currentPath: string) {
  const session = await getServerSession(authOptions);

  // 1. 未ログインならログインページへ (callbackUrl付き)
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  }

  // 2. ユーザー情報の取得
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: userProfile } = await supabase
    .schema("next_auth")
    .from("users")
    .select("grade")
    .eq("email", session.user?.email)
    .single();

  // 3. プロフィール未設定なら登録ページへ
  if (!userProfile?.grade) {
    redirect("/register");
  }

  return { session, userProfile };
}
