# Git ワークフロー

本ドキュメントでは、プロジェクトで使用する Git/GitHub の運用ルールを定めています。統一されたワークフローに従うことで、効率的かつ安全な開発を実現します。

## 目次

<details>
  <summary>目次一覧</summary>

[[toc]]
</details>

## ブランチ戦略

### ブランチの種類

本プロジェクトでは以下のブランチ戦略を採用します:

| ブランチ名 | 用途                           | 保護   |
| ---------- | ------------------------------ | ------ |
| `main`     | 本番環境に対応するブランチ     | ✅ Yes |
| `develop`  | 開発環境に対応するブランチ     | ✅ Yes |
| `feature/` | 新機能開発用のブランチ         | ❌ No  |
| `fix/`     | バグ修正用のブランチ           | ❌ No  |
| `hotfix/`  | 緊急の本番バグ修正用ブランチ   | ❌ No  |
| `refactor/`| リファクタリング用のブランチ   | ❌ No  |
| `docs/`    | ドキュメント更新用のブランチ   | ❌ No  |
| `chore/`   | 設定変更、依存関係更新など     | ❌ No  |

### ブランチの命名規則

ブランチ名は以下の形式で記述します:

```
<種別>/<issue番号>-<簡潔な説明>
```

**例**:

```bash
feature/123-add-document-form
fix/456-login-validation-error
hotfix/789-security-patch
refactor/101-user-repository
docs/202-update-readme
chore/303-update-dependencies
```

### ブランチの作成

#### feature ブランチ（新機能開発）

```bash
# develop ブランチから作成
git checkout develop
git pull origin develop
git checkout -b feature/123-add-document-form
```

#### fix ブランチ（バグ修正）

```bash
# develop ブランチから作成
git checkout develop
git pull origin develop
git checkout -b fix/456-login-validation-error
```

#### hotfix ブランチ（緊急の本番バグ修正）

```bash
# main ブランチから作成
git checkout main
git pull origin main
git checkout -b hotfix/789-security-patch
```

## コミットメッセージ

### コミットメッセージの形式

コミットメッセージは以下の形式で記述します:

```
[種別] 簡潔な説明

詳細な説明（必要に応じて）

関連 Issue: #123
```

### 種別（プレフィックス）

| 種別         | 説明                                   |
| ------------ | -------------------------------------- |
| `[Feature]`  | 新機能の追加                           |
| `[Fix]`      | バグ修正                               |
| `[Refactor]` | リファクタリング（機能変更なし）       |
| `[Docs]`     | ドキュメントの追加・更新               |
| `[Test]`     | テストの追加・修正                     |
| `[Chore]`    | ビルド設定、依存関係の更新など         |
| `[Style]`    | コードフォーマット、セミコロンの追加等 |
| `[Perf]`     | パフォーマンス改善                     |

### コミットメッセージの例

#### 良い例

```bash
# 新機能
git commit -m "[Feature] ドキュメント作成フォームを実装

- タイトルと本文の入力フィールドを追加
- バリデーション機能を実装
- API との連携処理を追加

関連 Issue: #123"

# バグ修正
git commit -m "[Fix] ログインフォームのバリデーションエラーを修正

空のメールアドレスでも送信できてしまう問題を修正

関連 Issue: #456"

# リファクタリング
git commit -m "[Refactor] ユーザーリポジトリの処理を整理

- トランザクション処理を共通化
- 型定義を明確化
- 不要なコメントを削除"
```

#### 悪い例

```bash
# ❌ 説明が不十分
git commit -m "fix"

# ❌ 種別がない
git commit -m "バグを修正"

# ❌ 複数の変更を1つのコミットにまとめている
git commit -m "[Feature] フォーム追加とバグ修正とリファクタリング"
```

### コミットの粒度

- **1つのコミットには1つの変更**: 機能追加とバグ修正は別々のコミットに
- **意味のある単位**: 動作する状態でコミット
- **小さく頻繁に**: 大きな変更も小さなコミットに分割

## プルリクエスト（PR）の作成

### PR 作成の流れ

