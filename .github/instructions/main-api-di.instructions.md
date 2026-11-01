---
description: "Use when designing the Main API dependency injection, Drizzle database wiring, feature modules, repositories, usecases, services, or tenant/RLS-aware transaction flow. Covers the module boundary, service composition, and DI safety rules for Hono API features."
applyTo: ["apps/main-api/src/**/*.ts", "apps/main-api/drizzle/**/*.ts"]
---

# Main API DI / Module Design Guidelines

## 1. 基本設計原則

- `app.module.ts` を Composition Root として扱い、DB 接続・プール生成・トランザクション実行関数の初期化を集約する。
- 各 feature module は「必要な repository / usecase / service だけ」を組み立てる。
- すべての依存は明示的に受け取る。大きな `Repository` バンドル全体を暗黙的に渡さない。
- `Service` は薄い窓口として残し、層の責務が混ざらないようにする。
- `Usecase` はビジネスロジックを持ち、Hono の `Context` や HTTP 依存を持たない。

## 2. 依存注入の責務分離

### アプリ全体の責務

- `DATABASE_URL` の検証
- Drizzle/Postgres の接続生成
- `Client` / `Transaction` / `TransactionExecutor` の管理
- feature module の登録
- request で使うコンテキスト変数の初期化

### feature module の責務

- 必要な repository を生成する
- 必要な usecase を組み立てる
- 組み立て済み service を返す
- その feature で使う依存だけを保持する

### Service の責務

- usecase を呼ぶ薄い公開インターフェースを持つ
- エンドポイントの型とロジックの大きさを維持する
- DB 接続の生成や接続選択を行わない

## 3. ルール

### 必須

- `app.module.ts` が DB 接続生成の入口になる。
- `feature/*.module.ts` は、必要とする repository / usecase を注入して service を生成する。
- `Routing` 側では service の生成をしない。
- `@/module` のような存在しないパスを使わない。
- `AppEnv` は `@/app.module` から import する。
- `verifyJwtMiddleware` と `setAuthContext` / `injectAuthContext` を別責務として扱う。
- `next()` は 1 回だけ呼び出す。

### 禁止

- `app.module.ts` で全 feature の `service` を直接生成し、各 feature module でも同じ生成を行うこと
- feature module で別ルートの module / service を直接 generate すること
- `as any` / `as unknown as` で型の不整合を隠すこと
- ルートの DB 接続に fallback して RLS を回避すること
- リクエスト全体を無条件に大きなトランザクションで囲うこと
- `createRepository()` を各 feature module 側で直接呼ぶこと
- `next()` を複数回発行すること

## 4. Drizzle / Transaction の扱い

- `Client` と `Transaction` は明示的に使い分ける
- transaction は Usecase 実行単位で開始する
- tenant 利用時は `set_config('app.current_tenant_id', tenantId, true)` をその transaction 内で実行する
- `set_config` を実行した transaction をそのまま repository に渡し、同一接続上で続ける
- 検索・更新・削除のほぼすべてがテナント制約付きである場合は、同じ `trx` を使う
- `Repository` へ `trx` を渡すときは、`db` へ fallback しない

## 5. Tenant / Auth / RLS の設計

- JWT 検証と tenant 所属確認を分離する
- `verifyJwtMiddleware` は token 検証のみを行う
- `setAuthContext` / `injectAuthContext` は `authUserId` / `tenantId` をコンテキストへ格納し、所属確認を行う
- `requireTenantAuth` は両方を合成して利用する
- `tenantId` が未指定の API は tenant 必須 API と分離し、無条件に強制しない
- RLS を回避するために管理者権限や bypass を追加しない

## 6. Module 実装パターン

```ts
export const featureModule = createMiddleware<AppEnv>(async (c, next) => {
  const repository = c.get("repository");
  const { featureRepository, ... } = repository;

  c.set(
    "featureService",
    featureService(
      featureRepository,
      otherRepository,
      executeTransaction,
    ),
  );

  await next();
});
```

- `repository` は `c.get("repository")` から取得する
- `repository` の全量を受け取るのではなく、必要なものだけを受け取る
- `app.module.ts` は feature module を呼ぶのみとする

## 7. feature 追加時のチェックリスト

- repository の型が最小限化されているか
- usecase が必要な依存だけを受けているか
- service が薄い窓口になっているか
- route が repository を直接扱っていないか
- テストが正常系・異常系を持っているか
- RLS / tenant 制約が transaction に閉じているか
- `AppEnv` import が `@/app.module` になっているか

## 8. 完了条件

- 全 feature の DI が `feature module` に集約されている
- `app.module.ts` では DB 接続と依存の接続のみを担当している
- `router` は API の入口だけを持ち、依存生成をしない
- 共通ミドルウェアの import / export が整っている
- TypeScript の型チェックとテストが通る
