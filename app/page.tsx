import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-slate-50 to-blue-50 px-4 py-12 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 transition-colors duration-500">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 fill-mode-both">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md dark:bg-gray-800/60 ring-1 ring-gray-200/50 dark:ring-gray-700/50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
          <CardHeader className="pb-8 text-center space-y-6 pt-10">
            <div className="flex justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-4xl shadow-xl ring-4 ring-white dark:ring-gray-800 transition-transform hover:scale-105 duration-500">
                <Image
                  src="/icons/icon-512.png"
                  alt="S-Link Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
                ようこそ、S-Linkへ！
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                学生生活をより便利に、スマートに。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-12 text-center space-y-8">
            <div className="space-y-4">
              <p className="text-xl text-gray-700 dark:text-gray-200">
                こんにちは、<span className="font-bold text-indigo-600 dark:text-indigo-400">{session.user?.name}</span> さん。
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                初期設定は完了しています。
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative rounded-xl bg-white dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-center space-x-3 mb-2 text-indigo-500 dark:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hammer"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V4.5c0-.27-.22-.5-.5-.5h-3.7c-.84 0-1.64-.33-2.25-.93L11 1.82"/><path d="m15 12 5 5"/></svg>
                  <span className="font-bold text-lg">開発中</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">現在はここまで実装されています。<br/>今後のアップデートをお待ちください。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
