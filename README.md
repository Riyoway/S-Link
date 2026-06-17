# S-Link

> 学校内PBLプロジェクト — 学生向け学校生活支援Webアプリ

S-Linkは、時間割・課題・バス時刻・天気など学生が日常的に確認する情報を１つの画面に集約したWebアプリケーションです。
本リポジトリは学校内の授業プロジェクト（PBL）の成果物として公開しています。

> [!NOTE]
> 学校固有のデータ（時間割・シラバス・教員情報など）はプライバシー上の理由からリポジトリに含まれていません。

---

## 実装機能

| 機能 | 概要 |
| --- | --- |
| 認証・オンボーディング | Google OAuth ログイン、学年・クラス設定、アプリ内ブラウザ検出 |
| ダッシュボード | 次のバス・天気・直近行事・ストレージ使用量ウィジェット、ニュースティッカー |
| Todo 管理 | ネスト構造のサブタスク、完了カスケード、Supabase クラウド同期 |
| バス時刻表 | 秒単位カウントダウン、路線別表示、寮生向け優先路線自動選択 |
| 行事予定表 | 学期別・月別カレンダー、行事詳細ダイアログ |
| メモ帳 | Markdown プレビュー、自動保存、クラウド同期 |
| ツール | 教員検索、教室検索、Google フォームアカウント切替 |
| ガイド | 学校手続き・制度情報の横断検索 |
| 設定 | テーマ・フォント切替、19 言語対応（即時切替） |

---

## 技術スタック

| レイヤー | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Shadcn/UI |
| 認証 | NextAuth + Google OAuth |
| データベース | Supabase (PostgreSQL) |
| アニメーション | Framer Motion, Lottie |
| PWA | Web App Manifest |

---

## セットアップ

```bash
npm install
```

プロジェクトルートに `.env.local` を作成し、以下の環境変数を設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=
GOOGLE_ID=
GOOGLE_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

```bash
npm run dev   # 開発サーバー起動 → http://localhost:3000
npm run build # 本番ビルド
```

---

## Contributors

- [@riyoway](https://github.com/riyoway)
- [@kamezawa](https://github.com/kamezawa)
- [@koseiokuda](https://github.com/koseiokuda)
- [@takutaku6514](https://github.com/takutaku6514)

---

## ライセンス

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.
