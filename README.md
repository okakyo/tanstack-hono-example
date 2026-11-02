# Hono x React (Vite) Template

このリポジトリは、Hono を使った API と React + Vite のフロントエンドを組み合わせたモノレポ型のテンプレートです。
チーム開発を前提に、環境構築、コーディング規約、DB/認証/開発フロー、運用ルールを一つのプロジェクトとして整理し、開発を進めやすい形にしています。

## 1. プロジェクトの概要

本テンプレートは、以下のような構成で開発を行うことを想定しています。

- フロントエンド: React + Vite + TanStack Router + Chakra UI
- バックエンド: Hono + TypeScript
- データベース: PostgreSQL + Drizzle ORM
- キャッシュ: Redis
- 共有/運用: pnpm + Turbo Repo + Docker Compose

この構成により、機能開発・API 開発・DB 設計・UI 開発を分担しながら進めやすくなっています。

## 2. リポジトリ構成

```text
vite-hono-template-v2/
├── apps/
│   ├── front/                 # React フロントエンド
│   │   ├── src/
│   │   ├── docs/
│   │   └── package.json
│   └── main-api/              # Hono API
│       ├── src/
│       ├── drizzle/
│       └── package.json
├── packages/
│   └── docs/                  # チーム向けドキュメント
├── db/
├── redis/
├── compose.yml                # PostgreSQL / Redis / SeaweedFS
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── .node-version
├── README.md
└── .github/
```

### 主要な役割

- `apps/front`: 画面開発とユーザー体験の実装
- `apps/main-api`: API、ドメインロジック、DB 連携、認証/認可周り
- `drizzle`: スキーマ定義・マイグレーション・初期データの管理
- `packages/docs`: 設計メモ、オンボーディング、運用ルールの共有

## 3. 開発環境

### 必須ツール

- Node.js: 23.0.0 (`.node-version` を参照)
- pnpm: 10.3.0 以上
- Docker Desktop

### ローカルサービス

`compose.yml` により、以下のサービスが起動します。

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- SeaweedFS: `localhost:8333` などの S3 相当 API


## 4. セットアップ手順

### 初期構築

- Supabase でプロジェクト構築
  - Supabase Auth を利用して認証基盤を構築しています。
  - 構築後、apps/front, apps/main-api ディレクトリのそれぞれの `.env` ファイルに以下の変数を設定します。
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_PUBLISHABLE_KEY`
    - `SUPABASE_URL`
  - Supabase Auth 設定後、初期アカウントの登録を行ってください。
    - アカウント発行後、出力される User ID を控えてください

- `apps/main-api/drizzle/seeds/accountList.ts` にユーザー情報を追加してください。
  - こちらに控えておいたアカウントにテナントの管理者権限が登録されます。
  ```json
  {
    authUserId: 認証ユーザーID(UUID) // 控えておいた User ID を記載
    name: 名前
    email: メールアドレス
  }
  ``` 

### ローカル環境でのセットアップ

```bash
# 1. 依存関係をインストール
pnpm install

# 2. DB / Redis を起動
docker compose up -d

# 3. バックエンドのマイグレーションを実行
cd apps/main-api
pnpm drizzle:migrate

# 4. 必要に応じてseedデータを投入
pnpm drizzle:seed

# 5. プロジェクト全体を起動
cd ../..
pnpm dev
```

### よく使う起動コマンド

```bash
# フロントエンドのみ起動
cd apps/front
pnpm dev

# バックエンドのみ起動
cd apps/main-api
pnpm dev

