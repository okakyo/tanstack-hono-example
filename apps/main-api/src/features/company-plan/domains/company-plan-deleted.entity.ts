import * as v from "valibot";

/**
 * 企業プラン削除履歴エンティティスキーマ
 */
export const companyPlanDeletedEntitySchema = v.object({
  id: v.string(),
  companyPlanId: v.string(),
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

export type CompanyPlanDeletedEntity = v.InferOutput<
  typeof companyPlanDeletedEntitySchema
>;
