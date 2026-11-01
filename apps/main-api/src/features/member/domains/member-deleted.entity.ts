import * as v from "valibot";

/**
 * メンバー削除履歴エンティティスキーマ
 */
export const memberDeletedEntitySchema = v.object({
  id: v.string(),
  memberId: v.string(),
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

export type MemberDeletedEntity = v.InferOutput<
  typeof memberDeletedEntitySchema
>;
