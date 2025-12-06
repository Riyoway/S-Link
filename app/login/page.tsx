"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  // すでにログイン済みならホームへリダイレクト
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center shadow-lg bg-white/90 backdrop-blur-md dark:bg-gray-900/90">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-bold">S-Linkへようこそ</CardTitle>
          <CardDescription>
            学校のGoogleアカウントでログインして、使用を始めましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full py-6 text-lg"
          >
            Google でログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
