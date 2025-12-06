"use client";

import Link from "next/link";
import { useLottie } from "lottie-react";
import catAnimation from "@/public/animations/404-cat-sleeping.json";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home } from "lucide-react";

export default function NotFound() {
  const options = {
    animationData: catAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="mx-auto w-64 h-64 -my-8 relative z-10">
              {View}
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 relative z-20">
              Ooops...
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300 font-medium relative z-20">
              ページが見つかりません
              <br />
              お探しのページは削除された可能性があります...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-6 pb-8 relative z-20">
            <Button
              asChild
              className="rounded-full px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                ホームに戻る
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
