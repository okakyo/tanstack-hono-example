import * as v from "valibot";

/**
 * 最終アクセス済みテナントエンティティスキーマ
 */
export const latestAccessedTenantEntitySchema = v.object({
  id: v.string(),
  userId: v.string(),
  tenantId: v.string(),
  accessedAt: v.optional(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  createdAt: v.optional(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  updatedAt: v.optional(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  createdBy: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export type LatestAccessedTenantEntity = v.InferOutput<
  typeof latestAccessedTenantEntitySchema
>;