1. **ブランチを作成**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/123-add-document-form
```

2. **実装とコミット**

```bash
# ファイルを編集
git add .
git commit -m "[Feature] ドキュメント作成フォームを実装"
```

3. **リモートにプッシュ**

```bash
git push origin feature/123-add-document-form
```

4. **GitHub で PR を作成**

   - タイトルと説明を記述
   - レビュアーを指定
   - ラベルを付与

5. **レビューを受ける**

   - レビューコメントに対応
   - 修正をコミット・プッシュ

6. **マージ**
   - レビュー承認後、`Squash and merge` でマージ

### PR のマージ方法

本プロジェクトでは **Squash and merge** を使用します。

```
Squash and merge
```

**理由**:

- コミット履歴がクリーンに保たれる
- 1つの PR = 1つのコミットとして履歴に残る
- `main` や `develop` の履歴が読みやすい

### マージ後の処理

マージが完了したら、ローカルのブランチを削除します。

```bash
# リモートのブランチは GitHub で自動削除される設定にする

# ローカルブランチの削除
git checkout develop
git pull origin develop
git branch -d feature/123-add-document-form
```

## Git の基本操作

### 最新の変更を取得

```bash
# develop ブランチの最新を取得
git checkout develop
git pull origin develop
```

### リベース（rebase）

作業ブランチを最新の develop に同期する場合:

```bash
# develop の最新を取得
git checkout develop
git pull origin develop

# 作業ブランチに戻る
git checkout feature/123-add-document-form

# リベース
git rebase develop

# コンフリクトがある場合は解消
# 解消後、リベースを続行
git rebase --continue

# リモートにプッシュ（force push が必要）
git push origin feature/123-add-document-form --force-with-lease
```

### コンフリクトの解消

```bash
# コンフリクトが発生した場合、該当ファイルを編集
# コンフリクトマーカーを削除して正しい状態にする

# 解消後、ファイルを追加
git add <conflicted-file>

# リベースを続行（リベース中の場合）
git rebase --continue

# または、マージを続行（マージ中の場合）
git merge --continue
```

### コミットの修正

#### 直前のコミットメッセージを修正

```bash
git commit --amend -m "[Feature] 修正後のメッセージ"
git push origin feature/123-add-document-form --force-with-lease
```

#### 直前のコミットに変更を追加

```bash
# ファイルを編集
git add .
git commit --amend --no-edit
git push origin feature/123-add-document-form --force-with-lease
```

## GitHub の設定

### ブランチ保護ルール

`main` と `develop` ブランチには以下の保護ルールを設定します:

- ✅ Require pull request reviews before merging（レビュー必須）
- ✅ Require status checks to pass before merging（CI/CD 通過必須）
- ✅ Require branches to be up to date before merging（最新状態必須）
- ✅ Require linear history（履歴の直線化）
- ✅ Automatically delete head branches（マージ後、ブランチ自動削除）

### Issue の活用

機能追加やバグ修正は、必ず Issue を作成してから作業を開始します。

**Issue のテンプレート**:

```markdown
## 概要

簡潔に変更内容を記述

## 背景・目的

なぜこの変更が必要か

## 詳細

- 実装する機能
- 修正するバグ

## 完了条件

- [ ] 〇〇が実装されている
- [ ] テストが追加されている
- [ ] ドキュメントが更新されている

## 参考リンク

関連する資料があれば記載
```

## ベストプラクティス

### コミット前の確認

```bash
# 変更内容を確認
git status
git diff

# 段階的に add
git add <file1> <file2>

# コミット
git commit -m "[Feature] 〇〇を実装"
```

### プッシュ前の確認

```bash
# ローカルでテストを実行
pnpm test

# Biome でチェック
pnpm biome:check

# 問題なければプッシュ
git push origin feature/123-add-document-form
```

### 定期的な同期

作業ブランチは定期的に `develop` の最新状態と同期します。

```bash
# develop の最新を取得
git checkout develop
git pull origin develop

# 作業ブランチに戻ってリベース
git checkout feature/123-add-document-form
git rebase develop
```

## トラブルシューティング

### 間違ったブランチで作業してしまった

```bash
# 変更を stash に退避
git stash

# 正しいブランチに切り替え
git checkout correct-branch

# stash から変更を復元
git stash pop
```

### コミットを取り消したい

```bash
# 直前のコミットを取り消し（変更内容は保持）
git reset --soft HEAD^

# 直前のコミットを完全に取り消し
git reset --hard HEAD^

# リモートにプッシュ済みの場合（慎重に！）
git push origin feature/123-add-document-form --force-with-lease
```

### 誤って削除したブランチを復元

```bash
# reflog でコミットハッシュを確認
git reflog

# ブランチを復元
git checkout -b feature/123-add-document-form <commit-hash>
```

## まとめ

Git のワークフローを統一することで、チーム全体が効率的に作業できます。不明な点があれば、遠慮なくチームメンバーに相談してください！

---

**参考リンク**:

- [Git 公式ドキュメント](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
