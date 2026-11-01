import * as v from "valibot";

/**
 * ドメインの正規表現として持つメンバーロール。
 * 外部入力や DB 生データではなく、ロールの状態を表す。
 */
export const memberRoleEntitySchema = v.object({
  id: v.string(),
  role: v.string(),
  description: v.nullish(v.string()),
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

export type MemberRoleEntity = v.InferOutput<typeof memberRoleEntitySchema>;
