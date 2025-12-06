
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const errorMessages: { [key: string]: string } = {
    AccessDenied:
      "指定されたドメイン (@ktc.ac.jp) 以外のアカウントではログインできません。",
    Configuration: "サーバーの設定エラーが発生しました。",
    Verification: "認証トークンの有効期限が切れているか、無効です。",
    OAuthSignin: "認証プロバイダーとの通信中にエラーが発生しました。",
    OAuthCallback: "認証プロバイダーからの応答処理中にエラーが発生しました。",
    OAuthCreateAccount: "ユーザーアカウントの作成中にエラーが発生しました。",
    EmailCreateAccount: "ユーザーアカウントの作成中にエラーが発生しました。",
    Callback: "認証コールバック中にエラーが発生しました。",
    OAuthAccountNotLinked:
      "このメールアドレスは既に別のアカウントで使用されています。",
    EmailSignin: "メール送信中にエラーが発生しました。",
    CredentialsSignin:
      "サインインに失敗しました。認証情報を確認してください。",
    SessionRequired: "このページにアクセスするにはサインインが必要です。",
    Default: "ログイン中に予期せぬエラーが発生しました。",
  };

  const message = errorMessages[error || "Default"] || errorMessages["Default"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl">ログインエラー</CardTitle>
          <CardDescription className="text-base pt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            学校発行のGoogleアカウントを使用して再度お試しください。
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/login">ログイン画面に戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
