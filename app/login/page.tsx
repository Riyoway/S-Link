"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackgroundAnimation from "@/components/background-animation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, AlertTriangle, Copy, Smartphone, Info } from "lucide-react";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isPc, setIsPc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In-App Browser & PC Detection
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isLine = /line/i.test(ua);
    const isInApp = /line|instagram|facebook|twitter|discord/i.test(ua);
    
    // Simple PC detection
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    if (!isMobile && window.innerWidth > 768) {
      setIsPc(true);
    }

    if (isInApp) {
      // LINE: Auto-redirect to external browser
      if (isLine) {
        if (searchParams.get("openExternalBrowser") !== "1") {
          const url = new URL(window.location.href);
          url.searchParams.set("openExternalBrowser", "1");
          window.location.href = url.toString();
          return;
        }
      }
      // Other In-App Browsers: Show warning
      setIsInAppBrowser(true);
    }
  }, [searchParams]);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // UI for In-App Browsers (where Google Login might fail)
  if (isInAppBrowser) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <BackgroundAnimation />
        <Card className="w-full max-w-md text-center shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 border-amber-200 dark:border-amber-800">
          <CardHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle className="text-xl font-bold text-amber-900 dark:text-amber-100">
              ブラウザを変更してください
            </CardTitle>
            <CardDescription className="text-amber-800/80 dark:text-amber-200/80">
              現在ご使用のアプリ内ブラウザでは、Googleセキュリティの制限によりログインできない可能性があります。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-left bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-100 dark:border-amber-900">
              <p className="font-semibold mb-2">手順:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>右下または右上のメニューアイコン（•••）をタップ</li>
                <li>「ブラウザで開く」または「Safari/Chromeで開く」を選択</li>
              </ol>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("URLをコピーしました。ブラウザのアドレスバーに貼り付けてください。");
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              現在のURLをコピー
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative">
      <BackgroundAnimation />
      
      {/* About Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-white/20">
          <Link href="/about" className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">このアプリについて</span>
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md text-center shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 relative z-0">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-bold">S-Linkへようこそ</CardTitle>
          <CardDescription>
            学校のGoogleアカウントでログインして、始めましょう
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => {
              setIsLoading(true);
              signIn("google", { callbackUrl });
            }}
            disabled={isLoading}
            className="w-full py-6 text-lg flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Image
                src="/assets/service/google.svg"
                alt="Google"
                width={24}
                height={24}
                priority
              />
            )}
            {isLoading ? "ログイン中..." : "Google でログイン"}
          </Button>

          {isPc && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 border-dashed border-2 hover:border-solid hover:bg-accent/50 transition-all text-muted-foreground hover:text-foreground">
                  <Smartphone className="h-4 w-4" />
                  スマホでの利用がおすすめです
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">スマホでS-Linkを使う</DialogTitle>
                  <DialogDescription className="text-center">
                    QRコードを読み取って、スマートフォンで快適にアクセス
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-8 bg-linear-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-xl border border-border/50 backdrop-blur-sm my-2">
                  <div className="bg-white p-4 rounded-2xl shadow-lg ring-1 ring-black/5 transform hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/assets/qr-code.svg" 
                      alt="S-Link Mobile QR Code" 
                      width={180} 
                      height={180}
                      className="w-auto h-auto"
                    />
                  </div>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  <p>カメラアプリでスキャンしてください</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
