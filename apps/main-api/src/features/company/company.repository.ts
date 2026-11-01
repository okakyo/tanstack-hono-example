import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";
import { and, count, eq, notExists, type SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import {
  applyFiltersAndPaginationHelper,
  applyOrderByHelper,
  combineWhereClauses,
  type SortCondition,
} from "@/libs/utils/queryBuilder";

type FindCompaniesParams = {
  where?: SQL;
  orderBy?: SortCondition[];
  limit?: number;
  offset?: number;
  trx?: Client;
};

type CreateCompanyInput = {
  name: string;
  tenantId: string;
  companyPlanId?: string | null;
  isSupplier?: boolean;
  phone?: string | null;
  address?: string | null;
  thumbnail?: string | null;
};

type UpdateCompanyInput = Partial<CreateCompanyInput>;

export const companyRepository = (db: Client) => {
  const buildNotDeletedWhere = () =>
    notExists(
      db
        .select({ id: schema.companyDeleted.id })
        .from(schema.companyDeleted)
        .where(eq(schema.companyDeleted.companyId, schema.company.id)),
    );

  return {
    /**
     * 会社一覧を取得します
     */
    find: async ({
      where,
      orderBy,
      limit,
      offset,
      trx,
    }: FindCompaniesParams = {}) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const baseQuery = client
        .select()
        .from(schema.company)
        .leftJoin(
          schema.companyPlan,
          eq(schema.company.companyPlanId, schema.companyPlan.id),
        )
        .$dynamic();

      const query = applyOrderByHelper(
        applyFiltersAndPaginationHelper(baseQuery, {
          where: whereClause,
          limit,
          offset,
        }),
        schema.company,
        orderBy,
      );

      return await query;
    },

    /**
     * IDで会社を取得します
     */
    findById: async (
      id: string,
      tenantIdOrTrx?: string | Client,
      trx?: Client,
    ) => {
      const tenantId =
        typeof tenantIdOrTrx === "string" ? tenantIdOrTrx : undefined;
      const client =
        (typeof tenantIdOrTrx === "string" ? trx : tenantIdOrTrx) || db;
      const whereClauses = [eq(schema.company.id, id)];

      if (tenantId) {
        whereClauses.push(eq(schema.company.tenantId, tenantId));
      }

      const result = await client
        .select()
        .from(schema.company)
        .leftJoin(
          schema.companyPlan,
          eq(schema.company.companyPlanId, schema.companyPlan.id),
        )
        .where(and(...whereClauses))
        .limit(1);

      return result[0] || null;
    },

    /**
     * 削除されているかチェックします
     */
    isDeleted: async (id: string, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .select({ id: schema.companyDeleted.id })
        .from(schema.companyDeleted)
        .where(eq(schema.companyDeleted.companyId, id))
        .limit(1);

      return result.length > 0;
    },

    /**
     * 会社数をカウントします
     */
    count: async (where?: SQL, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const query = client
        .select({ count: count() })
        .from(schema.company)
        .$dynamic();

      const finalQuery = whereClause ? query.where(whereClause) : query;
      const result = await finalQuery;
      return result[0]?.count || 0;
    },

    /**
     * 会社を作成します
     */
    create: async (input: CreateCompanyInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .insert(schema.company)
        .values({
          ...input,
          companyPlanId: input.companyPlanId ?? null,
          isSupplier: input.isSupplier ?? false,
        })
        .returning();
      return result[0];
    },

    /**
     * 会社を更新します（削除チェック付き）
     */
    update: async (id: string, input: UpdateCompanyInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .update(schema.company)
        .set({
          ...input,
          isSupplier: input.isSupplier ?? undefined,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.company.id, id))
        .returning();

      if (result.length === 0) {
        throw new HTTPException(404, { message: "Company not found" });
      }

      return result[0];
    },

    /**
     * 会社を削除します（論理削除: deleted テーブルに記録）
     * @param id - 削除する会社のID
     * @param trx - トランザクション（任意）
     * @returns 削除成功の真偽値
     */
    delete: async (id: string, tenantId: string, trx?: Client) => {
      const client = trx || db;
      await client.insert(schema.companyDeleted).values({
        tenantId: tenantId,
        companyId: id,
      });
      return true;
    },
  };
};

export type CompanyRepository = ReturnType<typeof companyRepository>;
