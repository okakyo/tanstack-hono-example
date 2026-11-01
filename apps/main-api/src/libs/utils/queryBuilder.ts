import { and, asc, desc, type SQL } from "drizzle-orm";

/**
 * ソート順の型定義
 */
export type SortOrder = "asc" | "desc";

/**
 * ソート可能なカラムの型定義
 */
export type SortableColumn = string;

/**
 * ソート条件
 */
export type SortCondition = {
  field: SortableColumn;
  order: SortOrder;
};

/**
 * ページネーションオプション
 */
export type PaginationOptions = {
  limit?: number;
  offset?: number;
};

/**
 * フィルターオプション
 */
export type FilterOptions = {
  where?: SQL;
};

/**
 * クエリオプション
 */
export type QueryOptions = PaginationOptions &
  FilterOptions & {
    orderBy?: SortCondition[];
  };

/**
 * ページネーションを構築するユーティリティ関数
 * @param limit - 取得件数
 * @param offset - スキップ件数
 * @returns ページネーション設定
 */
export const buildPagination = (limit?: number, offset?: number) => ({
  limit: limit ?? 10,
  offset: offset ?? 0,
});

/**
 * ORDER BY句を動的に適用するヘルパー関数
 * @param query - クエリビルダー
 * @param schema - データベーススキーマ
 * @param orderBy - ソート条件
 * @returns ソート適用後のクエリ
 */
export const applyOrderBy = <T, TSchema extends object>(
  query: T,
  schema: TSchema,
  orderBy?: SortCondition[],
): T => {
  if (!orderBy || orderBy.length === 0) return query;

  const orderColumns = orderBy.map(({ field, order }) => {
    const column = (schema as Record<string, unknown>)[field];
    if (!column) {
      throw new Error(`Invalid sort field: ${field}`);
    }
    return order === "desc"
      ? desc(column as Parameters<typeof desc>[0])
      : asc(column as Parameters<typeof asc>[0]);
  });

  // @ts-expect-error - Drizzle ORMの動的クエリビルダーの型制約を回避
  return query.orderBy(...orderColumns);
};

/**
 * WHERE/LIMIT/OFFSET句を動的に適用するヘルパー関数
 * @param query - クエリビルダー
 * @param options - フィルターとページネーションオプション
 * @returns フィルター適用後のクエリ
 */
export const applyFiltersAndPagination = <T>(
  query: T,
  options: QueryOptions,
): T => {
  let result = query;

  if (options.where) {
    // @ts-expect-error
    result = result.where(options.where);
  }

  if (options.orderBy && options.orderBy.length > 0) {
    result = applyOrderBy(result, options.orderBy);
  }

  if (options.limit !== undefined && options.limit > 0) {
    // @ts-expect-error
    result = result.limit(options.limit);
  }

  if (options.offset !== undefined && options.offset > 0) {
    // @ts-expect-error
    result = result.offset(options.offset);
  }

  return result;
};

/**
 * Repository用の共通ヘルパー関数
 * WHERE/LIMIT/OFFSET句を適用
 * @param query - クエリビルダー
 * @param options - フィルターとページネーションオプション
 * @returns フィルター適用後のクエリ
 */
export const applyFiltersAndPaginationHelper = <T>(
  query: T,
  options: {
    where?: SQL;
    limit?: number;
    offset?: number;
  },
): T => {
  return applyFiltersAndPagination(query, options);
};

/**
 * WHERE句を安全に結合するヘルパー関数
 * @param conditions - 結合する条件の配列
 * @returns 結合後のWHERE句
 */
export const combineWhereClauses = (
  ...conditions: Array<SQL | undefined>
): SQL | undefined => {
  const validConditions = conditions.filter(
    (condition): condition is SQL => condition !== undefined,
  );

  if (validConditions.length === 0) {
    return undefined;
  }

  if (validConditions.length === 1) {
    return validConditions[0];
  }

  return and(...validConditions);
};

/**
 * Repository用の共通ヘルパー関数
 * ORDER BY句を適用
 * @param query - クエリビルダー
 * @param schema - データベーススキーマ
 * @param orderBy - ソート条件
 * @returns ソート適用後のクエリ
 */
export const applyOrderByHelper = <T, TSchema extends object>(
  query: T,
  schema: TSchema,
  orderBy?: SortCondition[],
): T => {
  return applyOrderBy(query, schema, orderBy);
};
