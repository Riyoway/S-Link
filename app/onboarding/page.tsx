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
import Image from "next/image";

// フォームスキーマ定義
const formSchema = z.object({
  grade: z.string().min(1, "学年を入力してください"),
  // 1-2年用のクラス選択
  lowGradeClass: z.string().optional(),
  // 3-5年用のコース選択
  highGradeCourse: z.string().optional(),
  // CA用の学科選択
  caDepartment: z.string().optional(),

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

  // 学年推定ロジック (初期値用)
  const inferredGrade = useMemo(() => {
    if (!session?.user?.email) return "5";
    const match = session.user.email.match(/^g(\d{2})/i);
    if (!match) return "5";
    const num = match[1];
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

  // 値の監視
  const watchGrade = form.watch("grade");
  const watchHighGradeCourse = form.watch("highGradeCourse");
  const watchTerms = form.watch("terms");
  const watchPrivacy = form.watch("privacy");

  // 初期値セット (inferredGradeが変わったらセット)
  useEffect(() => {
    if (inferredGrade) {
      form.setValue("grade", inferredGrade);
    }
  }, [inferredGrade, form]);

  // 提出ハンドラ
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const gradeNum = parseInt(values.grade);
      let finalClass = "";
      let finalCourse = "";
      let finalDepartment = "";

      if (gradeNum <= 2) {
        // 1-2年生
        finalCourse = "共通教育科";
        finalClass = values.lowGradeClass || "";
      } else {
        // 3-5年生
        if (values.highGradeCourse === "I") {
          finalClass = "I";
          finalCourse = "機械システム工学科";
        } else if (values.highGradeCourse === "E") {
          finalClass = "E";
          finalCourse = "電気電子工学科";
        } else if (values.highGradeCourse === "M") {
          finalClass = "M";
          finalCourse = "情報システム工学科"; 
        } else if (values.highGradeCourse === "CA") {
          finalCourse = "都市環境工学科";
          if (values.caDepartment === "C") {
            finalClass = "C";
            finalDepartment = "土木";
          } else if (values.caDepartment === "A") {
            finalClass = "A";
            finalDepartment = "建築";
          }
        }
      }

      await updateProfile({
        grade: values.grade,
        class: finalClass,
        course: finalCourse,
        department: finalDepartment,
      });

      router.push("/");
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const gradeNum = parseInt(watchGrade || "5");
  const isLowGrade = gradeNum <= 2;
  const isHighGrade = gradeNum >= 3;

  // ボタン有効化ロジック
  const isValid =
    watchTerms &&
    watchPrivacy &&
    watchGrade &&
    (isLowGrade
      ? !!form.watch("lowGradeClass")
      : isHighGrade
      ? watchHighGradeCourse === "CA"
        ? !!form.watch("caDepartment")
        : !!watchHighGradeCourse
      : false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-slate-50 to-blue-50 px-4 py-12 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 fill-mode-both">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md dark:bg-gray-800/60 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex justify-center pb-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl shadow-lg ring-4 ring-white dark:ring-gray-800 transition-transform hover:scale-105 duration-300">
                <Image
                  src="/icons/logo.png"
                  alt="S-Link Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
                アカウント設定
              </CardTitle>
              <CardDescription className="text-base text-gray-500 dark:text-gray-400 font-medium">
                S-Linkへようこそ。<br />初期設定を完了してください。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 名前 */}
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input
                    value={session?.user?.name || ""}
                    disabled
                    readOnly
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </FormControl>
              </FormItem>

              {/* 学年 */}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学年</FormLabel>
                    <Select
                      key={field.value || inferredGrade}
                      onValueChange={field.onChange}
                      value={field.value || inferredGrade}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-950">
                          <SelectValue placeholder="学年を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1年</SelectItem>
                        <SelectItem value="2">2年</SelectItem>
                        <SelectItem value="3">3年</SelectItem>
                        <SelectItem value="4">4年</SelectItem>
                        <SelectItem value="5">5年</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      メールアドレスから推定されました
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 1-2年生用 */}
              {isLowGrade && (
                <FormField
                  control={form.control}
                  name="lowGradeClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>クラス</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                          <SelectItem value="4">4組</SelectItem>
                          <SelectItem value="5">5組</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormItem className="mt-2">
                        <FormLabel className="text-xs text-gray-500">
                          コース
                        </FormLabel>
                        <Input
                          value="共通教育科"
                          disabled
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* 3-5年生用 */}
              {isHighGrade && (
                <FormField
                  control={form.control}
                  name="highGradeCourse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>コース</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val !== "CA") {
                            form.setValue("caDepartment", undefined);
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="コースを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="I">
                            機械システム工学科 (I)
                          </SelectItem>
                          <SelectItem value="E">電気電子工学科 (E)</SelectItem>
                          <SelectItem value="M">
                            制御情報システム工学科 (M)
                          </SelectItem>
                          <SelectItem value="CA">
                            都市環境工学科 (CA)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* CA用 */}
              {isHighGrade && watchHighGradeCourse === "CA" && (
                <FormField
                  control={form.control}
                  name="caDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学科 (都市環境)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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

              <div className="space-y-4 pt-4 border-t">
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
                        <FormLabel className="cursor-pointer">
                          <Link
                            href="/term"
                            target="_blank"
                            className="text-primary hover:underline font-bold"
                          >
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
                        <FormLabel className="cursor-pointer">
                          <Link
                            href="/privacy"
                            target="_blank"
                            className="text-primary hover:underline font-bold"
                          >
                            プライバシーポリシー
                          </Link>
                          に同意する
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-bold py-6"
                disabled={!isValid || isLoading}
              >
                {isLoading ? "作成中..." : "アカウントを作成"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
