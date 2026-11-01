import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type {
  CreateUserDto,
  UpdateUserDto,
} from "@/features/user/domains/users.input";

export const userRepository = (db: Client) => {
  return {
    findById: async (id: string) => {
      const result = await db.query.user.findFirst({
        where: (user, { eq: equals }) => equals(user.id, id),
      });
      if (!result) {
        return null;
      }
      return result;
    },
    findByEmail: async (email: string) => {
      const result = await db.query.user.findFirst({
        where: (user, { eq: equals }) => equals(user.email, email),
      });
      if (!result) {
        return null;
      }
      return result;
    },
    /**
     * Supabase の authUserId でユーザーを検索
     * 認証機能で使用します
     */
    findByAuthUserId: async (authUserId: string) => {
      try {
        const result = await db.query.user.findFirst({
          where: (user, { eq: equals }) => equals(user.authUserId, authUserId),
        });
        return result;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
    /**
     * Supabase の authUserId でユーザーを検索し、メンバー情報とテナント情報も取得
     * ログイン時のテナント判定で使用します
     */
    findByAuthUserIdWithMembers: async (authUserId: string) => {
      try {
        const result = await db.query.user.findFirst({
          where: (user, { eq: equals }) => equals(user.authUserId, authUserId),
          with: {
            members: {
              with: {
                tenant: true,
                company: true,
                memberRole: true,
              },
            },
            latestAccessedTenants: {
              with: {
                tenant: true,
              },
            },
          },
        });
        return result;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
    /**
     * ユーザーが特定のテナントに所属しているかを確認
     * @param userId - ユーザーID
     * @param tenantId - テナントID
     * @returns テナントに所属している場合はtrue
     */
    isMemberOfTenant: async (
      userId: string,
      tenantId: string,
    ): Promise<boolean> => {
      try {
        const result = await db
          .select({ id: schema.member.id })
          .from(schema.member)
          .where(
            and(
              eq(schema.member.userId, userId),
              eq(schema.member.tenantId, tenantId),
            ),
          )
          .limit(1);
        return result.length > 0;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
    create: async (input: CreateUserDto, trx?: Client) => {
      try {
        const client = trx || db;
        const result = await client
          .insert(schema.user)
          .values({ ...input })
          .returning();
        return result;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
    update: async (id: string, input: UpdateUserDto, trx?: Client) => {
      try {
        const client = trx || db;
        const _result = await client
          .update(schema.user)
          .set({
            ...input,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(schema.user.id, id))
          .returning();
        return true;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
    /**
     * ユーザーを削除します（論理削除: deleted テーブルに記録）
     * @param id - 削除するユーザーのID
     * @param trx - トランザクション（任意）
     * @returns 削除成功の真偽値
     */
    delete: async (id: string, trx?: Client) => {
      try {
        const client = trx || db;
        await client.insert(schema.userDeleted).values({
          userId: id,
        });
        return true;
      } catch (_error) {
        throw new HTTPException(511, {
          message: _error instanceof Error ? _error.message : "Database Error",
        });
      }
    },
  };
};

export type UserRepository = ReturnType<typeof userRepository>;
