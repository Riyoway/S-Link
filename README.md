# S-Link

アイコンはGemini Nanobananaによって生成されたものを画像編集ソフトを用いて編集したものです

**Database**: supabase
**Framework**: Next.js


> [!TIP]
> - アイデアはIssuesに投稿してください
> - Commit/Release/issuesなどのアクティビティは[Discordのgithub-log](https://ptb.discord.com/channels/1364078863386279956/1391977491899617422)で確認できるようにしました

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


## Authentication Flow
```mermaid
graph TD
    A[Access Web App] --> B[Login or Signup with Google Authentication]
    B --> C{Is Google account domain ktc.ac.jp?}
    C -- No --> D[Login denied]
    C -- Yes --> E[Proceed normally]
    
    E --> F[Infer grade from the name part of email address]
    F --> G{Email name part is?}
    G -- g07NNN --> H[Grade 1]
    G -- g06NNN --> I[Grade 2]
    G -- g05NNN --> J[Grade 3]
    G -- g04NNN --> K[Grade 4]
    G -- Exception --> L[Grade 5]
    
    H --> M[Display account creation screen]
    I --> M
    J --> M
    K --> M
    L --> M

    M --> N[Automatically fill in Name (read-only)]
    M --> O[Automatically fill in Inferred Grade (1~5)]
    M --> P{Is Department selection available?}
    P -- Grade 1~2 --> Q[Department selection disabled]
    P -- Grade 3~5 --> R[Department selection enabled: Architecture/Civil, Electrical/Electronics, Mechanical, Information]
```
