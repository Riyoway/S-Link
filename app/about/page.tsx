"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundAnimation from "@/components/background-animation";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-foreground px-4">
      <BackgroundAnimation />

      <div className="absolute top-6 left-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
      </div>

      <div className="max-w-lg text-center space-y-6 z-10">
        <h1 className="text-4xl font-bold tracking-tight">S-Link</h1>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            S-Link は、学校の授業内 PBL（Project Based Learning）プロジェクトとして開発された、学生向け学校生活支援 Web アプリです。
          </p>
          <p>
            現在このプロジェクトはメンテナンスされていません。また、データベースサーバーも停止しているため、アプリとしての利用はできない状態です。
          </p>
        </div>

        <p className="text-xs text-muted-foreground/50 pt-4">© 2026 S-Link Project. All rights reserved.</p>
      </div>
    </div>
  );
}
