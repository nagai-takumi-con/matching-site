# マッチングサイト

Next.js、TypeScript、Prismaを使用したモダンなマッチングサイトです。

## 機能

- ユーザー登録・ログイン
- プロフィール編集
- ユーザー検索
- いいね機能
- メッセージング機能
- リアルタイムチャット

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React, TypeScript
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite (Prisma ORM)
- **認証**: JWT

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd matching_site
```

2. 依存関係をインストール
```bash
npm install
```

3. データベースをセットアップ
```bash
npx prisma generate
npx prisma db push
```

4. 開発サーバーを起動
```bash
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   ├── dashboard/      # ダッシュボードページ
│   ├── login/          # ログインページ
│   └── register/       # 登録ページ
├── components/         # Reactコンポーネント
└── lib/               # ユーティリティ関数
```

## 環境変数

`.env`ファイルを作成して以下の環境変数を設定してください：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

## デプロイ

このプロジェクトはVercelに簡単にデプロイできます：

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ

## ライセンス

MIT License
