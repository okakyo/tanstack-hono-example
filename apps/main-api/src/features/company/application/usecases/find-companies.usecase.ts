import * as schema from "@db/migrations/schema";
import { and, eq, ilike, not } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { CompanyEntity } from "@/features/company/domains/company.entity";
import type { GetCompaniesQueryDto } from "@/features/company/domains/company.input";

import type { CompanyRepository } from "../../company.repository";

export type FindCompaniesResult = Result<
  {
    data: CompanyEntity[];
    count: number;
  },
  HTTPException
>;

type FindCompaniesParams = GetCompaniesQueryDto & {
  tenantId: string;
};

export const findCompaniesUseCase =
  (repository: CompanyRepository) =>
  async (params: FindCompaniesParams): Promise<FindCompaniesResult> => {
    try {
      const limit = params.limit ?? 50;
      const offset = params.page ? (params.page - 1) * limit : 0;
      const orderBy = params.sortBy
        ? [
            {
              field: params.sortBy,
              order: params.orderBy ?? "desc",
            },
          ]
        : undefined;

      const conditions = [];
      if (params.name) {
        conditions.push(ilike(schema.company.name, `%${params.name}%`));
      }
      if (params.companyPlanId) {
        conditions.push(eq(schema.company.companyPlanId, params.companyPlanId));
      }
      if (params.isSupplier !== undefined) {
        conditions.push(eq(schema.company.isSupplier, params.isSupplier));
      }
      if (params.excludeCompanyId) {
        conditions.push(not(eq(schema.company.id, params.excludeCompanyId)));
      }

      conditions.push(eq(schema.company.tenantId, params.tenantId));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, count] = await Promise.all([
        repository.find({ where, orderBy, limit, offset }),
        repository.count(where),
      ]);

      return ok({
        data: data.map(({ company, company_plan }) => ({
          ...company,
          companyPlan: company_plan
            ? {
                id: company_plan.id,
                name: company_plan.name,
              }
            : null,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
        })),
        count,
      });
    } catch (error) {
      return err(
        new HTTPException(500, {
          message:
            error instanceof Error ? error.message : "Internal server error",
        }),
      );
    }
  };
