# S-Link
いつか書きます

> [!TIP]
> アイデアはIssuesに投稿してください
> Commit/Release/issuesなどのアクティビティは[Discord > github-log](https://ptb.discord.com/channels/1364078863386279956/1391977491899617422)で確認できます

> [!IMPORTANT]
> 1. レポジトリをぐちゃぐちゃにしないでください (AIが補助してくれた部分は理解できるように)
> 2. Commitメッセージは極力書いてほしいです (変更内容を簡潔に記述してください)
> 3. コードはできるだけ整理してからコミットしてください

## Docs
- [Next.js Default MD](docs/NEXT.md) - Next.jsの産物 (ゴミ)
- [Requirements Definition Document](docs/RDD.md) - 要件定義書
- [Memo](docs/Memo.md) - メモ (ロジック系メモ・実装ノート)
- Study Zone: 
  - [Next.js](docs/study/abt-nextjs.md) - Next.js学習記録 (自由に記録してください)
  - [Sample Codes](docs/study/sample-codes.md) - サンプルコード集
  - [Write MD](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) - Markdownの書き方を覚えてください

### Structure
- .github/workflows - GitHub Actionsワークフロー
- src/ - ソースコードディレクトリ
- public/ - 公開リソースディレクトリ
- tests/ - テストコードディレクトリ
- package.json - パッケージ定義ファイル
- tsconfig.json - TypeScriptコンパイラ設定ファイル
- .vscode/ - VS Code設定ディレクトリ
- .gitignore - Git無視ファイル
- .dockerignore - Docker無視ファイル
- Dockerfile - Dockerイメージ構築定義ファイル
- docker-compose.yml - Dockerコンテナ構成定義ファイル
- .env - 環境変数設定ファイル
- .github/ - GitHub関連設定ディレクトリ
- .husky/ - Gitフック設定ディレクトリ
- .lintstagedrc - Lintステージ設定ファイル
- .prettierrc - Prettier設定ファイル
- .eslintrc - ESLint設定ファイル
- .commitlintrc - CommitLint設定ファイル
- .stylelintrc - StyleLint設定ファイル