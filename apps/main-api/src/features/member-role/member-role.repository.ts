import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";
import { count, eq, notExists, type SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import {
  applyFiltersAndPaginationHelper,
  applyOrderByHelper,
  combineWhereClauses,
  type SortCondition,
} from "@/libs/utils/queryBuilder";

type FindMemberRolesParams = {
  where?: SQL;
  orderBy?: SortCondition[];
  limit?: number;
  offset?: number;
  trx?: Client;
};

type CreateMemberRoleInput = {
  role: string;
  description?: string | null;
  createdBy?: string;
  updatedBy?: string;
};

type UpdateMemberRoleInput = Partial<
  Omit<CreateMemberRoleInput, "createdBy">
> & {
  updatedBy?: string;
};

export const memberRoleRepository = (db: Client) => {
  const buildNotDeletedWhere = () =>
    notExists(
      db
        .select({ id: schema.memberRoleDeleted.id })
        .from(schema.memberRoleDeleted)
        .where(eq(schema.memberRoleDeleted.memberRoleId, schema.memberRole.id)),
    );

  return {
    find: async ({
      where,
      orderBy,
      limit,
      offset,
      trx,
    }: FindMemberRolesParams = {}) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const baseQuery = client.select().from(schema.memberRole).$dynamic();

      const query = applyOrderByHelper(
        applyFiltersAndPaginationHelper(baseQuery, {
          where: whereClause,
          limit,
          offset,
        }),
        schema.memberRole,
        orderBy,
      );

      return await query;
    },

    findById: async (id: string, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .select()
        .from(schema.memberRole)
        .where(eq(schema.memberRole.id, id))
        .limit(1);

      return result[0] || null;
    },

    isDeleted: async (id: string, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .select({ id: schema.memberRoleDeleted.id })
        .from(schema.memberRoleDeleted)
        .where(eq(schema.memberRoleDeleted.memberRoleId, id))
        .limit(1);

      return result.length > 0;
    },

    count: async (where?: SQL, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const query = client
        .select({ count: count() })
        .from(schema.memberRole)
        .$dynamic();

      const finalQuery = whereClause ? query.where(whereClause) : query;
      const result = await finalQuery;
      return result[0]?.count || 0;
    },

    create: async (input: CreateMemberRoleInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .insert(schema.memberRole)
        .values(input)
        .returning();
      return result[0];
    },

    update: async (id: string, input: UpdateMemberRoleInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .update(schema.memberRole)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.memberRole.id, id))
        .returning();

      if (result.length === 0) {
        throw new HTTPException(404, { message: "MemberRole not found" });
      }

      return result[0];
    },

    /**
     * メンバーロールを削除します（論理削除: deleted テーブルに記録）
     * @param id - 削除するメンバーロールのID
     * @param trx - トランザクション（任意）
     * @returns 削除成功の真偽値
     */
    delete: async (id: string, trx?: Client) => {
      const client = trx || db;
      await client.insert(schema.memberRoleDeleted).values({
        memberRoleId: id,
      });
      return true;
    },
  };
};

export type MemberRoleRepository = ReturnType<typeof memberRoleRepository>;

export type Repository = {
  memberRoleRepository: MemberRoleRepository;
};
