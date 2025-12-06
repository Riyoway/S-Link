import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen px-4 py-12 transition-colors duration-500">
      <div className="container mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-0 shadow-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="pb-8 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              利用規約
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
              最終更新日：2025年12月7日
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8 px-6 sm:px-10 pb-10">
            <p className="lead text-lg text-gray-700 dark:text-gray-300">
              本規約は、学生プロジェクトとして運営される <strong>S-Link</strong>（以下「本サービス」）の利用条件を定めるものです。本サービスを利用することで、ユーザーは本規約に同意したものとみなします。
            </p>

            <hr className="border-gray-200 dark:border-gray-700/50" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">1</span>
                本サービスの目的
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                本サービスは、学内情報（時間割、行事予定、コース情報など）の閲覧を補助し、
                学生の利便性を向上させることを目的としています。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">2</span>
                利用条件
              </h2>
              <p className="mb-3 text-gray-600 dark:text-gray-400">本サービスの利用には Google アカウントによる認証が必要です。</p>
              <p className="mb-3 text-gray-600 dark:text-gray-400">以下のいずれかに該当する場合、利用を拒否する場合があります。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 marker:text-indigo-500">
                <li>学内メールアドレス（@ktc.ac.jp 等）以外のアカウントによるアクセス</li>
                <li>不正アクセスの疑いがある場合</li>
                <li>規約違反が確認された場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">3</span>
                収集される情報
              </h2>
              <p className="mb-3 text-gray-600 dark:text-gray-400">本サービスは以下のユーザー情報を扱います。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 marker:text-indigo-500">
                <li>フルネーム</li>
                <li>メールアドレス</li>
                <li>学年、クラス、コース等の学内情報</li>
                <li>サービス利用上必要な識別子（ユーザーID など）</li>
              </ul>
              <p className="mt-3 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                収集内容・目的の詳細は <Link href="/privacy" className="text-indigo-600 hover:underline font-medium">プライバシーポリシー</Link> にて定めます。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">4</span>
                外部サービスの利用
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">本サービスは以下の外部サービスを利用します。</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Google OAuth</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">Google アカウント認証</p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center">
                    プライバシーポリシー
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Supabase</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-2">認証・データベース</p>
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center">
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
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">5</span>
                禁止事項
              </h2>
              <p className="mb-2 text-gray-600 dark:text-gray-400">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 marker:text-red-500">
                <li>他人になりすましたアクセス</li>
                <li>学内情報の不正取得・改ざん・共有</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>法令や学校規則に違反する行為</li>
                <li>本サービスの著作物の無断転載、再配布、複製</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">6</span>
                サービスの提供停止・変更
              </h2>
              <p className="mb-2 text-gray-600 dark:text-gray-400">以下の場合、本サービスを停止・変更することがあります。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 marker:text-indigo-500">
                <li>システム保守・障害対応</li>
                <li>外部サービスの仕様変更</li>
                <li>プロジェクトの終了</li>
                <li>セキュリティ上の緊急対応</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">これらにより発生した損害について、運営は責任を負いません。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">7</span>
                免責事項
              </h2>
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 dark:bg-amber-900/20 dark:border-amber-900/50">
                <ul className="list-disc pl-6 space-y-2 text-amber-900 dark:text-amber-100 marker:text-amber-500 text-sm">
                  <li>本サービスの情報は正確性を保証するものではありません。</li>
                  <li>学内情報の更新遅延、誤り等について責任を負いません。</li>
                  <li>外部サービスの障害・停止により利用できなくなる場合があります。</li>
                  <li>利用によって生じた損害・トラブルについて、一切の責任を負いません。</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">8</span>
                著作権
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                本サービス内のコンテンツ（UI、画像、テキスト、コード等）は S-Link に帰属します。
                無断での複製、転載は禁止します。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">9</span>
                規約の変更
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                必要に応じて、本規約を変更する場合があります。
                最新の内容は本ページで告知します。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold mr-3">10</span>
                お問い合わせ
              </h2>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center">
                <p className="mb-3 text-gray-600 dark:text-gray-400">本サービスに関するお問い合わせは以下へご連絡ください。</p>
                <a href="mailto:e652h21z@anonaddy.com" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 font-medium transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  e652h21z@anonaddy.com
                </a>
              </div>
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
