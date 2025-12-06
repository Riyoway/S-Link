import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen px-4 py-12 transition-colors duration-500">
      <div className="container mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-0 shadow-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="pb-8 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              プライバシーポリシー
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
              最終更新日：2025年12月7日
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8 px-6 sm:px-10 pb-10">
            <p className="lead text-lg text-gray-700 dark:text-gray-300">
              本プライバシーポリシーは、学生プロジェクトとして運営される <strong>S-Link</strong>（以下「本サービス」）におけるユーザー情報の取扱い方針を定めるものです。
            </p>

            <hr className="border-gray-200 dark:border-gray-700/50" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">1</span>
                収集する情報
              </h2>
              <p className="mb-3 text-gray-600 dark:text-gray-400">本サービスは、以下のユーザー情報を取得します。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 marker:text-indigo-500">
                <li>フルネーム</li>
                <li>メールアドレス（Google アカウントによる認証）</li>
                <li>学校内部情報（学年、クラス、コース）</li>
                <li>システム利用上必要な識別子（ユーザーID など）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">2</span>
                情報の利用目的
              </h2>
              <p className="mb-3 text-gray-600 dark:text-gray-400">収集した情報は、以下の目的で利用します。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 marker:text-indigo-500">
                <li>本サービスへのログイン・認証のため</li>
                <li>時間割・行事予定など、ユーザーに応じた情報提供のため</li>
                <li>アカウント管理および安全な利用の確保のため</li>
                <li>不正利用防止およびセキュリティ対策のため</li>
              </ul>
              <p className="mt-3 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                本サービスは解析ツール（Google Analytics 等）は使用しません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">3</span>
                外部サービスの利用
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">本サービスは以下の外部サービスを利用します。</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Supabase</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">認証・データベース</p>
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center">
                    プライバシーポリシー
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Google OAuth</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">ログイン認証</p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center">
                    プライバシーポリシー
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Vercel</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">ホスティング</p>
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center">
                    プライバシーポリシー
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">これらサービスで保存・処理されるデータは、当該サービスの利用規約・プライバシーポリシーに基づき管理されます。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">4</span>
                個人情報の第三者提供
              </h2>
              <p className="text-gray-600 dark:text-gray-400">法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">5</span>
                セキュリティ
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                本サービスは、Supabase の <strong>Row Level Security (RLS)</strong> を利用し、
                未ログインユーザーや関係のないユーザーがデータへアクセスできないよう保護しています。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">6</span>
                プライバシーポリシーの変更
              </h2>
              <p className="text-gray-600 dark:text-gray-400">必要に応じて、本ポリシーの内容を変更する場合があります。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">7</span>
                お問い合わせ
              </h2>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center">
                <p className="mb-3 text-gray-600 dark:text-gray-400">プライバシーに関するお問い合わせは、以下のメールアドレスまでご連絡ください。</p>
                <a href="mailto:e652h21z@anonaddy.com" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 font-medium transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  e652h21z@anonaddy.com
                </a>
              </div>
            </section>

            <hr className="border-gray-200 dark:border-gray-700/50" />

            <section className="text-sm text-gray-500 dark:text-gray-400">
              <h2 className="font-bold mb-2">著作権情報（Copyright）</h2>
              <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-md font-mono text-xs mb-3">
                © 2025 S-Link. All rights reserved.
              </div>
              <p className="mb-2">
                本サービス内のコンテンツ（テキスト、画像、UIデザイン、コード等）の著作権は、学生プロジェクトとして運営する S-Link に帰属します。
                無断での転載・再配布・複製は禁止します。
              </p>
              <p>
                外部ライブラリ（Next.js、Supabase、NextAuth 等）は、それぞれのライセンスに従って使用しています。
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="border-gray-200 dark:border-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 px-8">
            <Link href="/" className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              メインページに戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
