import * as v from "valibot";

/**
 * プロフィールエンティティスキーマ
 * メンバーに紐づくプロフィール情報を表します
 */
export const profileEntitySchema = v.object({
  id: v.string(),
  tenantId: v.string(),
  memberId: v.string(),
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

export type ProfileEntity = v.InferOutput<typeof profileEntitySchema>;
