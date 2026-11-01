import * as v from "valibot";
import { tenantDeletedEntitySchema } from "./tenant-deleted.entity";

export const getTenantDeletedQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  tenantId: v.optional(v.string()),
});

export const createTenantDeletedDtoSchema = v.pick(tenantDeletedEntitySchema, [
  "tenantId",
  "createdBy",
  "updatedBy",
]);

export const updateTenantDeletedDtoSchema = v.object({
  id: v.string(),
  tenantId: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteTenantDeletedDtoSchema = v.object({
  id: v.string(),
});

export const getTenantDeletedByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetTenantDeletedQueryDto = v.InferOutput<
  typeof getTenantDeletedQueryDtoSchema
>;
export type CreateTenantDeletedDto = v.InferOutput<
  typeof createTenantDeletedDtoSchema
>;
export type UpdateTenantDeletedDto = v.InferOutput<
  typeof updateTenantDeletedDtoSchema
>;
export type DeleteTenantDeletedDto = v.InferOutput<
  typeof deleteTenantDeletedDtoSchema
>;
export type GetTenantDeletedByIdDto = v.InferOutput<
  typeof getTenantDeletedByIdDtoSchema
>;
