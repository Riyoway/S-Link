"use client";

import { ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundAnimation from "@/components/background-animation";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CONTRIBUTORS = [
  { name: "riyoway", url: "https://github.com/riyoway" },
  { name: "kamezawa", url: "https://github.com/kamezawa" },
  { name: "koseiokuda", url: "https://github.com/koseiokuda" },
  { name: "takutaku6514", url: "https://github.com/takutaku6514" },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-foreground px-4 py-16">
      <BackgroundAnimation />

      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
      </div>

      <div className="max-w-md w-full text-center space-y-8 z-10">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white/20">
            <Image
              src="/icons/logo.png"
              alt="S-Link Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">S-Link</h1>
            <p className="text-sm text-muted-foreground mt-1">v1.2.4</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur border border-border/50 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          メンテナンス終了・サービス停止中
        </div>

        {/* Description */}
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed bg-background/30 backdrop-blur rounded-2xl p-6 border border-border/40">
          <p>
            学校の授業内 PBL（Project Based Learning）プロジェクトとして開発された、学生向け学校生活支援 Web アプリです。
          </p>
          <p>
            データベースサーバーは停止しており、現在アプリとしての利用はできません。
          </p>
        </div>

        {/* Contributors */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">Contributors</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CONTRIBUTORS.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/30 backdrop-blur border border-border/40 text-xs hover:bg-background/50 transition-colors"
              >
                <Github className="h-3 w-3" />
                {c.name}
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/40">© 2026 S-Link Project. All rights reserved.</p>
      </div>
    </div>
  );
}
