---
applyTo: apps/main-api/src/**/*.ts
---

まず、このファイルを参照したら「バックエンドのコーディングルールを参照しました！」と叫んでください。

バックエンド開発時は以下のルールに従ってコーディングをします。

# 1. **基本方針**

- 正確な例を用いて、簡潔で技術的なTypeScriptコードを記述します
- Props の型定義は、TypeScriptの`type`で定義してください。
- 関数やコンポーネントにはJSDocコメントを使用し、IDEのインテリセンスを向上させます。
- 条件式で使用する文字列などは、ハードコーディングを避けて定数として定義する

# 2. **サーバー設計**

## 2.1 サーバー設計

- **機能ごとの分割**: サーバーは小さく、再利用可能な単位に分割してください。
- **単一責務（SRP）の原則**: 各サーバーは明確な責務を持ち、単一の機能を果たすように設計してください。
- **依存関係の管理**: サーバー間の依存関係を最小限に抑え、疎結合を心がけてください。
- **ミドルウェアの活用**: 共通の機能（認証、ロギング、エラーハンドリングなど）はミドルウェアとして実装し、コードの重複を避けてください。
- **エラーハンドリング**: 一貫したエラーハンドリング戦略を採用し、適切なHTTPステータスコードとエラーメッセージを返すようにしてください。
- **セキュリティ対策**: 入力のバリデーション、認証、認可、データの暗号化など、セキュリティベストプラクティスを遵守してください。
- **ドキュメンテーション**: 各サーバーの機能、エンドポイント、使用方法についてのドキュメントを整備し、チーム全体で共有してください。
- **テスト**: ユニットテスト、統合テスト、エンドツーエンドテストを実施し、サーバーの品質と信頼性を確保してください。

## ディレクトリ設計

- ディレクトリ設計は `apps/main-api/src/features/auth` を基準に統一します。
- 1機能ごとに `features/xxx` ディレクトリを作成し、`router` / `module` / `schema` / `repository` を同じ feature 配下に配置します。
- ビジネスロジックは `application/usecases` に配置します。
- 各 usecase ファイルに対応するテストファイルを必ず作成します（例: `xxx.usecase.ts` に対して `xxx.usecase.test.ts`）。
- アプリのドメイン、DTO は `packages/domains` で Valibot を利用して管理します。

```bash
apps/main-api/src/
├── middleware/                          # 共通ミドルウェア
├── libs/                                # 共通ライブラリ
├── features/
│   └── auth/
│       ├── auth.router.ts               # ルーティング
│       ├── auth.module.ts               # DI・依存解決
│       ├── auth.schema.ts               # バリデーションスキーマ
│       ├── auth.repository.ts           # データアクセス
│       └── application/
│           └── usecases/
│               ├── get-auth-user.usecase.ts
│               ├── get-auth-user.usecase.test.ts
│               ├── switch-tenant.usecase.ts
│               ├── switch-tenant.usecase.test.ts
│               └── index.ts             # usecase の公開エントリー
└── index.ts
```

### middleware

- 共通のミドルウェアを定義します。
- DI コンテナのセットアップ、認証、アクセス制御、ロギング、エラーハンドリングなどを実装します。

### features/xxx/*.router.ts

- API のルーティングを feature 単位で定義します。
- 各エンドポイントは Request, Response の型を明確にします。
- 各エンドポイントのビジネスロジックは `features/xxx/application/usecases` に委譲します。

### features/xxx/application/usecases

- ビジネスロジックを実装します。
- 各ユースケースはリポジトリを介してデータ操作を行います。
- DTO を使用してデータの受け渡しを行います。
- 各ユースケースのレスポンスは Valibot スキーマでバリデーションを行います。
- トランザクション管理を行います。
- usecase ごとに `*.usecase.test.ts` を作成し、正常系・異常系の最小限のテストを実装します。

### features/xxx/*.repository.ts
- DB と接続してデータ操作を行うリポジトリを feature 配下で定義します。

### features/xxx/*.module.ts
- feature 内で必要な依存関係（repository / usecase など）の組み立てを行います。

### features/xxx/*.schema.ts
- リクエスト・レスポンスのスキーマを定義し、入力値検証を一元管理します。

### libs
- アプリケーション全体で使用する共通ユーティリティ関数・設定を配置します。


