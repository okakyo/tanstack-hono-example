# TypeScript コーディングルール

本ドキュメントでは、プロジェクト全体で統一すべき TypeScript のコーディング規約とベストプラクティスを定めています。

## 目次

<details>
  <summary>目次一覧</summary>

[[toc]]
</details>

## 基本方針

- **型安全性を最優先**: TypeScript の型システムを最大限活用します
- **明示的な型定義**: 推論に頼りすぎず、明示的に型を記述します
- **保守性の重視**: 将来の変更に強いコードを書きます
- **一貫性の確保**: チーム全体で同じパターンを使用します

## 型定義

### Props の型定義

コンポーネントの Props や関数の引数の型定義には `type` を使用します。

```typescript
// ✅ Good
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function Button({ label, onClick, disabled = false }: ButtonProps) {
  // ...
}

// ❌ Bad: interface よりも type を使用
interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

### 型エイリアスの命名規則

- Props: `〇〇Props`
- リクエスト: `〇〇Request`
- レスポンス: `〇〇Response`
- エンティティ: `〇〇Entity`
- DTO: `〇〇Dto`

```typescript
// ✅ Good
type CreateDocumentRequest = {
  title: string;
  content: string;
};

type CreateDocumentResponse = {
  id: string;
  createdAt: Date;
};

type DocumentEntity = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### `any` 型を避ける

`any` 型の使用は極力避けます。型が不明な場合は `unknown` を使用し、適切な型ガードを実装します。

```typescript
// ❌ Bad
function parseJson(json: string): any {
  return JSON.parse(json);
}

// ✅ Good
function parseJson<T>(json: string): unknown {
  return JSON.parse(json);
}

// ✅ Better: バリデーションを含める
import * as v from 'valibot';

function parseJson<T>(json: string, schema: v.BaseSchema): T {
  const data = JSON.parse(json);
  return v.parse(schema, data);
}
```

### オプショナルプロパティ

オプショナルプロパティは `?` を使用します。`| undefined` との併用は避けます。

```typescript
// ✅ Good
type User = {
  id: string;
  name: string;
  email?: string;
};

// ❌ Bad
type User = {
  id: string;
  name: string;
  email: string | undefined;
};
```

## 命名規則

### ファイル名

- コンポーネント: ケバブケース `my-component.tsx`
- ユーティリティ: ケバブケース `format-date.ts`
- ディレクトリ: ケバブケース `user-profile/`
- 型定義ファイル: ケバブケース `user-types.ts`

```
✅ Good
src/
  components/
    user-profile/
      user-avatar.tsx
      user-info.tsx
  utils/
    format-date.ts
    validate-email.ts

❌ Bad
src/
  components/
    UserProfile/
      UserAvatar.tsx
  utils/
    formatDate.ts
```

### 変数・関数名

- **変数**: `camelCase`
- **定数**: `UPPER_SNAKE_CASE`
- **関数**: `camelCase`（動詞から始める）
- **コンポーネント**: `PascalCase`
- **型**: `PascalCase`

```typescript
// ✅ Good
const userName = 'John';
const MAX_RETRY_COUNT = 3;

function fetchUserData(userId: string) {
  // ...
}

function UserProfile() {
  // ...
}

type UserProfile = {
  // ...
};

// ❌ Bad
const UserName = 'John';
const max_retry_count = 3;

function FetchUserData(userId: string) {
  // ...
}
```

### Boolean 値

Boolean 値の変数名には `is`, `has`, `should` などの接頭辞を付けます。

```typescript
// ✅ Good
const isLoading = true;
const hasError = false;
const shouldRender = true;
const canEdit = false;

// ❌ Bad
const loading = true;
const error = false;
```

## 関数設計

### 関数の引数

引数が3つ以上になる場合は、オブジェクトにまとめます。

```typescript
// ❌ Bad
function createUser(name: string, email: string, age: number, role: string) {
  // ...
}

// ✅ Good
type CreateUserParams = {
  name: string;
  email: string;
  age: number;
  role: string;
};

function createUser(params: CreateUserParams) {
  // ...
}
```

### 関数の戻り値

戻り値の型は明示的に記述します。

```typescript
// ❌ Bad
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Promise の型定義

非同期関数の戻り値は `Promise<T>` で明示します。

```typescript
// ✅ Good
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ❌ Bad
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## JSDoc コメント

関数やコンポーネントには JSDoc コメントを記述し、IDE のインテリセンスを向上させます。

