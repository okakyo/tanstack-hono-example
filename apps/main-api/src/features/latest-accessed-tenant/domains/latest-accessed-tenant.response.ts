import type * as v from "valibot";
import { latestAccessedTenantEntitySchema } from "./latest-accessed-tenant.entity";

export const latestAccessedTenantResponseSchema =
  latestAccessedTenantEntitySchema;
export const createLatestAccessedTenantResponseSchema =
  latestAccessedTenantResponseSchema;
export const findLatestAccessedTenantByIdResponseSchema =
  latestAccessedTenantResponseSchema;
export const updateLatestAccessedTenantResponseSchema =
  latestAccessedTenantResponseSchema;

export type LatestAccessedTenantResponse = v.InferOutput<
  typeof latestAccessedTenantResponseSchema
>;
export type CreateLatestAccessedTenantResponse = v.InferOutput<
  typeof createLatestAccessedTenantResponseSchema
>;
export type FindLatestAccessedTenantByIdResponse = v.InferOutput<
  typeof findLatestAccessedTenantByIdResponseSchema
>;
export type UpdateLatestAccessedTenantResponse = v.InferOutput<
  typeof updateLatestAccessedTenantResponseSchema
>;
