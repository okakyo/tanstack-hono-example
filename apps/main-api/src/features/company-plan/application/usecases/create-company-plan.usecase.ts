import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type CompanyPlanEntity,
  companyEntitySchema,
} from "@/features/company/domains/company.entity";
import type { CompanyPlanRepository } from "@/features/company-plan/company-plan.repository";
import type { CreateCompanyPlanDto } from "@/features/company-plan/domains/company-plan.input";
/**
 * 会社プランを作成するユースケース
 * @param input - 作成する会社プランの情報
 * @param repository - リポジトリ
 * @returns 作成された会社プラン
 */
export const createCompanyPlanUsecase = async (
  input: CreateCompanyPlanDto,
  repository: CompanyPlanRepository,
): Promise<Result<CompanyPlanEntity, HTTPException>> => {
  try {
    const newCompanyPlan = await repository.create({
      name: input.name,
      description: input.description,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
    });

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedCompanyPlan = v.safeParse(companyEntitySchema, {
      ...newCompanyPlan,
      createdAt: newCompanyPlan.createdAt,
      updatedAt: newCompanyPlan.updatedAt,
    });

    if (!parsedCompanyPlan.success) {
      return err(
        new HTTPException(500, {
          message: "Created company plan data is invalid",
        }),
      );
    }

    return ok({
      ...newCompanyPlan,
      createdAt: newCompanyPlan.createdAt,
      updatedAt: newCompanyPlan.updatedAt,
    });
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to create company plan" }),
    );
  }
};
