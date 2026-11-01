import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { TenantEntity } from "@/features/tenant/domains/tenant.entity";
import type { GetTenantsQueryDto } from "@/features/tenant/domains/tenant.input";
import type { Repository } from "@/features/tenant/tenant.repository";

type Output = {
  tenants: TenantEntity[];
  total: number;
  page: number;
  limit: number;
};

/**
 * テナント一覧を取得するユースケース
 * @param input - 検索条件とページネーション
 * @param repository - リポジトリ
 * @returns テナント一覧と総数
 */
export const findTenantsUsecase = async (
  input: GetTenantsQueryDto,
  repository: Repository,
): Promise<Result<Output, HTTPException>> => {
  try {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;
    const offset = (page - 1) * limit;

    const tenants = await repository.tenantRepository.find({
      limit,
      offset,
    });

    const total = await repository.tenantRepository.count();

    return ok({
      tenants: tenants.map((tenant) => ({
        ...tenant,
        companyId: tenant.supabaseTenantId,
        createdAt: tenant.createdAt?.toString(),
        updatedAt: tenant.updatedAt?.toString(),
      })),
      total,
      page,
      limit,
    });
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to find tenants" }));
  }
};
