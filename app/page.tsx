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
    redirect("/onboarding");
  }

  // 4. 設定済みならWelcome画面
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-xl bg-white p-12 text-center shadow-lg dark:bg-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          ようこそ、S-Linkへ！
        </h1>
        <div className="space-y-4 text-xl text-gray-600 dark:text-gray-300">
          <p>
            こんにちは、<span className="font-semibold text-primary">{session.user?.name}</span> さん。
          </p>
          <p>初期設定は完了しています。</p>
        </div>
        <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <p className="text-sm font-medium">現在はここまで実装されています</p>
        </div>
      </main>
    </div>
  );
}
