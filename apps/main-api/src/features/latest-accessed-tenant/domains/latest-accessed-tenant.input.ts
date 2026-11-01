import * as v from "valibot";
import { latestAccessedTenantEntitySchema } from "./latest-accessed-tenant.entity";

export const getLatestAccessedTenantsQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  userId: v.optional(v.string()),
  tenantId: v.optional(v.string()),
});

export const createLatestAccessedTenantDtoSchema = v.pick(
  latestAccessedTenantEntitySchema,
  ["userId", "tenantId", "accessedAt", "createdBy", "updatedBy"],
);

export const updateLatestAccessedTenantDtoSchema = v.object({
  id: v.string(),
  accessedAt: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteLatestAccessedTenantDtoSchema = v.object({
  id: v.string(),
});

export const getLatestAccessedTenantByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetLatestAccessedTenantsQueryDto = v.InferOutput<
  typeof getLatestAccessedTenantsQueryDtoSchema
>;
export type CreateLatestAccessedTenantDto = v.InferOutput<
  typeof createLatestAccessedTenantDtoSchema
>;
export type UpdateLatestAccessedTenantDto = v.InferOutput<
  typeof updateLatestAccessedTenantDtoSchema
>;
export type DeleteLatestAccessedTenantDto = v.InferOutput<
  typeof deleteLatestAccessedTenantDtoSchema
>;
export type GetLatestAccessedTenantByIdDto = v.InferOutput<
  typeof getLatestAccessedTenantByIdDtoSchema
>;
