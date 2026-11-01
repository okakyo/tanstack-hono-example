import * as v from "valibot";

/**
 * 企業削除履歴エンティティスキーマ
 */
export const companyDeletedEntitySchema = v.object({
  id: v.string(),
  companyId: v.string(),
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

export type CompanyDeletedEntity = v.InferOutput<
  typeof companyDeletedEntitySchema
>;
