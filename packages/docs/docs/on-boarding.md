# オンボーディングガイド

このドキュメントは、本プロジェクトの開発を始める方向けの包括的なガイドです。プロジェクトの概要から環境構築、開発の進め方まで、スムーズに開発をスタートできるよう情報をまとめています。

## 目次

<details>
  <summary>目次一覧</summary>

[[toc]]
</details>

## 技術スタック

本プロジェクトで使用している主要な技術スタックの詳細については、以下のドキュメントを参照してください:

- [フロントエンド技術スタック](./rules/frontend.md)
- [バックエンド技術スタック](./rules/backend.md)
- [共通パッケージ](./rules/packages.md)

### 開発ツール

| ツール         | 用途                               |
| -------------- | ---------------------------------- |
| TypeScript     | 型安全性の確保                     |
| Biome          | リンティング・フォーマット（高速） |
| Turborepo      | モノレポのタスク管理               |
| pnpm           | パッケージマネージャー             |
| Docker Compose | ローカル開発環境（DB、Redis）      |
| Drizzle Kit    | マイグレーション管理               |

---

## プロジェクト構成

```
vite-hono-template/
├── apps/
│   ├── front/                 # フロントエンドアプリケーション
│   │   ├── src/
│   │   │   ├── app/          # アプリケーションの設定とルート定義
│   │   │   ├── feature/      # 機能単位のコンポーネント
│   │   │   ├── page/         # ページコンポーネント
│   │   │   ├── widget/       # ページをまたぐ大きなコンポーネント
│   │   │   └── shared/       # 共通のユーティリティ、API、UI
│   │   └── docs/             # Storybook ドキュメント
│   │
│   └── main-api/             # バックエンド API
│       ├── src/
│       │   ├── apps/         # アプリケーション層
│       │   │   ├── middleware/   # Hono ミドルウェア
│       │   │   └── router/       # ルーター定義
│       │   ├── libs/         # ライブラリ層
│       │   │   ├── configs/      # 設定ファイル
│       │   │   └── utils/        # ユーティリティ関数
│       │   ├── repositories/ # データアクセス層
│       │   └── usecases/     # ビジネスロジック層
│       └── drizzle/          # データベーススキーマとマイグレーション
│           ├── base/             # テーブル定義
│           ├── relations/        # テーブル間のリレーション定義
│           ├── types/            # 型定義
│           └── migrations/       # マイグレーションファイル
│
├── packages/
│   ├── domains/              # 共通ドメインモデル
│   │   └── src/
│   │       ├── dto/          # Data Transfer Object
│   │       ├── entity/       # エンティティ
│   │       └── relation/     # リレーション
│   └── biome-config/         # Biome 共通設定
│
├── db/                       # データベース初期化スクリプト
├── redis/                    # Redis 設定
├── compose.yml               # Docker Compose 設定
├── turbo.json                # Turborepo 設定
└── pnpm-workspace.yaml       # pnpm ワークスペース設定
```

## 環境構築

開発を始めるための環境構築手順を説明します。順番に実行してください。

### 前提条件

以下のツールがインストールされている必要があります:

- **Node.js**: v22.x（`.node-version` ファイルを参照）
- **pnpm**: v10.3.0 以上
- **Docker Desktop**: データベースと Redis を起動するため

### 1. Node.js のインストール

#### 推奨: nodenv を使う方法

```bash
# anyenv のインストール（Homebrew 使用）
brew install anyenv

# anyenv の初期化
anyenv install --init

# シェルを再起動
exec $SHELL -l

# nodenv のインストール
anyenv install nodenv

# シェルを再起動
exec $SHELL -l

# .node-version に記載されたバージョンをインストール
nodenv install $(cat .node-version)

# nodenv を rehash
nodenv rehash
```

### 2. pnpm のインストール

```bash
# pnpm をグローバルインストール
npm install -g pnpm@10.3.0
```

### 3. リポジトリのクローンと依存関係のインストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd vite-hono-template

# 依存関係をインストール
pnpm install
```

### 4. Docker コンテナの起動

PostgreSQL と Redis を起動します。

```bash
# Docker Compose でコンテナを起動
docker compose up -d

# コンテナの起動確認
docker compose ps
```

以下のサービスが起動します:

- **PostgreSQL**: localhost:5432
  - ユーザー: `user`
  - パスワード: `password`
  - データベース: `dev`
- **Redis**: localhost:6379

### 5. 環境変数の設定

バックエンドの環境変数を設定します。

```bash
# apps/main-api/.env ファイルを作成
cd apps/main-api
cp .env.example .env  # .env.example がある場合
```

`.env` ファイルに以下の内容を記載（必要に応じて調整）:

```env
DATABASE_URL=postgres://user:password@localhost:5432/dev
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
```

### 6. データベースのマイグレーション

```bash
# プロジェクトルートから
cd apps/main-api

