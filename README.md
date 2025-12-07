# S-Link

学校生活を、より便利で整理されたものにするためのモダンな PWA スタイルの Web アプリケーションです。

S-Link は、時間割・課題・交通・天気など、学生が日々確認する情報を 1 つの Web アプリに集約し、スマートフォンでも使いやすい体験を提供することを目指しています。

> [!NOTE]
> **アイコンクレジット**: アプリアイコンは Gemini Nanobanana によって生成された画像を、画像編集ソフトで加工したものです。

---

## 概要

> [!IMPORTANT]
> S-Link は「学校生活の情報がバラバラで分かりづらい」という問題を解消し、**今知りたい情報にすぐたどり着ける 1 つの画面** を提供することを目的とした Web アプリです。

S-Link のハイレベルな目標:

- **情報の一元化** : 時間割・学校行事・課題などを 1 つの場所に集約
- **課題と期限の見える化** : 一覧と（将来的な）通知で締切を意識しやすく
- **通学・校内移動のサポート** : バス時刻や天気、教室場所の情報を提供
- **スマホでの快適な利用** : PWA 対応によるモバイル最適化

より詳細な要件は、`docs/specs/RDD.md` にある要件定義書 (Requirements Definition Document; RDD) を参照してください。

---

## 機能

> [!NOTE]
> 現時点では「認証・オンボーディング・ダッシュボードの土台」が中心です。以下には、**実装済み/開発中** と **RDD 上で定義された計画中の機能** を分けて記載します。

### 現在実装済み / 開発中

- **認証まわり & オンボーディング**
  - NextAuth を利用したログイン
  - Supabase を利用した初期プロフィール設定（例: `grade` など）
- **ダッシュボードの土台**
  - 認証済みユーザーのみアクセスできるホーム画面
  - 学生向けウィジェットやツールを配置するためのプレースホルダー

### RDD に基づく計画中の機能（一部抜粋）

| カテゴリ | 例 | 概要 |
| --- | --- | --- |
| 時間割・シラバス | 時間割、学校行事、シラバス表示 | 日々の予定を一目で確認 |
| 課題管理 | 課題一覧、期限管理、通知 | 締切忘れを防ぎ、タスクを整理 |
| 交通・天気 | バス時刻表、混雑度、天気情報 | 通学計画を立てやすくする |
| キャンパス支援 | 教室場所表示、校内マップ | 校内移動のストレスを軽減 |
| 外部連携 | Discord / LINE 連携 | 通知・コミュニケーションの強化 |
| 成績シミュレーション | 成績シミュレーション機能 | 教員入力を元に成績をシミュレート |

機能要件・非機能要件の完全な一覧は、RDD を参照してください。

---

## 技術スタック

> [!TIP]
> 技術構成の詳細は `package.json` に記載されています。ここでは主要なスタックのみを表形式でまとめています。

| レイヤー | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 |
| 言語 | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI ベースのコンポーネント, カスタム UI コンポーネント |
| 認証 | NextAuth |
| データベース / Backend | Supabase (PostgreSQL) |
| PWA | `@ducanh2912/next-pwa` |

---

## はじめかた (Getting Started)

> [!WARNING]
> 開発用の環境変数 (`.env.local`) が設定されていない場合、認証や Supabase 連携が正常に動作しません。必ず先に環境変数を用意してください。

### 1. 前提条件

- Node.js **18.17+** （Node 20+ 推奨）
- npm（または互換のパッケージマネージャ）

### 2. セットアップ手順チェックリスト

- [ ] リポジトリを clone する
- [ ] プロジェクトルートで依存パッケージをインストールする
- [ ] `.env.local` を作成し、必要な環境変数を設定する
- [ ] 開発サーバーを起動して動作を確認する

#### 依存パッケージのインストール

```bash
npm install
```

#### 開発サーバーの起動

```bash
npm run dev
```

Next.js の開発モードでアプリが起動します。  
デフォルトでは `http://localhost:3000` でアクセスできます。

#### ビルド & 本番起動

```bash
# ビルド
npm run build

# 本番モードで起動
npm run start
```

#### Lint 実行

```bash
npm run lint
```

---

## 環境変数

> [!IMPORTANT]
> 機密情報は必ずバージョン管理から除外してください。`.env*` ファイルをコミットしないよう注意してください。

プロジェクトルートに `.env.local` ファイルを作成し、必要な値を設定してください。

