# トランザクション処理パターン

このドキュメントでは、`useDocumentService`でトランザクションを外部から注入して利用する方法について説明します。

## 概要

トランザクション処理を適切に管理するために、以下の依存性注入パターンを採用しています:

1. **トランザクション実行関数の定義**: `TransactionExecutor`型を定義
2. **外部からの注入**: Usecase 層でトランザクション実行関数を受け取る
3. **トランザクションの実行**: 注入された関数を使用してトランザクション内で複数の操作を実行

## アーキテクチャ

```
Router層
  ↓ (executeTransactionを取得)
Middleware/DI層
  ↓ (executeTransactionを作成)
Repository作成層 (drizzle/index.ts)
  ↓ (executeTransactionを注入)
Usecase層
  ↓ (トランザクション内でRepositoryを呼び出し)
Repository層
```

## 実装の詳細

### 1. トランザクション実行関数の型定義

`drizzle/index.ts`でトランザクション実行関数の型を定義します:

```typescript
/**
 * トランザクション実行関数の型定義
 * コールバック関数内でトランザクションオブジェクトを受け取り、
 * 任意の型の結果を返すことができます
 */
export type TransactionExecutor = <T>(
	callback: (trx: Transaction) => Promise<T>
) => Promise<T>;
```

### 2. トランザクション実行関数の作成

`drizzle/index.ts`で実際のトランザクション実行関数を作成します:

```typescript
/**
 * トランザクション実行関数を作成します
 * この関数をUsecaseに注入することで、各Usecaseがトランザクションを制御できるようになります
 */
export const createTransactionExecutor = (db: Client): TransactionExecutor => {
	return async <T>(callback: (trx: Transaction) => Promise<T>): Promise<T> => {
		return await db.transaction(callback);
	};
};
```

### 3. Repository 型への追加

`src/repositories/index.ts`で Repository 型にトランザクション実行関数を追加します:

```typescript
export type Repository = {
	db: Client;
	userRepository: UserRepository;
	documentRepository: DocumentRepository;
	documentStatusRepository: DocumentStatusRepository;
	tagRepository: TagRepository;
	/**
	 * トランザクション実行関数
	 * Usecase層でトランザクションを制御するために使用します
	 */
	executeTransaction: TransactionExecutor;
};
```

### 4. Repository の作成時にトランザクション実行関数を含める

`drizzle/index.ts`の`createRepository`関数で、トランザクション実行関数も返すようにします:

```typescript
export const createRepository = (): Repository => {
	const databaseUrl = process.env.DATABASE_URL || '';
	// ... データベース接続の設定 ...

	const db = drizzle(postgresClient, { schema });

	return {
		...drizzleRepositories(db),
		executeTransaction: createTransactionExecutor(db)
	};
};
```

## 使用方法

### Usecase 層での使用

`src/usecases/document/index.ts`でトランザクション実行関数を受け取ります:

```typescript
import type { TransactionExecutor } from '@db/index.js';

export const useDocumentService = (
	documentRepository: DocumentRepository,
	tagRepository: TagRepository,
	executeTransaction: TransactionExecutor
) => {
	return {
		find: findDocumentsUseCase(documentRepository),
		findById: findDocumentByIdUseCase(documentRepository),
		save: createDocumentUseCase(
			documentRepository,
			tagRepository,
			executeTransaction
		),
		edit: updateDocumentUseCase(
			documentRepository,
			tagRepository,
			executeTransaction
		),
		delete: deleteDocumentUseCase(documentRepository)
	};
};
```

### 個別の Usecase 関数での実装

`src/usecases/document/document.service.ts`で実際にトランザクションを使用します:

```typescript
export const createDocumentUseCase =
	(
		documentRepository: DocumentRepository,
		tagRepository: TagRepository,
		executeTransaction: TransactionExecutor
	) =>
	async (document: CreateDocumentDto) => {
		try {
			// 外部から注入されたトランザクション実行関数を使用
			const result = await executeTransaction(async (trx) => {
				const { tagIds, ...documentData } = document;

				// 1. タグIDの検証(タグが指定されている場合)
				if (tagIds && tagIds.length > 0) {
					await tagRepository.validateTagIds(tagIds, trx);
				}

				// 2. ドキュメントを作成（trxを渡してトランザクション内で実行）
				const createdDocument = await documentRepository.create(
					documentData,
					trx
				);

				// 3. タグを関連付け
				if (tagIds && tagIds.length > 0) {
					await tagRepository.createDocumentTagRelations(
						createdDocument.id,
						tagIds,
						trx
					);
				}

				return createdDocument;
			});

			return ok(result);
		} catch (_error) {
			if (_error instanceof HTTPException) {
				return err(error);
			}
			return err(new HTTPException(500, { message: 'Internal server error' }));
		}
	};
```

### Router 層での使用

`src/apps/router/document.router.ts`で Repository から取得して使用します:

