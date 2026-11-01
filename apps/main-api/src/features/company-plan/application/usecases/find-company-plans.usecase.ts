import * as schema from "@db/migrations/schema";

import { like } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { CompanyPlanEntity } from "@/features/company/domains/company.entity";
import type { CompanyPlanRepository } from "@/features/company-plan/company-plan.repository";
import type { GetCompanyPlansQueryDto } from "@/features/company-plan/domains/company-plan.input";

type Output = {
  companyPlans: CompanyPlanEntity[];
  total: number;
  page: number;
  limit: number;
};

/**
 * 会社プラン一覧を取得するユースケース
 * @param input - 検索条件とページネーション
 * @param repository - リポジトリ
 * @returns 会社プラン一覧と総数
 */
export const findCompanyPlansUsecase = async (
  input: GetCompanyPlansQueryDto,
  repository: CompanyPlanRepository,
): Promise<Result<Output, HTTPException>> => {
  try {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;
    const offset = (page - 1) * limit;

    const where = input.name
      ? like(schema.companyPlan.name, `%${input.name}%`)
      : undefined;

    const companyPlans = await repository.find({
      where,
      limit,
      offset,
    });

    const total = await repository.count(where);

    return ok({
      companyPlans: companyPlans.map((plan) => ({
        ...plan,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to find company plans" }),
    );
  }
};
