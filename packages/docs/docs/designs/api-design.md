# API 設計ガイドライン

本ドキュメントでは、REST API の設計原則とベストプラクティスを定めています。一貫性のある、使いやすい API を提供するためのガイドラインです。

## 目次

<details>
  <summary>目次一覧</summary>

[[toc]]
</details>

## 基本原則

### REST の原則に従う

- **リソース指向**: URL はリソースを表す
- **HTTP メソッド**: GET, POST, PUT, PATCH, DELETE を適切に使用
- **ステートレス**: サーバーはクライアントの状態を保持しない
- **統一されたインターフェース**: 一貫性のある API 設計

### API の特徴

- **型安全**: Valibot によるバリデーション
- **エラーハンドリング**: 適切な HTTP ステータスコードとエラーメッセージ
- **認証・認可**: JWT トークンによる認証
- **ドキュメント化**: OpenAPI/Swagger による API ドキュメント

## エンドポイント設計

### URL 構造

```
https://api.example.com/v1/{resource}/{id}/{sub-resource}
```

**例**:

```
GET    /api/v1/documents          # ドキュメント一覧取得
GET    /api/v1/documents/:id      # ドキュメント詳細取得
POST   /api/v1/documents          # ドキュメント作成
PUT    /api/v1/documents/:id      # ドキュメント更新
DELETE /api/v1/documents/:id      # ドキュメント削除

GET    /api/v1/documents/:id/tags # ドキュメントのタグ一覧取得
```

### 命名規則

#### リソース名

- **複数形**: `/documents`, `/users`, `/tags`
- **小文字**: `/documents`（`/Documents` ではない）
- **ケバブケース**: `/document-tags`（複合語の場合）

#### パスパラメータ

- **単数形**: `/:id`, `/:documentId`
- **キャメルケース**: `/:userId`, `/:tenantId`

#### クエリパラメータ

- **キャメルケース**: `?page=1&limit=10&sortBy=createdAt`

```
✅ Good
GET /api/v1/documents?page=1&limit=10&sortBy=createdAt&order=desc

❌ Bad
GET /api/v1/documents?Page=1&Limit=10&sort_by=createdAt
```

## HTTP メソッド

### GET - リソースの取得

```typescript
// 一覧取得
app.get('/documents', async (c) => {
  const documents = await documentRepository.findAll();
  return c.json(documents);
});

// 詳細取得
app.get('/documents/:id', async (c) => {
  const id = c.req.param('id');
  const document = await documentRepository.findById(id);

  if (!document) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json(document);
});
```

**特徴**:

- べき等（何度実行しても同じ結果）
- キャッシュ可能
- リクエストボディなし

### POST - リソースの作成

```typescript
import { vValidator } from '@hono/valibot-validator';
import { createDocumentSchema } from '@repo/domains';

app.post('/documents', vValidator('json', createDocumentSchema), async (c) => {
  const body = c.req.valid('json');
  const userId = c.get('userId'); // 認証ミドルウェアで設定

  const document = await documentRepository.create({
    ...body,
    createdBy: userId,
  });

  return c.json(document, 201);
});
```

**特徴**:

- べき等ではない（実行のたびに新しいリソースが作成される）
- ステータスコード: `201 Created`
- Location ヘッダーで新しいリソースの URL を返す（オプション）

### PUT - リソースの完全更新

```typescript
app.put('/documents/:id', vValidator('json', updateDocumentSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const userId = c.get('userId');

  const document = await documentRepository.update(id, {
    ...body,
    updatedBy: userId,
  });

  if (!document) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json(document);
});
```

**特徴**:

- べき等（同じリクエストを何度実行しても同じ結果）
- すべてのフィールドを含める必要がある

### PATCH - リソースの部分更新

```typescript
app.patch('/documents/:id', vValidator('json', patchDocumentSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const userId = c.get('userId');

  const document = await documentRepository.update(id, {
    ...body,
    updatedBy: userId,
  });

  if (!document) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json(document);
});
```

**特徴**:

- べき等
- 一部のフィールドのみ更新可能

### DELETE - リソースの削除

```typescript
app.delete('/documents/:id', async (c) => {
  const id = c.req.param('id');

  const result = await documentRepository.delete(id);

  if (result.isErr()) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json({ message: 'Document deleted successfully' }, 200);
  // または
  // return c.body(null, 204); // No Content
});
```

