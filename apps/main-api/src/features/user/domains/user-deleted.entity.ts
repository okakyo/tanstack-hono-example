import * as v from "valibot";

/**
 * ユーザー削除履歴エンティティスキーマ
 */
export const userDeletedEntitySchema = v.object({
  id: v.string(),
  userId: v.string(),
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

export type UserDeletedEntity = v.InferOutput<typeof userDeletedEntitySchema>;
