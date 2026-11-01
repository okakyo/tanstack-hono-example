import * as v from "valibot";

/**
 * ドメインの正規表現として持つユーザー。
 * API の入力や DB の生データと同一ではなく、業務上の不変条件を表す。
 */
export const userEntitySchema = v.object({
  id: v.string(),
  authUserId: v.string(),
  tenantId: v.optional(v.string()),
  name: v.string(),
  email: v.string(),
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

export type UserEntity = v.InferOutput<typeof userEntitySchema>;
