"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile } from "@/app/actions/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const formSchema = z.object({
  grade: z.string(),
  class: z.string().optional(),
  course: z.string().optional(),
  department: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "利用規約への同意が必要です",
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: "プライバシーポリシーへの同意が必要です",
  }),
});

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ログインしていない場合はログインページへ
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 学年推定ロジック
  const inferredGrade = useMemo(() => {
    if (!session?.user?.email) return "5"; // デフォルト5年（例外）

    const match = session.user.email.match(/^g(\d{2})/);
    if (!match) return "5";

    const num = match[1];
    // g07 -> 1年, g06 -> 2年, g05 -> 3年, g04 -> 4年
    // 将来的には年度計算が必要だが、一旦ハードコード
    if (num === "07") return "1";
    if (num === "06") return "2";
    if (num === "05") return "3";
    if (num === "04") return "4";
    return "5";
  }, [session?.user?.email]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: inferredGrade,
      terms: false,
      privacy: false,
    },
  });

  // inferredGradeが変わったら値をセット
  useEffect(() => {
    form.setValue("grade", inferredGrade);
  }, [inferredGrade, form]);

  const watchGrade = form.watch("grade");
  const watchCourse = form.watch("course");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await updateProfile({
        grade: values.grade,
        class: values.class,
        course: values.course,
        department: values.department,
      });
      // Server Action内でリダイレクトされるが、念のため
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("プロフィールの保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>アカウント設定</CardTitle>
          <CardDescription>
            S-Linkへようこそ。初期設定を完了してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 名前 (Read-only) */}
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input value={session?.user?.name || ""} disabled readOnly />
                </FormControl>
              </FormItem>

              {/* 学年 (Read-only) */}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学年 (メールアドレスから自動推定)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* クラス選択 (1~2年のみ) */}
              {(watchGrade === "1" || watchGrade === "2") && (
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>クラス</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="クラスを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1組</SelectItem>
                          <SelectItem value="2">2組</SelectItem>
                          <SelectItem value="3">3組</SelectItem>
                          <SelectItem value="4-5">4-5組</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* コース選択 (3~5年のみ) */}
              {(["3", "4", "5"].includes(watchGrade)) && (
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>コース</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="コースを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="I">機械システム (I)</SelectItem>
                          <SelectItem value="E">電気電子 (E)</SelectItem>
                          <SelectItem value="M">制御情報 (M)</SelectItem>
                          <SelectItem value="CA">都市環境 (CA)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* 学科選択 (コースがCAの場合のみ) */}
              {watchCourse === "CA" && (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学科</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="学科を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="C">土木 (C)</SelectItem>
                          <SelectItem value="A">建築 (A)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <Link href="/term" target="_blank" className="text-primary hover:underline">
                            利用規約
                          </Link>
                          に同意する
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                            プライバシーポリシー
                          </Link>
                          に同意する
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !form.getValues("terms") || !form.getValues("privacy")}>
                {isLoading ? "作成中..." : "アカウントを作成"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