少なくとも、コードベースでは以下の環境変数を利用しています:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```

NextAuth や外部連携（Google, Discord など）を利用する場合は、追加のシークレットが必要になります。  
利用するプロバイダや NextAuth の設定に応じて `.env.local` に追記してください。

---

## プロジェクト構成（抜粋）

> [!NOTE]
> 実際の構成は今後の開発で変わる可能性があります。ここでは主要ディレクトリのみを抜粋しています。

```text
app/
  page.tsx         # 認証済みユーザー向けのホーム / ウェルカムページ
  login/           # ログインページ
  register/        # 初期プロフィール設定 (オンボーディング)
  dashboard/       # （計画中）メインダッシュボード
  privacy/         # プライバシーポリシーページ
  term/            # 利用規約ページ

components/
  ui/              # ボタン・カードなどの再利用可能な UI コンポーネント

lib/
  auth.ts          # NextAuth の設定
  utils.ts         # 共通ユーティリティ

public/
  icons/           # アプリアイコン (PWA 用アイコンやロゴ等)
  animations/      # Lottie アニメーション

docs/
  specs/
    RDD.md         # 要件定義書 (Requirements Definition Document)
  notes/
    memo.md        # 実装ノート・ロジック関連メモ
  design/          # デザイン関連の資料・アセット
  legal/           # 利用規約・プライバシーポリシーなどのリーガル文書

sql/
  20251207_next_auth_init.sql  # NextAuth 関連スキーマ用 SQL
```

---

## ドキュメント

> [!TIP]
> 仕様や方針を変更した場合は、必ず `docs/` 配下の関連ドキュメントも更新してください。

主要なドキュメントは `docs/` ディレクトリ以下に配置されています。

- **要件定義書 (Requirements Definition Document; RDD)**  
  `docs/specs/RDD.md`

- **実装ノート / メモ**  
  `docs/notes/memo.md`

- **リーガル / ポリシー類**  
  `docs/legal/` – プライバシーポリシーや利用規約など

新しいドキュメントを追加する場合は、`docs/` 以下に分かりやすい名前と構造で配置してください。  
（本文は原則として英語で記述することを推奨しています。）

---

## コントリビュートガイドライン

> [!NOTE]
> コントリビュートのルールは、チームメンバーが増えたタイミングなどで随時アップデートして構いません。README のこのセクションを真実のソースとして保つようにしてください。

このプロジェクトは複数人での開発を前提としています。コントリビュートの際は、次のルールを目安にしてください:

1. **競合を避ける**  
   - 作業前に最新の `main` ブランチを pull してください。  
   - 可能であれば、feature ブランチを切って Pull Request ベースで開発します。

2. **分かりやすいコミットメッセージを書く**  
   - 「何を変更したか」が一目で分かるよう、簡潔に書いてください。  
   - 可能なら `feat: add dashboard skeleton` のような Conventional Commits 形式を利用してください。

3. **コミット前にコードを整える**  
   - 使っていないコードや一時的なログは削除してください。  
   - 余裕があれば Lint を実行し、警告をできる範囲で解消してください。

4. **アイデアやバグは Issue へ**  
   - 新機能のアイデアや改善提案、バグ報告は GitHub Issues に起票してください。

5. **ドキュメントは原則英語で**  
   - 新しく追加するドキュメントは、他の開発者や将来のコントリビューターが読めるよう、英語での記述を推奨します。

コミット・リリース・Issue などのアクティビティは、開発メンバーが追いやすいよう Discord チャンネルへミラーされる場合があります。

---

## ライセンス

This project is licensed under the terms specified in the `LICENSE` file.

ハイレベルな目標:

- **情報の一元化** : 時間割・学校行事・課題などを 1 つの場所に集約
- **課題と期限の見える化** : 一覧と（将来的な）通知で締切を意識しやすく
- **通学・校内移動のサポート** : バス時刻や天気、教室場所の情報を提供
- **スマホでの快適な利用** : PWA 対応によるモバイル最適化

より詳細な要件は、`docs/specs/RDD.md` にある要件定義書 (Requirements Definition Document; RDD) を参照してください。

---

## 機能

ここでは、**現在実装済み / 開発中の機能** と、**RDD 上で定義されている計画中の機能** を分けて記載します。

### 現在実装済み / 開発中

- **認証まわり & オンボーディング**
  - NextAuth を利用したログイン
  - Supabase を利用した初期プロフィール設定（例: `grade` など）
- **基本的なダッシュボードの土台**
  - 認証済みユーザーのみアクセスできるホーム画面
  - 学生向けウィジェットやツールを配置するためのプレースホルダー

### RDD に基づく計画中の機能

要件定義書 (RDD) には、将来的に実現したい多くの機能が定義されています。代表的なものは次の通りです:

- **時間割・シラバス関連**
  - 時間割・学校行事・シラバス情報の表示
- **課題・宿題管理**
  - 課題一覧と期限管理
  - 締切に関する通知機能
- **交通・天気情報**
  - バス時刻表と混雑度の表示
  - 外部 API を利用した天気情報の表示
- **キャンパスライフ支援**
  - 教室の場所表示や校内マップとの連携
- **外部サービス連携**
  - Discord / LINE などとの連携による通知・コミュニケーション
- **成績シミュレーション**
  - 教員入力を元にした成績シミュレーション機能

機能要件・非機能要件の完全な一覧は、RDD を参照してください。

---

## 技術スタック

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, Radix UI ベースのコンポーネント、カスタム UI コンポーネント
- **Auth**: NextAuth
- **Database / Backend**: Supabase (PostgreSQL)
- **PWA**: `@ducanh2912/next-pwa`

依存パッケージの詳細は `package.json` を参照してください。

---

## はじめかた (Getting Started)

### 前提条件

- Node.js **18.17+** （Node 20+ 推奨）
- npm（または互換のパッケージマネージャ）

### 依存パッケージのインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

Next.js の開発モードでアプリが起動します。  
デフォルトでは `http://localhost:3000` でアクセスできます。