**特徴**:

- べき等（すでに削除されている場合も成功とみなす）
- ステータスコード: `200 OK` または `204 No Content`

## リクエスト・レスポンス形式

### リクエストボディ

JSON 形式を使用します。

```typescript
// ✅ Good
POST /api/v1/documents
Content-Type: application/json

{
  "title": "新しいドキュメント",
  "content": "本文",
  "tags": ["tag1", "tag2"]
}
```

### レスポンス形式

#### 成功時

```typescript
// 単一リソース
{
  "id": "123",
  "title": "ドキュメント",
  "content": "本文",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}

// リソース一覧
{
  "data": [
    { "id": "1", "title": "Doc 1" },
    { "id": "2", "title": "Doc 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### エラー時

```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が正しくありません",
    "details": [
      {
        "field": "title",
        "message": "タイトルは必須です"
      },
      {
        "field": "content",
        "message": "本文は1文字以上必要です"
      }
    ]
  }
}
```

## HTTP ステータスコード

### 成功レスポンス (2xx)

| コード | 意味               | 使用例                               |
| ------ | ------------------ | ------------------------------------ |
| 200    | OK                 | GET, PUT, PATCH, DELETE の成功       |
| 201    | Created            | POST の成功（リソース作成）          |
| 204    | No Content         | DELETE の成功（レスポンスボディなし）|

### クライアントエラー (4xx)

| コード | 意味               | 使用例                               |
| ------ | ------------------ | ------------------------------------ |
| 400    | Bad Request        | バリデーションエラー                 |
| 401    | Unauthorized       | 認証エラー（トークンなし・無効）     |
| 403    | Forbidden          | 認可エラー（権限なし）               |
| 404    | Not Found          | リソースが見つからない               |
| 409    | Conflict           | リソースの競合（重複など）           |
| 422    | Unprocessable Entity | バリデーションエラー（詳細）      |
| 429    | Too Many Requests  | レート制限超過                       |

### サーバーエラー (5xx)

| コード | 意味               | 使用例                               |
| ------ | ------------------ | ------------------------------------ |
| 500    | Internal Server Error | サーバー内部エラー                |
| 503    | Service Unavailable | サービス利用不可（メンテナンス等） |

## バリデーション

### Valibot によるバリデーション

```typescript
import * as v from 'valibot';

// スキーマ定義（packages/domains/src/dto/document.dto.ts）
export const createDocumentSchema = v.object({
  title: v.string([
    v.minLength(1, 'タイトルは必須です'),
    v.maxLength(256, 'タイトルは256文字以内にしてください'),
  ]),
  content: v.string([v.minLength(1, '本文は必須です')]),
  tags: v.optional(v.array(v.string())),
});

export type CreateDocumentDto = v.InferOutput<typeof createDocumentSchema>;
```

### バリデーションミドルウェア

```typescript
import { vValidator } from '@hono/valibot-validator';

