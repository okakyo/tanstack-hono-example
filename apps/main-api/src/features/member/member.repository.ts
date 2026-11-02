import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";
import { asc, count, eq, notExists, type SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import {
  applyFiltersAndPaginationHelper,
  applyOrderByHelper,
  combineWhereClauses,
  type SortCondition,
} from "@/libs/utils/queryBuilder";

type FindMembersParams = {
  where?: SQL;
  orderBy?: SortCondition[];
  limit?: number;
  offset?: number;
  trx?: Client;
};

type CreateMemberInput = {
  tenantId: string;
  userId: string;
  companyId: string;
  memberRoleId: string;
  bio?: string | null;
  inviteStatusId?: string;
  createdBy?: string;
  updatedBy?: string;
};

type UpdateMemberInput = Partial<
  Omit<CreateMemberInput, "userId" | "companyId" | "createdBy">
> & {
  updatedBy?: string;
};

export const memberRepository = (db: Client) => {
  const memberListSelect = {
    id: schema.member.id,
    tenantId: schema.member.tenantId,
    userId: schema.member.userId,
    memberRoleId: schema.member.memberRoleId,
    inviteStatusId: schema.member.inviteStatusId,
    updatedAt: schema.member.updatedAt,
    user: {
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
    },
    company: {
      id: schema.company.id,
      name: schema.company.name,
    },
    memberRole: {
      id: schema.memberRole.id,
      role: schema.memberRole.role,
      description: schema.memberRole.description,
    },
  };
  const memberSelectOptionSelect = {
    id: schema.member.id,
    name: schema.user.name,
  };

  const buildNotDeletedWhere = () =>
    combineWhereClauses(
      notExists(
        db
          .select({ id: schema.memberDeleted.id })
          .from(schema.memberDeleted)
          .where(eq(schema.memberDeleted.memberId, schema.member.id)),
      ),
      notExists(
        db
          .select({ id: schema.userDeleted.id })
          .from(schema.userDeleted)
          .where(eq(schema.userDeleted.userId, schema.member.userId)),
      ),
      notExists(
        db
          .select({ id: schema.companyDeleted.id })
          .from(schema.companyDeleted)
          .where(eq(schema.companyDeleted.companyId, schema.member.companyId)),
      ),
      notExists(
        db
          .select({ id: schema.memberRoleDeleted.id })
          .from(schema.memberRoleDeleted)
          .where(
            eq(
              schema.memberRoleDeleted.memberRoleId,
              schema.member.memberRoleId,
            ),
          ),
      ),
    );

  return {
    find: async ({
      where,
      orderBy,
      limit,
      offset,
      trx,
    }: FindMembersParams = {}) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const baseQuery = client
        .select(memberListSelect)
        .from(schema.member)
        .leftJoin(schema.user, eq(schema.member.userId, schema.user.id))
        .leftJoin(
          schema.company,
          eq(schema.member.companyId, schema.company.id),
        )
        .leftJoin(
          schema.memberRole,
          eq(schema.member.memberRoleId, schema.memberRole.id),
        )
        .$dynamic();

      const query = applyOrderByHelper(
        applyFiltersAndPaginationHelper(baseQuery, {
          where: whereClause,
          limit,
          offset,
        }),
        schema.member,
        orderBy,
      );

      return await query;
    },

    findById: async (id: string, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(
        eq(schema.member.id, id),
        buildNotDeletedWhere(),
      );
      const result = await client
        .select(memberListSelect)
        .from(schema.member)
        .leftJoin(schema.user, eq(schema.member.userId, schema.user.id))
        .leftJoin(
          schema.company,
          eq(schema.member.companyId, schema.company.id),
        )
        .leftJoin(
          schema.memberRole,
          eq(schema.member.memberRoleId, schema.memberRole.id),
        )
        .where(whereClause)
        .limit(1);

      return result[0] || null;
    },

    findSelectOptionsByTenantId: async (tenantId: string, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(
        eq(schema.member.tenantId, tenantId),
        buildNotDeletedWhere(),
      );

      const result = await client
        .select(memberSelectOptionSelect)
        .from(schema.member)
        .innerJoin(schema.user, eq(schema.member.userId, schema.user.id))
        .where(whereClause)
        .orderBy(asc(schema.user.name));

      return result;
    },

    isDeleted: async (id: string, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .select({ id: schema.memberDeleted.id })
        .from(schema.memberDeleted)
        .where(eq(schema.memberDeleted.memberId, id))
        .limit(1);

      return result.length > 0;
    },

    count: async (where?: SQL, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const query = client
        .select({ count: count() })
        .from(schema.member)
        .leftJoin(schema.user, eq(schema.member.userId, schema.user.id))
        .$dynamic();

      const finalQuery = whereClause ? query.where(whereClause) : query;
      const result = await finalQuery;
      return result[0]?.count || 0;
    },

    create: async (input: CreateMemberInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .insert(schema.member)
        .values(input)
        .returning();
      return result[0];
    },

    update: async (id: string, input: UpdateMemberInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .update(schema.member)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.member.id, id))
        .returning();

      if (result.length === 0) {
        throw new HTTPException(404, { message: "Member not found" });
      }

      return result[0];
    },

    /**
     * メンバーを削除します（論理削除: deleted テーブルに記録）
     * @param id - 削除するメンバーのID
     * @param trx - トランザクション（任意）
     * @returns 削除成功の真偽値
     */
    delete: async (id: string, tenantId: string, trx?: Client) => {
      const client = trx || db;
      await client.insert(schema.memberDeleted).values({
        memberId: id,
        tenantId: tenantId,
      });
      return true;
    },
  };
};

export type MemberRepository = ReturnType<typeof memberRepository>;

export type Repository = {
  memberRepository: MemberRepository;
};
