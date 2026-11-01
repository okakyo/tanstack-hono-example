import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type CompanyPlanEntity,
  companyPlanEntitySchema,
} from "@/features/company/domains/company.entity";
import type { CompanyPlanRepository } from "@/features/company-plan/company-plan.repository";
import type { UpdateCompanyPlanDto } from "@/features/company-plan/domains/company-plan.input";

/**
 * 会社プランを更新するユースケース
 * 削除された会社プランは更新できません
 * @param input - 更新する会社プランの情報
 * @param repository - リポジトリ
 * @returns 更新された会社プラン
 */
export const updateCompanyPlanUsecase = async (
  input: UpdateCompanyPlanDto,
  repository: CompanyPlanRepository,
): Promise<Result<CompanyPlanEntity, HTTPException>> => {
  try {
    // 削除された会社プランは更新できない
    const isDeleted = await repository.isDeleted(input.id);
    if (isDeleted) {
      return err(
        new HTTPException(400, {
          message: "Cannot update deleted company plan",
        }),
      );
    }

    const updatedCompanyPlan = await repository.update(input.id, {
      name: input.name,
      description: input.description,
      updatedBy: input.updatedBy,
    });

    if (!updatedCompanyPlan) {
      return err(new HTTPException(404, { message: "Company plan not found" }));
    }

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedCompanyPlan = v.safeParse(companyPlanEntitySchema, {
      ...updatedCompanyPlan,
      createdAt: updatedCompanyPlan.createdAt,
      updatedAt: updatedCompanyPlan.updatedAt,
    });

    if (!parsedCompanyPlan.success) {
      return err(
        new HTTPException(500, {
          message: "Updated company plan data is invalid",
        }),
      );
    }

    return ok(parsedCompanyPlan.output);
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to update company plan" }),
    );
  }
};
