import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type TenantEntity,
  tenantEntitySchema,
} from "@/features/tenant/domains/tenant.entity";
import type { CreateTenantDto } from "@/features/tenant/domains/tenant.input";
import type { Repository } from "@/features/tenant/tenant.repository";

/**
 * テナントを作成するユースケース
 * @param input - 作成するテナントの情報
 * @param repository - リポジトリ
 * @returns 作成されたテナント
 */
export const createTenantUsecase = async (
  input: CreateTenantDto,
  repository: Repository,
): Promise<Result<TenantEntity, HTTPException>> => {
  try {
    const newTenant = await repository.tenantRepository.create({
      name: input.name,
      supabaseTenantId: input.companyId,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
    });

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedTenant = v.safeParse(tenantEntitySchema, {
      ...newTenant,
      companyId: newTenant.supabaseTenantId,
      createdAt: newTenant.createdAt,
      updatedAt: newTenant.updatedAt,
    });

    if (!parsedTenant.success) {
      return err(
        new HTTPException(500, {
          message: "Created tenant data is invalid",
        }),
      );
    }

    return ok(parsedTenant.output);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to create tenant" }));
  }
};
