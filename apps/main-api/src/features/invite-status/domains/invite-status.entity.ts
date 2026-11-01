import * as v from "valibot";

/**
 * 招待状態エンティティスキーマ
 * 招待ワークフローで利用する固定マスタを表します
 */
export const inviteStatusEntitySchema = v.object({
  id: v.string(),
  code: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.nullish(v.string()),
  createdAt: v.nullish(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  updatedAt: v.nullish(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  createdBy: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export type InviteStatusEntity = v.InferOutput<typeof inviteStatusEntitySchema>;