# 画面開発用 Storybook を起動
cd apps/front
pnpm storybook
```

## 5. 開発の基本ルール

### 1) 機能単位で整理する

フロントエンドは Feature-Sliced Design を意識して、機能ごとに整理します。

- `feature/`: 機能ごとの実装
- `page/`: 画面単位
- `widget/`: 複数ページで再利用される大きなブロック
- `shared/`: 共通 UI / util / API

バックエンドも `feature` を中心に、責務ごとにモジュール分割し、`repositories` / `middlewares` / `libs` などを適切に使い分けます。

### 2) 型と品質を優先する

- TypeScript で型を明確にする
- `interface` / `type` を使って契約を固定する
- `any` は避け、必要な場合は型を明示する
- バリデーションは `valibot` を中心に扱う

### 3) API と UI の境界を明確にする

- フロントエンドは API 呼び出しを薄くする
- API 仕様と UI の責務を混在させない
- DTO / 返却値の形を明確にして、画面側の実装を簡潔にする

### 4) DB 変更は migration とセットで扱う

DB スキーマを変えたときは、Drizzle の migration を必ず同時に作成・確認してください。

```bash
cd apps/main-api
pnpm drizzle:generate
pnpm drizzle:migrate
```

migration 反映後、`apps/main-api` リポジトリ下で Drizzle のスキーマに反映します。

```bash
pnpm drizzle:introspect
```

Migration 変更がある場合は、PR で差分を確認し、データの破壊的変更がないかレビューします。



## 6. チーム開発の運用ルール

### ブランチ運用

おすすめの運用は次の通りです。

- `main`: 本番反映可能な状態を維持
- `feature/<name>`: 新機能開発
- `fix/<name>`: バグ修正
- `hotfix/<name>`: 緊急修正
- `refactor/<name>`: 構造整理

> 1 PR = 1 目的 で小さく保ち、レビューしやすい変更にします。

### コミットメッセージ

以下のような粒度でコミットを分けると、変更の意図が追いやすくなります。

```text
feat: ユーザー登録フォームを追加
fix: API のバリデーション不備を修正
refactor: ルーティング構造を整理
docs: 開発ルールを追記
test: 認証 middleware のテストを追加
chore: lint 設定と依存関係を更新
```

### PR ルール

- 変更理由と影響範囲を記載する
- UI 変更がある場合はスクリーンショットを添付する
- DB 変更がある場合はマイグレーション内容を明示する
- 変更後に最低限の確認を行う
  - `pnpm lint`
  - `pnpm check-types`
  - 対象テストの実行

## 7. 品質確認コマンド

```bash
# ルート
pnpm lint
pnpm build

# フロントエンド
cd apps/front
pnpm check-types
pnpm test
pnpm lint

# API
cd apps/main-api
pnpm check-types
pnpm test
pnpm lint
```

## 8. 開発時に意識するポイント

### 1) 変更の影響範囲を見失わない

小さな変更でも、API・DB・UI の連携がある場合は影響範囲を把握してから実装するようにします。

### 2) 仕様変更はドキュメントに残す

`docs/` や `packages/docs/` に設計意図や運用ルールを残し、実装だけでなく背景も共有することが重要です。

### 3) 共同作業ではレビューを大事にする

特に API 契約、DB スキーマ、認証、ルーティング周りは、他のメンバーに意図が伝わるよう丁寧に説明することが大切です。

### 4) 生成物と手作業を分ける

- migration 文件は生成とレビューをセットで行う
- 生成される型や artifact は更新の意図を確認する
- 手動編集した箇所と自動生成箇所を混在させない

## 9. 参考ドキュメント

- `apps/front/docs/1-setup.mdx`: 環境構築
- `apps/front/docs/3-coding-rule.mdx`: コーディングルール
- `apps/front/docs/4-team-rule.mdx`: チーム開発ルール
- `packages/docs/docs/on-boarding.md`: オンボーディングガイド
- `apps/main-api/docs/transaction-pattern.md`: トランザクションの考え方

## 10. まとめ

このテンプレートは、単なるサンプルではなく、実際のチーム開発で使いやすい前提を持つ構成です。
設計意図を共有し、ルールを守りながら進めることで、開発速度と品質の両立がしやすくなります。

プロジェクトに入ったら、まずはこの README と `docs/` 配下の資料を参照し、ローカル環境を整えたうえで小さな変更から着手してください。


