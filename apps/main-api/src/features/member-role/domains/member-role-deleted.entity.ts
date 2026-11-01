import * as v from "valibot";

/**
 * メンバーロール削除履歴エンティティスキーマ
 */
export const memberRoleDeletedEntitySchema = v.object({
  id: v.string(),
  memberRoleId: v.string(),
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

export type MemberRoleDeletedEntity = v.InferOutput<
  typeof memberRoleDeletedEntitySchema
>;
