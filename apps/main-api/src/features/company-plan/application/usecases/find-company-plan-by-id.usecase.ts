import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { CompanyPlanEntity } from "@/features/company/domains/company.entity";
import type { CompanyPlanRepository } from "@/features/company-plan/company-plan.repository";
import type { GetCompanyPlanByIdDto } from "@/features/company-plan/domains/company-plan.input";

/**
 * IDで会社プランを取得するユースケース
 * @param input - 取得する会社プランのID
 * @param repository - リポジトリ
 * @returns 会社プラン
 */
export const findCompanyPlanByIdUsecase = async (
  input: GetCompanyPlanByIdDto,
  repository: CompanyPlanRepository,
): Promise<Result<CompanyPlanEntity, HTTPException>> => {
  try {
    const companyPlan = await repository.findById(input.id);

    if (!companyPlan) {
      return err(new HTTPException(404, { message: "Company plan not found" }));
    }

    return ok({
      ...companyPlan,
      createdAt: companyPlan.createdAt,
      updatedAt: companyPlan.updatedAt,
    });
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to find company plan" }),
    );
  }
};
