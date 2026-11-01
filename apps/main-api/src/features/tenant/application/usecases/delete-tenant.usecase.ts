import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { DeleteTenantDto } from "@/features/tenant/domains/tenant.input";
import type { Repository } from "@/features/tenant/tenant.repository";

/**
 * テナントを削除するユースケース
 * ソフトデリート方式で、deleted テーブルに記録されます
 * @param input - 削除するテナントのID
 * @param repository - リポジトリ
 * @returns 削除成功の真偽値
 */
export const deleteTenantUsecase = async (
  input: DeleteTenantDto,
  repository: Repository,
): Promise<Result<boolean, HTTPException>> => {
  try {
    // テナントが存在するか確認
    const tenant = await repository.tenantRepository.findById(input.id);
    if (!tenant) {
      return err(new HTTPException(404, { message: "Tenant not found" }));
    }

    // ソフトデリート実行
    const result = await repository.tenantRepository.delete(input.id);
    return ok(result);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to delete tenant" }));
  }
};
