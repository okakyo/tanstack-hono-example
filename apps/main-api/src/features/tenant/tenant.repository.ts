import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";
import { count, eq, notExists, type SQL } from "drizzle-orm";
import {
  applyFiltersAndPaginationHelper,
  applyOrderByHelper,
  combineWhereClauses,
  type SortCondition,
} from "@/libs/utils/queryBuilder";

type FindTenantsParams = {
  where?: SQL;
  orderBy?: SortCondition[];
  limit?: number;
  offset?: number;
  trx?: Client;
};

type CreateInput = {
  name: string;
  supabaseTenantId: string;
  createdBy?: string;
  updatedBy?: string;
};

type UpdateInput = {
  name?: string;
  supabaseTenantId?: string;
  updatedBy: string;
};

export const tenantRepository = (db: Client) => {
  const buildNotDeletedWhere = () =>
    notExists(
      db
        .select({ id: schema.tenantDeleted.id })
        .from(schema.tenantDeleted)
        .where(eq(schema.tenantDeleted.tenantId, schema.tenant.id)),
    );

  return {
    /**
     * テナント一覧を取得
     */
    find: async ({
      where,
      orderBy,
      limit,
      offset,
      trx,
    }: FindTenantsParams = {}) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const baseQuery = client.select().from(schema.tenant).$dynamic();

      const query = applyOrderByHelper(
        applyFiltersAndPaginationHelper(baseQuery, {
          where: whereClause,
          limit,
          offset,
        }),
        schema.tenant,
        orderBy,
      );

      return await query;
    },

    /**
     * IDでテナントを取得
     */
    findById: async (id: string, trx?: Client) => {
      const client = trx || db;
      const res = await client
        .select()
        .from(schema.tenant)
        .where(eq(schema.tenant.id, id))
        .limit(1);

      return res[0] || null;
    },

    /**
     * テナントが削除されているか確認
     */
    isDeleted: async (id: string) => {
      const res = await db
        .select()
        .from(schema.tenantDeleted)
        .where(eq(schema.tenantDeleted.tenantId, id))
        .limit(1);

      return res.length > 0;
    },

    /**
     * テナント数をカウント
     */
    count: async (where?: SQL, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const query = client
        .select({ count: count() })
        .from(schema.tenant)
        .$dynamic();

      const finalQuery = whereClause ? query.where(whereClause) : query;
      const result = await finalQuery;
      return result[0]?.count || 0;
    },

    /**
     * テナントを作成
     */
    create: async (data: CreateInput, trx?: Client) => {
      const client = trx || db;
      const res = await client
        .insert(schema.tenant)
        .values({
          name: data.name,
          supabaseTenantId: data.supabaseTenantId,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
        })
        .returning();

      return res[0];
    },

    /**
     * テナントを更新
     */
    update: async (id: string, data: UpdateInput, trx?: Client) => {
      const client = trx || db;
      const res = await client
        .update(schema.tenant)
        .set({
          name: data.name,
          supabaseTenantId: data.supabaseTenantId,
          updatedBy: data.updatedBy,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.tenant.id, id))
        .returning();

      return res[0] || null;
    },

    /**
     * テナントを削除します（論理削除: deleted テーブルに記録）
     * @param id - 削除するテナントのID
     * @param trx - トランザクション（任意）
     * @returns 削除成功の真偽値
     */
    delete: async (id: string, trx?: Client) => {
      const client = trx || db;
      await client.insert(schema.tenantDeleted).values({
        tenantId: id,
      });
      return true;
    },
  };
};

export type TenantRepository = ReturnType<typeof tenantRepository>;

export type Repository = {
  tenantRepository: TenantRepository;
};
