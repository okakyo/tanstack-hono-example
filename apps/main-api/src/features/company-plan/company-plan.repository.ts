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

type FindCompanyPlansParams = {
  where?: SQL;
  orderBy?: SortCondition[];
  limit?: number;
  offset?: number;
  trx?: Client;
};

type CreateCompanyPlanInput = {
  name: string;
  description?: string | null;
  createdBy?: string;
  updatedBy?: string;
};

type UpdateCompanyPlanInput = Partial<
  Omit<CreateCompanyPlanInput, "createdBy">
>;

export const companyPlanRepository = (db: Client) => {
  const buildNotDeletedWhere = () =>
    notExists(
      db
        .select({ id: schema.companyPlanDeleted.id })
        .from(schema.companyPlanDeleted)
        .where(
          eq(schema.companyPlanDeleted.companyPlanId, schema.companyPlan.id),
        ),
    );

  return {
    find: async ({
      where,
      orderBy,
      limit,
      offset,
      trx,
    }: FindCompanyPlansParams = {}) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const baseQuery = client.select().from(schema.companyPlan).$dynamic();

      const query = applyOrderByHelper(
        applyFiltersAndPaginationHelper(baseQuery, {
          where: whereClause,
          limit,
          offset,
        }),
        schema.companyPlan,
        orderBy,
      );

      return await query;
    },

    findById: async (id: string, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .select()
        .from(schema.companyPlan)
        .where(eq(schema.companyPlan.id, id))
        .limit(1);

      return result[0] || null;
    },

    isDeleted: async (id: string, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .select({ id: schema.companyPlanDeleted.id })
        .from(schema.companyPlanDeleted)
        .where(eq(schema.companyPlanDeleted.companyPlanId, id))
        .limit(1);

      return result.length > 0;
    },

    count: async (where?: SQL, trx?: Client) => {
      const client = trx || db;
      const whereClause = combineWhereClauses(where, buildNotDeletedWhere());
      const query = client
        .select({ count: count() })
        .from(schema.companyPlan)
        .$dynamic();

      const finalQuery = whereClause ? query.where(whereClause) : query;
      const result = await finalQuery;
      return result[0]?.count || 0;
    },

    create: async (input: CreateCompanyPlanInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .insert(schema.companyPlan)
        .values(input)
        .returning();
      return result[0];
    },

    update: async (id: string, input: UpdateCompanyPlanInput, trx?: Client) => {
      const client = trx || db;
      const result = await client
        .update(schema.companyPlan)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.companyPlan.id, id))
        .returning();

      if (result.length === 0) {
        throw new HTTPException(404, { message: "CompanyPlan not found" });
      }

      return result[0];
    },

    /**
     * 企業プランを削除します（論理削除: deleted テーブルに記録）
     * @param id - 削除する企業プランのID
     * @param trx - トランザクション（任意）
     * @returns 削除成功の真偽値
     */
    delete: async (id: string, trx?: Client) => {
      const client = trx || db;
      await client.insert(schema.companyPlanDeleted).values({
        companyPlanId: id,
      });
      return true;
    },
  };
};

export type CompanyPlanRepository = ReturnType<typeof companyPlanRepository>;

export type Repository = {
  companyPlanRepository: CompanyPlanRepository;
};
