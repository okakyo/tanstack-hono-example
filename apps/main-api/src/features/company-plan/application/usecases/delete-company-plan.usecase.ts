import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { CompanyPlanRepository } from "@/features/company-plan/company-plan.repository";
import type { DeleteCompanyPlanDto } from "@/features/company-plan/domains/company-plan.input";

/**
 * 会社プランを削除するユースケース
 * ソフトデリート方式で、deleted テーブルに記録されます
 * @param input - 削除する会社プランのID
 * @param repository - リポジトリ
 * @returns 削除成功の真偽値
 */
export const deleteCompanyPlanUsecase = async (
  input: DeleteCompanyPlanDto,
  repository: CompanyPlanRepository,
): Promise<Result<boolean, HTTPException>> => {
  try {
    // 会社プランが存在するか確認
    const companyPlan = await repository.findById(input.id);
    if (!companyPlan) {
      return err(new HTTPException(404, { message: "Company plan not found" }));
    }

    // ソフトデリート実行
    const result = await repository.delete(input.id);
    return ok(result);
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to delete company plan" }),
    );
  }
};
