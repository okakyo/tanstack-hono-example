import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { TenantEntity } from "@/features/tenant/domains/tenant.entity";
import type { GetTenantByIdDto } from "@/features/tenant/domains/tenant.input";
import type { Repository } from "@/features/tenant/tenant.repository";

/**
 * IDでテナントを取得するユースケース
 * @param input - 取得するテナントのID
 * @param repository - リポジトリ
 * @returns テナント
 */
export const findTenantByIdUsecase = async (
  input: GetTenantByIdDto,
  repository: Repository,
): Promise<Result<TenantEntity, HTTPException>> => {
  try {
    const tenant = await repository.tenantRepository.findById(input.id);

    if (!tenant) {
      return err(new HTTPException(404, { message: "Tenant not found" }));
    }

    return ok({
      id: tenant.id,
      companyId: tenant.supabaseTenantId,
      name: tenant.name,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      createdBy: tenant.createdBy,
      updatedBy: tenant.updatedBy,
    });
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to find tenant" }));
  }
};
