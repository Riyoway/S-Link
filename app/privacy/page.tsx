export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">プライバシーポリシー（Privacy Policy）</h1>
      <p className="mb-4 text-sm text-gray-500">最終更新日：2025年</p>
      <p className="mb-8">
        本プライバシーポリシーは、学生プロジェクトとして運営される <strong>S-Link</strong>（以下「本サービス」）におけるユーザー情報の取扱い方針を定めるものです。
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. 収集する情報</h2>
        <p className="mb-2">本サービスは、以下のユーザー情報を取得します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>フルネーム</li>
          <li>メールアドレス（Google アカウントによる認証）</li>
          <li>学校内部情報（学年、クラス、コース）</li>
          <li>システム利用上必要な識別子（ユーザーID など）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. 情報の利用目的</h2>
        <p className="mb-2">収集した情報は、以下の目的で利用します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスへのログイン・認証のため</li>
          <li>時間割・行事予定など、ユーザーに応じた情報提供のため</li>
          <li>アカウント管理および安全な利用の確保のため</li>
          <li>不正利用防止およびセキュリティ対策のため</li>
        </ul>
        <p className="mt-2">本サービスは解析ツール（Google Analytics 等）は使用しません。</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. 外部サービスの利用</h2>
        <p className="mb-4">本サービスは以下の外部サービスを利用します。</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Supabase（認証・データベース）</h3>
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://supabase.com/privacy</a>
          </div>
          <div>
            <h3 className="font-semibold">Google OAuth（ログイン認証）</h3>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a>
          </div>
          <div>
            <h3 className="font-semibold">Vercel（ホスティング）</h3>
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://vercel.com/legal/privacy-policy</a>
          </div>
        </div>
        <p className="mt-4">これらサービスで保存・処理されるデータは、当該サービスの利用規約・プライバシーポリシーに基づき管理されます。</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. 個人情報の第三者提供</h2>
        <p>法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. セキュリティ</h2>
        <p>
          本サービスは、Supabase の <strong>Row Level Security (RLS)</strong> を利用し、
          未ログインユーザーや関係のないユーザーがデータへアクセスできないよう保護しています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. プライバシーポリシーの変更</h2>
        <p>必要に応じて、本ポリシーの内容を変更する場合があります。</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. お問い合わせ</h2>
        <p className="mb-2">プライバシーに関するお問い合わせは、以下のメールアドレスまでご連絡ください。</p>
        <a href="mailto:e652h21z@anonaddy.com" className="text-blue-600 hover:underline font-medium">e652h21z@anonaddy.com</a>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">著作権情報（Copyright）</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">
          © 2025 S-Link. All rights reserved.
        </pre>
        <p className="mb-2">
          本サービス内のコンテンツ（テキスト、画像、UIデザイン、コード等）の著作権は、学生プロジェクトとして運営する S-Link に帰属します。
          無断での転載・再配布・複製は禁止します。
        </p>
        <p>
          外部ライブラリ（Next.js、Supabase、NextAuth 等）は、それぞれのライセンスに従って使用しています。
        </p>
      </section>
    </div>
  );
}
