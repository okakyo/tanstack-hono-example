import type * as v from "valibot";
import { tenantDeletedEntitySchema } from "./tenant-deleted.entity";

export const tenantDeletedResponseSchema = tenantDeletedEntitySchema;
export const createTenantDeletedResponseSchema = tenantDeletedResponseSchema;
export const findTenantDeletedByIdResponseSchema = tenantDeletedResponseSchema;
export const updateTenantDeletedResponseSchema = tenantDeletedResponseSchema;

export type TenantDeletedResponse = v.InferOutput<
  typeof tenantDeletedResponseSchema
>;
export type CreateTenantDeletedResponse = v.InferOutput<
  typeof createTenantDeletedResponseSchema
>;
export type FindTenantDeletedByIdResponse = v.InferOutput<
  typeof findTenantDeletedByIdResponseSchema
>;
export type UpdateTenantDeletedResponse = v.InferOutput<
  typeof updateTenantDeletedResponseSchema
>;
