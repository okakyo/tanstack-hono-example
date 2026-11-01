---
name: drizzle-custom-migration
description: Drizzle の migration ファイルを作成・追加するときに必ず使う。スキーマ変更、RLS、トリガー、カスタムSQL の migration を生成する際、この手順以外の方法（手動でのファイル作成や --custom なしの generate など）は使わない。
---

# Drizzle migration 作成手順

migration の作成は、必ず以下の手順を **この順番で** 実行すること。
手順の省略・順序変更・手動でのSQLファイル作成は禁止。

## 手順

1. `apps/main-api` ディレクトリに移動する
```bash
   cd apps/main-api
```
2. 空のカスタム migration を生成する。`<name>` は変更内容が分かる snake_case の名前にする
```bash
   pnpm drizzle:generate --custom --name=<name>
```
3. 手順2で生成された SQL ファイル（`drizzle/` 配下）に migration の SQL を記述する
   - 生成された `.sql` ファイル以外（`meta/` 配下の snapshot や journal）は手で編集しない
4. SQL 記入後、migration を適用する
```bash
   pnpm drizzle:migrate
```
5. 適用後、スキーマを同期する
```bash
   pnpm drizzle:introspect
```

## 注意事項

- 各コマンドが失敗した場合は、次の手順に進まず、エラー内容をユーザーに報告する
- 手順5の実行後は `git diff` で差分を確認し、意図しないスキーマファイルの変更がないかを報告する
- 手順3の SQL ファイルを書き終える前に `pnpm drizzle:migrate` を実行しない
