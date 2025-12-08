import { requireAuth } from "@/lib/auth-guard";
import Image from "next/image";
import {
  CardDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  const { session } = await requireAuth("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 fill-mode-both">
        <Card className="border-0 shadow-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200/50 dark:ring-gray-700/50 overflow-hidden">
          <CardHeader className="pb-8 text-center space-y-6 pt-10">
            <div className="flex justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-4xl shadow-xl ring-4 ring-white dark:ring-gray-800 transition-transform hover:scale-105 duration-500">
                <Image
                  src="/icons/logo.png"
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
                こんにちは、
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {session.user?.name}
                </span>{" "}
                さん。
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                現在準備中です...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
