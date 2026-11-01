import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type TenantEntity,
  tenantEntitySchema,
} from "@/features/tenant/domains/tenant.entity";
import type { UpdateTenantDto } from "@/features/tenant/domains/tenant.input";
import type { Repository } from "@/features/tenant/tenant.repository";

/**
 * テナントを更新するユースケース
 * 削除されたテナントは更新できません
 * @param input - 更新するテナントの情報
 * @param repository - リポジトリ
 * @returns 更新されたテナント
 */
export const updateTenantUsecase = async (
  input: UpdateTenantDto,
  repository: Repository,
): Promise<Result<TenantEntity, HTTPException>> => {
  try {
    // 削除されたテナントは更新できない
    const isDeleted = await repository.tenantRepository.isDeleted(input.id);
    if (isDeleted) {
      return err(
        new HTTPException(400, { message: "Cannot update deleted tenant" }),
      );
    }

    const updatedTenant = await repository.tenantRepository.update(input.id, {
      name: input.name,
      supabaseTenantId: input.companyId,
      updatedBy: input.updatedBy,
    });

    if (!updatedTenant) {
      return err(new HTTPException(404, { message: "Tenant not found" }));
    }

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedTenant = v.safeParse(tenantEntitySchema, {
      ...updatedTenant,
      companyId: updatedTenant.supabaseTenantId,
      createdAt: updatedTenant.createdAt,
      updatedAt: updatedTenant.updatedAt,
    });

    if (!parsedTenant.success) {
      return err(
        new HTTPException(500, {
          message: "Updated tenant data is invalid",
        }),
      );
    }

    return ok(parsedTenant.output);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to update tenant" }));
  }
};