app.post(
  '/documents',
  vValidator('json', createDocumentSchema),
  async (c) => {
    const body = c.req.valid('json'); // 型安全
    // ...
  }
);
```

### バリデーションエラーのレスポンス

```typescript
// 自動的に返されるエラーレスポンス
{
  "success": false,
  "error": {
    "issues": [
      {
        "path": ["title"],
        "message": "タイトルは必須です"
      }
    ]
  }
}
```

## ページネーション

### クエリパラメータ

```typescript
GET /api/v1/documents?page=1&limit=10
```

### 実装例

```typescript
app.get('/documents', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const limit = Number(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  const documents = await documentRepository.findMany({
    limit,
    offset,
  });

  const total = await documentRepository.count();

  return c.json({
    data: documents,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
```

### カーソルベースのページネーション（推奨）

大量のデータには、カーソルベースのページネーションを使用します。

```typescript
GET /api/v1/documents?cursor=abc123&limit=10
```

```typescript
app.get('/documents', async (c) => {
  const cursor = c.req.query('cursor');
  const limit = Number(c.req.query('limit') || '10');

  const documents = await documentRepository.findMany({
    cursor,
    limit: limit + 1, // 次のページがあるか確認するため +1
  });

  const hasMore = documents.length > limit;
  const data = hasMore ? documents.slice(0, limit) : documents;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return c.json({
    data,
    meta: {
      nextCursor,
      hasMore,
    },
  });
});
```

## フィルタリング・ソート

### フィルタリング

```typescript
GET /api/v1/documents?status=published&tag=typescript
```

```typescript
app.get('/documents', async (c) => {
  const status = c.req.query('status');
  const tag = c.req.query('tag');

  const documents = await documentRepository.findMany({
    where: {
      ...(status && { status }),
      ...(tag && { tags: { contains: tag } }),
    },
  });

  return c.json(documents);
});
```

### ソート

```typescript
GET /api/v1/documents?sortBy=createdAt&order=desc
```

```typescript
app.get('/documents', async (c) => {
  const sortBy = c.req.query('sortBy') || 'createdAt';
  const order = c.req.query('order') || 'desc';

  const documents = await documentRepository.findMany({
    orderBy: {
      [sortBy]: order,
    },
  });

  return c.json(documents);
});
```

## 認証・認可

### 認証ヘッダー

```
Authorization: Bearer <JWT_TOKEN>
```

### 認証ミドルウェア

```typescript
import { verifyJwtMiddleware } from '@/apps/middleware/auth';

// すべてのルートに適用
app.use('/*', verifyJwtMiddleware);

// 特定のルートに適用
app.use('/documents/*', verifyJwtMiddleware);

// 認証ユーザー情報の取得
app.get('/me', verifyJwtMiddleware, async (c) => {
  const userId = c.get('userId');
  const user = await userRepository.findById(userId);
  return c.json(user);
});
```

### 認可（権限チェック）

```typescript
app.delete('/documents/:id', verifyJwtMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');

  const document = await documentRepository.findById(id);

  if (!document) {
    return c.json({ error: 'Document not found' }, 404);
  }

  // 作成者のみ削除可能
  if (document.createdBy !== userId) {
    return c.json({ error: 'Permission denied' }, 403);
  }

  await documentRepository.delete(id);
  return c.json({ message: 'Document deleted successfully' });
});
```

## エラーハンドリング

### グローバルエラーハンドラー

```typescript
app.onError((err, c) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return c.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message,
          details: err.errors,
        },
      },
      400
    );
  }

  if (err instanceof NotFoundError) {
    return c.json(
      {
        error: {
          code: 'NOT_FOUND',
          message: err.message,
        },
      },
      404
    );
  }

  return c.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '内部サーバーエラーが発生しました',
      },
    },
    500
  );
});
```

### カスタムエラークラス

```typescript
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
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

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
```

## レート制限

### ミドルウェアの実装

```typescript
import { rateLimiter } from 'hono-rate-limiter';

app.use(
  '/*',
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15分
    limit: 100, // 100リクエスト
    standardHeaders: 'draft-6',
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'anonymous',
  })
);
```

### レスポンスヘッダー

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640000000
```

## バージョニング

### URL パスによるバージョニング（推奨）

```typescript
// v1
app.route('/api/v1/documents', documentsV1Router);

// v2
app.route('/api/v2/documents', documentsV2Router);
```

### ヘッダーによるバージョニング

```
Accept: application/vnd.api+json; version=1
```

## CORS 設定

```typescript
import { cors } from 'hono/cors';

app.use(
  '/*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);
```

## ベストプラクティス

### 1. 一貫性を保つ

- 命名規則を統一
- レスポンス形式を統一
- エラーハンドリングを統一

### 2. セキュリティ

- 入力のバリデーション
- 認証・認可の実装
- CORS の適切な設定
- レート制限の実装

### 3. パフォーマンス

- ページネーションの実装
- キャッシュの活用
- N+1 クエリの回避

### 4. ドキュメント化

- OpenAPI/Swagger による API ドキュメント
- JSDoc コメント
- README の更新

### 5. テスト

- ユニットテスト
- 統合テスト
- E2E テスト

## まとめ

本プロジェクトの API 設計は、以下の原則に基づいています:

- **REST の原則**: リソース指向、HTTP メソッドの適切な使用
- **型安全性**: Valibot によるバリデーション
- **一貫性**: 命名規則、レスポンス形式の統一
- **セキュリティ**: 認証・認可、入力検証
- **パフォーマンス**: ページネーション、キャッシュ

この設計ガイドラインに従うことで、保守性が高く、使いやすい API を提供できます！