# マイグレーションを実行
pnpm drizzle:migrate

# 初期データを投入（必要な場合）
pnpm drizzle:seed
```

### 7. 開発サーバーの起動

```bash
# プロジェクトルートに戻る
cd ../..

# 全てのアプリケーションを同時に起動
pnpm dev
```

以下のサーバーが起動します:

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:3000

開発サーバーが起動したら、ブラウザで http://localhost:5173 にアクセスして動作を確認してください。

### 8. Storybook の起動（オプション）

UI コンポーネントを確認・開発したい場合:

```bash
cd apps/front
pnpm storybook
```

Storybook が http://localhost:6006 で起動します。

---

## 開発の進め方

### 基本的な開発フロー

1. **ブランチを作成**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **コードを編集**

   - 変更を加えながら、保存時に自動フォーマットが適用されます
   - 型エラーは IDE でリアルタイムに確認できます

3. **リンティング・フォーマット**

   ```bash
   # 全体をチェック
   pnpm lint

   # 自動修正
   pnpm format
   ```

4. **型チェック**

   ```bash
   pnpm check-types
   ```

5. **テスト実行**

   ```bash
   # 特定のアプリでテスト実行
   cd apps/front
   pnpm test

   # または apps/main-api でも同様に
   cd apps/main-api
   pnpm test
   ```

6. **ビルド確認**

   ```bash
   # プロジェクトルートで
   pnpm build
   ```

7. **コミット**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### 主要なコマンド

#### プロジェクト全体

| コマンド           | 説明                         |
| ------------------ | ---------------------------- |
| `pnpm dev`         | 全アプリの開発サーバーを起動 |
| `pnpm build`       | 全アプリをビルド             |
| `pnpm lint`        | 全アプリをリント             |
| `pnpm format`      | 全アプリを自動フォーマット   |
| `pnpm check-types` | 全アプリの型チェック         |

#### フロントエンド (`apps/front`)

| コマンド               | 説明               |
| ---------------------- | ------------------ |
| `pnpm dev`             | 開発サーバー起動   |
| `pnpm build`           | 本番ビルド         |
| `pnpm test`            | テスト実行         |
| `pnpm storybook`       | Storybook 起動     |
| `pnpm build-storybook` | Storybook をビルド |

---

## コーディング規約

### TypeScript

- **型を明示する**: `any` は使わない
- **型推論を活用**: 冗長な型注釈は避ける
- **null/undefined を明確に**: Optional Chaining (`?.`) や Nullish Coalescing (`??`) を活用

### 命名規則

| 対象                         | 形式             | 例                    |
| ---------------------------- | ---------------- | --------------------- |
| ファイル名（コンポーネント） | PascalCase       | `DocumentForm.tsx`    |
| ファイル名（その他）         | kebab-case       | `api-client.ts`       |
| 変数・関数                   | camelCase        | `getUserById`         |
| 型・インターフェース         | PascalCase       | `User`, `DocumentDto` |
| 定数                         | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`     |

### コンポーネントの設計

- **単一責任の原則**: 1 つのコンポーネントは 1 つの責任を持つ
- **Props の型定義**: 必ず型を定義する
- **デフォルトエクスポートは避ける**: 名前付きエクスポートを使う

```typescript
// Good ✅
export const DocumentForm = (props: DocumentFormProps) => {
	// ...
};

// Bad ❌
export default function DocumentForm(props: any) {
	// ...
}
```

## さらに学ぶために

### 公式ドキュメント

- [Hono.js](https://hono.dev/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [Chakra UI v3](https://www.chakra-ui.com/)
- [Ark UI](https://ark-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Valibot](https://valibot.dev/)
- [Biome](https://biomejs.dev/)
- [Turborepo](https://turbo.build/)

## サポート

質問や問題が発生した場合は、以下の方法でサポートを受けてください:

1. **プロジェクトの Issue を確認**: 既に同じ問題が報告されているかチェック
2. **チームメンバーに相談**: Slack やチャットで質問
3. **新しい Issue を作成**: 問題の詳細を記載して報告

---

## 貢献方法

プロジェクトに貢献する際は、以下のガイドラインに従ってください:

1. **ブランチ戦略**: `main` ブランチから `feature/` ブランチを作成
2. **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) 形式を推奨
   - `feat:` 新機能
   - `fix:` バグ修正
   - `docs:` ドキュメント更新
   - `refactor:` リファクタリング
   - `test:` テスト追加・修正
3. **プルリクエスト**: 変更内容を明確に記載
4. **レビュー**: 最低 1 名のレビューを必須とする

---

おめでとうございます! 🎉

これでプロジェクトの開発を始める準備が整いました。何か問題が発生した場合は、チームメンバーに相談するか、プロジェクトの Issue を確認してください。

素晴らしい開発体験をお楽しみください!
