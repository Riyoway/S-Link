import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // 1. 未ログインならログインページへ
  if (!session) {
    redirect("/login");
  }

  // 2. ユーザー情報の取得 (gradeがあるか確認)
  // next-authのsessionには基本情報しかないのでDBを確認
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

  // 3. プロフィール未設定（gradeがない）ならオンボーディングへ
  if (!userProfile?.grade) {
    redirect("/register");
  }

  // 4. 設定済みならWelcome画面
  redirect("/dashboard");
}
