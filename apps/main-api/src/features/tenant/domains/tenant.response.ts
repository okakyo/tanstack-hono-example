import type * as v from "valibot";
import { tenantEntitySchema } from "./tenant.entity";

/**
 * テナントレスポンススキーマ
 */
export const tenantResponseSchema = tenantEntitySchema;

/**
 * テナント作成レスポンス
 */
export const createTenantResponseSchema = tenantResponseSchema;

/**
 * テナント検索レスポンス
 */
export const findTenantByIdResponseSchema = tenantResponseSchema;

/**
 * テナント更新レスポンス
 */
export const updateTenantResponseSchema = tenantResponseSchema;

export type TenantResponse = v.InferOutput<typeof tenantResponseSchema>;
export type CreateTenantResponse = v.InferOutput<
  typeof createTenantResponseSchema
>;
export type FindTenantByIdResponse = v.InferOutput<
  typeof findTenantByIdResponseSchema
>;
export type UpdateTenantResponse = v.InferOutput<
  typeof updateTenantResponseSchema
>;