```typescript
export const documentRouter = new Hono<AppEnv>().post(
	'/',
	vValidator('json', createDocumentDtoSchema),
	async (c) => {
		const body = await c.req.valid('json');
		const { documentRepository, tagRepository, executeTransaction } =
			c.get('repository');

		// トランザクション実行関数を渡してサービスを作成
		const documentService = useDocumentService(
			documentRepository,
			tagRepository,
			executeTransaction
		);

		const res = await documentService.save(body);
		return handleResult(c, res, 201);
	}
);
```

## トランザクション内で使用する Repository メソッド

Repository メソッドは、**任意の**トランザクションオブジェクト`trx`を最後の引数として受け取ります。
`trx`が渡されなかった場合は`db`を直接使用し、渡された場合はトランザクション内で実行されます。
この時、trx の型は `drizzle/index.ts` の `Transaction を利用してください。

### Document Repository

```typescript
create: async (
	input: Omit<CreateDocumentDto, 'tagIds'>,
	trx?: Transaction
) => {
	// トランザクションが渡された場合はそれを使用、なければdbを使用
	const queryRunner = trx ?? db;

	const { tagIds, ...documentData } = input;
	const result = await queryRunner
		.insert(documentDbSchema)
		.values({
			...documentData,
			content: documentData.content ?? '',
			authorId: 'test',
			statusId: documentData.statusId ?? 1
		})
		.returning();
	return result[0];
};

update: async (
	documentId: string,
	input: Omit<UpdateDocumentDto, 'tagIds'>,
	trx?: Transaction
) => {
	const queryRunner = trx ?? db;

	const result = await queryRunner
		.update(documentDbSchema)
		.set(input)
		.where(eq(documentDbSchema.id, documentId))
		.returning();
	return result[0];
};

delete: async (
	documentId: string,
	trx?: Transaction
) => {
	const queryRunner = trx ?? db;

	await queryRunner
		.delete(documentDbSchema)
		.where(eq(documentDbSchema.id, documentId));
};
```

このパターンにより、以下のような柔軟な使用が可能になります:

```typescript
// トランザクション内で使用
await executeTransaction(async (trx) => {
	await documentRepository.create(data, trx);
	await tagRepository.createDocumentTagRelations(documentId, tagIds, trx);
});

// トランザクション外で直接使用
await documentRepository.create(data); // trxを省略するとdbを使用
```

### Tag Repository

```typescript
validateTagIds: async (
	tagIds: string[],
	trx?: Transaction
): Promise<boolean> => {
	const queryRunner = trx ?? db;

	// トランザクション内でタグIDを検証
	const validTags = await queryRunner
		.select({ id: tagDbSchema.id })
		.from(tagDbSchema)
		.where(sql`${tagDbSchema.id} = ANY(${tagIds}::text[])`);

	if (validTags.length !== tagIds.length) {
		throw new HTTPException(510, { message: 'Invalid Tag ID' });
	}
	return true;
};

createDocumentTagRelations: async (
	documentId: string,
	tagIds: string[],
	trx?: Transaction
) => {
	const queryRunner = trx ?? db;

	// トランザクション内でドキュメントとタグの関連を作成
	await queryRunner
		.insert(documentTagDbSchema)
		.values(tagIds.map((tagId) => ({ documentId, tagId })));
};

deleteDocumentTagRelations: async (documentId: string, trx?: Transaction) => {
	const queryRunner = trx ?? db;

	// トランザクション内でドキュメントとタグの関連を削除
	await queryRunner
		.delete(documentTagDbSchema)
		.where(eq(documentTagDbSchema.documentId, documentId));
};
```

## 利点

このパターンを採用することで、以下の利点があります:

1. **関心の分離**: トランザクション制御を Usecase 層で行い、Repository 層はデータアクセスに専念
2. **テストの容易性**: モックのトランザクション実行関数を注入してテスト可能
3. **柔軟性**:
   - 異なるトランザクション戦略を簡単に切り替え可能
   - **任意のトランザクションパラメータ**により、トランザクション内外での使用を統一的に記述可能
4. **型安全性**: TypeScript の型システムを活用して、正しい使用方法を強制
5. **再利用性**: 同じトランザクション実行関数を複数の Usecase で共有可能
6. **コードの簡潔性**: `createWithinTransaction`と`create`のような重複メソッドを排除し、単一のメソッドで両方の使用方法に対応

## トランザクションのロールバック

トランザクション内でエラーが発生した場合、自動的にロールバックされます:

```typescript
const result = await executeTransaction(async (trx) => {
	// 処理1
	await repository.operation1(trx);

	// 処理2でエラーが発生
	throw new Error('エラー発生');

	// この処理は実行されず、処理1もロールバックされる
	await repository.operation2(trx);
});
```

## まとめ

- `TransactionExecutor`型でトランザクション実行関数を定義
- `createTransactionExecutor`でトランザクション実行関数を作成
- Usecase 層にトランザクション実行関数を注入
- トランザクション内で複数の Repository 操作を実行
- エラー時は自動的にロールバック

この実装パターンにより、クリーンで保守しやすいトランザクション管理が実現できます。頑張ってください!🎉