### ビルド & 本番起動

```bash
# ビルド
npm run build

# 本番モードで起動
npm run start
```

### Lint 実行

```bash
npm run lint
```

---

## 環境変数

プロジェクトルートに `.env.local` ファイルを作成し、必要な値を設定してください。

少なくとも、コードベースでは以下の環境変数を利用しています:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```

NextAuth や外部連携（Google, Discord など）を利用する場合は、追加のシークレットが必要になります。  
利用するプロバイダや NextAuth の設定に応じて `.env.local` に追記してください。

> 機密情報は必ずバージョン管理から除外してください。`.env*` ファイルをコミットしないよう注意してください。

---

## プロジェクト構成（抜粋）

リポジトリの構成はおおよそ次のようになっています:

```text
app/
  page.tsx         # 認証済みユーザー向けのホーム / ウェルカムページ
  login/           # ログインページ
  register/        # 初期プロフィール設定 (オンボーディング)
  dashboard/       # （計画中）メインダッシュボード
  privacy/         # プライバシーポリシーページ
  term/            # 利用規約ページ

components/
  ui/              # ボタン・カードなどの再利用可能な UI コンポーネント

lib/
  auth.ts          # NextAuth の設定
  utils.ts         # 共通ユーティリティ

public/
  icons/           # アプリアイコン (PWA 用アイコンやロゴ等)
  animations/      # Lottie アニメーション

docs/
  specs/
    RDD.md         # 要件定義書 (Requirements Definition Document)
  notes/
    memo.md        # 実装ノート・ロジック関連メモ
  design/          # デザイン関連の資料・アセット
  legal/           # 利用規約・プライバシーポリシーなどのリーガル文書

sql/
  20251207_next_auth_init.sql  # NextAuth 関連スキーマ用 SQL
