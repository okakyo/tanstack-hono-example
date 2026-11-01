import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";

import { and, desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

/**
 * 最終アクセステナント履歴のRepository
 *
 * ユーザーのテナントアクセス履歴を管理し、
 * 次回ログイン時の自動テナント選択に使用します。
 */
export const latestAccessedTenantRepository = (db: Client) => {
  return {
    /**
     * ユーザーの最新アクセステナントを取得
     * accessedAt で降順ソートして最新のものを返す
     */
    findLatestByUserId: async (userId: string, trx?: Client) => {
      const client = trx || db;
      try {
        const result = await client
          .select()
          .from(schema.latestAccessedTenant)
          .where(eq(schema.latestAccessedTenant.userId, userId))
          .orderBy(desc(schema.latestAccessedTenant.accessedAt))
          .limit(1);

        return result[0] || null;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },

    /**
     * ユーザーの最近アクセスしたテナント一覧を取得
     * @param userId - ユーザーID
     * @param limit - 取得件数(デフォルト: 5)
     */
    findRecentByUserId: async (userId: string, limit = 5, trx?: Client) => {
      const client = trx || db;
      try {
        const result = await client
          .select()
          .from(schema.latestAccessedTenant)
          .where(eq(schema.latestAccessedTenant.userId, userId))
          .orderBy(desc(schema.latestAccessedTenant.accessedAt))
          .limit(limit);

        return result;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },

    /**
     * テナントアクセスを記録または更新(UPSERT)
     * 同じユーザー・テナントの組み合わせが存在する場合はaccessedAtを更新
     */
    upsertAccess: async (userId: string, tenantId: string, trx?: Client) => {
      const client = trx || db;
      try {
        // 既存レコードを確認
        const existing = await client
          .select()
          .from(schema.latestAccessedTenant)
          .where(
            and(
              eq(schema.latestAccessedTenant.userId, userId),
              eq(schema.latestAccessedTenant.tenantId, tenantId),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          // 既存レコードがある場合は accessedAt を更新
          const result = await client
            .update(schema.latestAccessedTenant)
            .set({
              accessedAt: new Date().toISOString(),
            })
            .where(eq(schema.latestAccessedTenant.id, existing[0].id))
            .returning();
          return result[0];
        }

        // 新規レコードを挿入
        const result = await client
          .insert(schema.latestAccessedTenant)
          .values({
            userId,
            tenantId,
            accessedAt: new Date().toISOString(),
          })
          .returning();

        return result[0];
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },

    /**
     * 特定のテナントアクセス履歴を削除
     */
    delete: async (userId: string, tenantId: string, trx?: Client) => {
      const client = trx || db;
      try {
        await client
          .delete(schema.latestAccessedTenant)
          .where(
            and(
              eq(schema.latestAccessedTenant.userId, userId),
              eq(schema.latestAccessedTenant.tenantId, tenantId),
            ),
          );
        return true;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },

    /**
     * ユーザーの全てのアクセス履歴を削除
     */
    deleteAllByUserId: async (userId: string, trx?: Client) => {
      const client = trx || db;
      try {
        await client
          .delete(schema.latestAccessedTenant)
          .where(eq(schema.latestAccessedTenant.userId, userId));
        return true;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
  };
};

export type LatestAccessedTenantRepository = ReturnType<
  typeof latestAccessedTenantRepository
>;
