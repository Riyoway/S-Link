export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">利用規約（Terms of Service）</h1>
      <p className="mb-4 text-sm text-gray-500">最終更新日：2025年</p>
      <p className="mb-8">
        本規約は、学生プロジェクトとして運営される <strong>S-Link</strong>（以下「本サービス」）の利用条件を定めるものです。本サービスを利用することで、ユーザーは本規約に同意したものとみなします。
      </p>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. 本サービスの目的</h2>
        <p>
          本サービスは、学内情報（時間割、行事予定、コース情報など）の閲覧を補助し、
          学生の利便性を向上させることを目的としています。
        </p>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. 利用条件</h2>
        <p className="mb-2">本サービスの利用には Google アカウントによる認証が必要です。</p>
        <p className="mb-2">以下のいずれかに該当する場合、利用を拒否する場合があります。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>学内メールアドレス（@ktc.ac.jp 等）以外のアカウントによるアクセス</li>
          <li>不正アクセスの疑いがある場合</li>
          <li>規約違反が確認された場合</li>
        </ul>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. 収集される情報</h2>
        <p className="mb-2">本サービスは以下のユーザー情報を扱います。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>フルネーム</li>
          <li>メールアドレス</li>
          <li>学年、クラス、コース等の学内情報</li>
          <li>サービス利用上必要な識別子（ユーザーID など）</li>
        </ul>
        <p className="mt-2">
          収集内容・目的の詳細は <strong>プライバシーポリシー</strong> にて定めます。
        </p>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. 外部サービスの利用</h2>
        <p className="mb-4">本サービスは以下の外部サービスを利用します。</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Google OAuth（Google アカウント認証）</h3>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a>
          </div>
          <div>
            <h3 className="font-semibold">Supabase（認証・データベース）</h3>
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://supabase.com/privacy</a>
          </div>
          <div>
            <h3 className="font-semibold">Vercel（ホスティング）</h3>
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://vercel.com/legal/privacy-policy</a>
          </div>
        </div>
        <p className="mt-4">各サービスに送信される情報については、各社のポリシーに従います。</p>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. 禁止事項</h2>
        <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>他人になりすましたアクセス</li>
          <li>学内情報の不正取得・改ざん・共有</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>法令や学校規則に違反する行為</li>
          <li>本サービスの著作物の無断転載、再配布、複製</li>
        </ul>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. サービスの提供停止・変更</h2>
        <p className="mb-2">以下の場合、本サービスを停止・変更することがあります。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>システム保守・障害対応</li>
          <li>外部サービスの仕様変更</li>
          <li>プロジェクトの終了</li>
          <li>セキュリティ上の緊急対応</li>
        </ul>
        <p className="mt-2">これらにより発生した損害について、運営は責任を負いません。</p>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. 免責事項</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスの情報は正確性を保証するものではありません。</li>
          <li>学内情報の更新遅延、誤り等について責任を負いません。</li>
          <li>外部サービスの障害・停止により利用できなくなる場合があります。</li>
          <li>利用によって生じた損害・トラブルについて、一切の責任を負いません。</li>
        </ul>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. 著作権</h2>
        <p>
          本サービス内のコンテンツ（UI、画像、テキスト、コード等）は S-Link に帰属します。
          無断での複製、転載は禁止します。
        </p>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. 規約の変更</h2>
        <p>
          必要に応じて、本規約を変更する場合があります。
          最新の内容は本ページで告知します。
        </p>
      </section>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">10. お問い合わせ</h2>
        <p className="mb-2">本サービスに関するお問い合わせは以下へご連絡ください。</p>
        <a href="mailto:e652h21z@anonaddy.com" className="text-blue-600 hover:underline font-medium">e652h21z@anonaddy.com</a>
      </section>
    </div>
  );
}