```typescript
/**
 * ユーザー情報を取得する
 *
 * @param userId - ユーザー ID
 * @returns ユーザー情報
 * @throws {NotFoundError} ユーザーが見つからない場合
 *
 * @example
 * ```typescript
 * const user = await fetchUser('123');
 * console.log(user.name);
 * ```
 */
async function fetchUser(userId: string): Promise<User> {
  // ...
}
```

## エラーハンドリング

### Result 型の使用

バックエンドでは `neverthrow` を使用した Result 型でエラーを表現します。

```typescript
import { ok, err, Result } from 'neverthrow';

type UserNotFoundError = {
  type: 'USER_NOT_FOUND';
  userId: string;
};

type ValidationError = {
  type: 'VALIDATION_ERROR';
  message: string;
};

/**
 * ユーザーを取得する
 */
function findUser(
  userId: string
): Result<User, UserNotFoundError | ValidationError> {
  if (!userId) {
    return err({ type: 'VALIDATION_ERROR', message: 'userId is required' });
  }

  const user = userRepository.findById(userId);
  if (!user) {
    return err({ type: 'USER_NOT_FOUND', userId });
  }

  return ok(user);
}

// 使用例
const result = findUser('123');
if (result.isErr()) {
  switch (result.error.type) {
    case 'USER_NOT_FOUND':
      console.log(`User ${result.error.userId} not found`);
      break;
    case 'VALIDATION_ERROR':
      console.log(result.error.message);
      break;
  }
} else {
  console.log(result.value.name);
}
```

### カスタムエラークラス

エラーの種類に応じてカスタムエラークラスを定義します。

```typescript
export class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string
  ) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(public errors: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}
```

## ベストプラクティス

### マジックナンバーを避ける

数値や文字列をハードコーディングせず、定数として定義します。

```typescript
// ❌ Bad
if (user.role === 'admin') {
  // ...
}
setTimeout(retry, 3000);

// ✅ Good
const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const RETRY_DELAY_MS = 3000;

if (user.role === USER_ROLE.ADMIN) {
  // ...
}
setTimeout(retry, RETRY_DELAY_MS);
```

### Enum より const オブジェクトを使用

TypeScript の `enum` よりも `as const` を使用した const オブジェクトを推奨します。

```typescript
// ❌ Bad
enum UserRole {
  Admin = 'admin',
  User = 'user',
}

// ✅ Good
const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
```

### 条件分岐の簡潔化

条件式で使用する文字列などは、ハードコーディングを避けて定数として定義します。

```typescript
// ❌ Bad
const status = user.isActive ? 'active' : 'inactive';

// ✅ Good
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

const status = user.isActive ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
```

### オブジェクトの分割代入

オブジェクトのプロパティアクセスは分割代入を活用します。

```typescript
// ❌ Bad
function displayUser(user: User) {
  console.log(user.name);
  console.log(user.email);
  console.log(user.role);
}

// ✅ Good
function displayUser(user: User) {
  const { name, email, role } = user;
  console.log(name);
  console.log(email);
  console.log(role);
}
```

### 配列・オブジェクトのスプレッド演算子

イミュータブルなデータ操作にはスプレッド演算子を使用します。

```typescript
// ❌ Bad
const newUser = user;
newUser.name = 'New Name';

// ✅ Good
const newUser = {
  ...user,
  name: 'New Name',
};

// 配列も同様
const newItems = [...items, newItem];
```

## import/export 規則

### 名前付きエクスポート

コンポーネントやユーティリティ関数は名前付きエクスポートを使用します。

```typescript
// ✅ Good
export function UserProfile() {
  // ...
}

export function formatDate(date: Date): string {
  // ...
}

// ❌ Bad
export default function UserProfile() {
  // ...
}
```

### import の順序

import は以下の順序で記述し、グループ間は空行で区切ります。

1. 外部ライブラリ
2. 内部パッケージ（`@repo/〇〇`）
3. 絶対パス（`@/〇〇`）
4. 相対パス（`./`, `../`）
5. 型のみの import

```typescript
// 外部ライブラリ
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 内部パッケージ
import type { DocumentDto } from '@repo/domains';

// 絶対パス
import { api } from '@/shared/api';
import { formatDate } from '@/shared/lib/utils';

// 相対パス
import { DocumentForm } from './document-form';
import { DocumentList } from './document-list';

// 型のみの import
import type { User } from './types';
```

## まとめ

このコーディングルールを遵守することで、チーム全体で一貫性のある、保守しやすいコードベースを維持できます。

不明な点があれば、既存のコードを参照するか、チームメンバーに相談してください！