```

---

## ドキュメント

主要なドキュメントは `docs/` ディレクトリ以下に配置されています。

- **要件定義書 (Requirements Definition Document; RDD)**  
  `docs/specs/RDD.md`

- **実装ノート / メモ**  
  `docs/notes/memo.md`

- **リーガル / ポリシー類**  
  `docs/legal/` – プライバシーポリシーや利用規約など

新しいドキュメントを追加する場合は、`docs/` 以下に分かりやすい名前と構造で配置してください。  
（本文は原則として英語で記述することを推奨しています。）

---

## コントリビュートガイドライン

このプロジェクトは複数人での開発を前提としています。コントリビュートの際は、次のルールを目安にしてください:

1. **競合を避ける**  
   - 作業前に最新の `main` ブランチを pull してください。  
   - 可能であれば、feature ブランチを切って Pull Request ベースで開発します。

2. **分かりやすいコミットメッセージを書く**  
   - 「何を変更したか」が一目で分かるよう、簡潔に書いてください。  
   - 可能なら `feat: add dashboard skeleton` のような Conventional Commits 形式を利用してください。

3. **コミット前にコードを整える**  
   - 使っていないコードや一時的なログは削除してください。  
   - 余裕があれば Lint を実行し、警告をできる範囲で解消してください。

4. **アイデアやバグは Issue へ**  
   - 新機能のアイデアや改善提案、バグ報告は GitHub Issues に起票してください。

5. **ドキュメントは原則英語で**  
   - 新しく追加するドキュメントは、他の開発者や将来のコントリビューターが読めるよう、英語での記述を推奨します。

コミット・リリース・Issue などのアクティビティは、開発メンバーが追いやすいよう Discord チャンネルへミラーされる場合があります。

---

## ライセンス

ライセンスの条件については、リポジトリ内の `LICENSE` ファイルを参照してください。

High-level goals:

- **Centralized information** for timetable, school events, and tasks
- **Better task and deadline awareness** with clear views and (future) notifications
- **Support for commuting and campus life**, such as bus timetables and weather
- **Smooth experience on smartphones** via PWA support

For more detailed requirements, see the Requirements Definition Document (RDD) in the docs.

---

## Features

This section distinguishes between **currently implemented** and **planned / defined in RDD** features.

### Current / In-progress

- **Authentication & onboarding**
  - Login with NextAuth
  - Initial profile setup (e.g. `grade`) using Supabase
- **Basic dashboard shell**
  - Auth-protected home page
  - Placeholder for student-facing widgets and tools

### Planned (from RDD)

The RDD describes many target features. Some examples:

- **Schedule & syllabus**
  - Display of timetable, school events, and syllabus information
- **Tasks & assignments**
  - Assignment list, deadline management, and notifications
- **Transportation & weather**
  - Bus timetable and congestion info
  - Weather information via external API
- **Campus support**
  - Classroom location and campus map integration
- **External integrations**
  - Discord / LINE for notifications and communication
- **Performance simulation**
  - Grade simulation feature based on teacher input

For the full list of functional / non-functional requirements, please check the RDD.

---

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, Radix UI primitives, custom components
- **Auth**: NextAuth
- **Database / Backend**: Supabase (PostgreSQL)
- **PWA**: `@ducanh2912/next-pwa`

See `package.json` for the full list of dependencies.

---

## Getting Started

### Prerequisites

- Node.js **18.17+** (Node 20+ recommended)
- npm (or compatible package manager)

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

The app will start in development mode.  
By default, Next.js runs on `http://localhost:3000`.

### Build & production start

```bash
# Build
npm run build

# Start in production mode
npm run start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Create a `.env.local` file in the project root and configure the necessary values.

At minimum, the following are used in the codebase:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```

For NextAuth and any external integrations (Google, Discord, etc.), additional secrets will be required.  
Configure them according to your chosen providers and NextAuth setup.

> Keep all secrets out of version control. Never commit `.env*` files.

---

## Project Structure (excerpt)

The repository is organized roughly as follows:

```text
app/
  page.tsx         # Auth-protected home / welcome page
  login/           # Login page
  register/        # Onboarding / initial profile setup
  dashboard/       # (Planned) main dashboard area
  privacy/         # Privacy policy page
  term/            # Terms of service page

components/
  ui/              # Reusable UI components (buttons, cards, etc.)

lib/
  auth.ts          # NextAuth configuration
  utils.ts         # Shared utilities

public/
  icons/           # App icons (PWA icons, logo, etc.)
  animations/      # Lottie animations

docs/
  specs/
    RDD.md         # Requirements Definition Document
  notes/
    memo.md        # Implementation notes / logic-related memos
  design/          # Design-related assets and notes
  legal/           # Legal documents (terms, privacy, etc.)

sql/
  20251207_next_auth_init.sql  # SQL for NextAuth-related schema
```

---

## Documentation

Core project documentation lives under the `docs/` directory.

- **Requirements Definition Document (RDD)**  
  `docs/specs/RDD.md`

- **Implementation notes / memos**  
  `docs/notes/memo.md`

- **Legal / policies**  
  `docs/legal/` – privacy policy, terms of service, and related documents

If you add new documents, please place them under `docs/` with clear naming and structure.

---

## Contribution Guidelines

This project is developed collaboratively. Please follow these simple rules when contributing:

1. **Avoid merge conflicts**  
   - Pull the latest `main` branch before starting work.  
   - Use feature branches and open pull requests where possible.

2. **Write clear commit messages**  
   - Describe *what* you changed in a concise way.  
   - Use a conventional format if possible (e.g. `feat: add dashboard skeleton`).

3. **Keep the code tidy before committing**  
   - Remove unused code and temporary logs.  
   - Run lint and fix warnings when reasonable.

4. **Use Issues for ideas and bugs**  
   - New feature ideas and improvement requests should be posted as GitHub Issues.

5. **Docs in English**  
   - New documentation should be written in English for consistency.

Activity such as commits, releases, and issues may be mirrored to a Discord channel for easier tracking.

---

## License

This project is licensed under the terms specified in the `LICENSE` file.