import * as v from "valibot";

/**
 * ドメインの正規表現として持つメンバー。
 * テナント内でのユーザー状態を表し、境界の DTO と分離する。
 */
export const memberEntitySchema = v.object({
  id: v.string(),
  tenantId: v.string(),
  userId: v.string(),
  companyId: v.string(),
  memberRoleId: v.string(),
  bio: v.optional(v.nullable(v.string())),
  inviteStatusId: v.string(),
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

export type MemberEntity = v.InferOutput<typeof memberEntitySchema>;
