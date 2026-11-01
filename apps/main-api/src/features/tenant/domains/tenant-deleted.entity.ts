import * as v from "valibot";

/**
 * テナント削除履歴エンティティスキーマ
 */
export const tenantDeletedEntitySchema = v.object({
  id: v.string(),
  tenantId: v.string(),
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

export type TenantDeletedEntity = v.InferOutput<
  typeof tenantDeletedEntitySchema
>;
