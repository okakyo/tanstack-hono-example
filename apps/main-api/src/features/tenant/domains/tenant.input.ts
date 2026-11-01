import * as v from "valibot";

/**
 * 境界層の DTO。
 * API クエリや create / update の最小入力契約を定義する。
 */
export const getTenantsQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
});

/**
 * テナント作成用DTO
 */
export const createTenantDtoSchema = v.object({
  name: v.string(),
  companyId: v.string(),
  createdBy: v.string(),
});

/**
 * テナント更新用DTO
 */
export const updateTenantDtoSchema = v.object({
  id: v.string(),
  name: v.optional(v.string()),
  companyId: v.optional(v.string()),
  updatedBy: v.string(),
});

/**
 * テナント削除用DTO
 */
export const deleteTenantDtoSchema = v.object({
  id: v.string(),
});

/**
 * テナント単体取得用DTO
 */
export const getTenantByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetTenantsQueryDto = v.InferOutput<typeof getTenantsQueryDtoSchema>;
export type CreateTenantDto = v.InferOutput<typeof createTenantDtoSchema>;
export type UpdateTenantDto = v.InferOutput<typeof updateTenantDtoSchema>;
export type DeleteTenantDto = v.InferOutput<typeof deleteTenantDtoSchema>;
export type GetTenantByIdDto = v.InferOutput<typeof getTenantByIdDtoSchema>;
