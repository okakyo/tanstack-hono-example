import * as v from "valibot";

/**
 * 境界層の DTO。
 * HTTP / repository とやり取りする最小の入力契約。
 */
export const getMemberRolesQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  role: v.optional(v.string()),
});

/**
 * メンバーロール作成用DTO
 */
export const createMemberRoleDtoSchema = v.object({
  role: v.string(),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  createdBy: v.string(),
});

export const createMemberRoleRequestSchema = v.omit(createMemberRoleDtoSchema, [
  "createdBy",
]);

/**
 * メンバーロール更新用DTO
 */
export const updateMemberRoleDtoSchema = v.object({
  id: v.string(),
  role: v.optional(v.string()),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  updatedBy: v.string(),
});

export const updateMemberRoleRequestSchema = v.omit(updateMemberRoleDtoSchema, [
  "id",
  "updatedBy",
]);

/**
 * メンバーロール削除用DTO
 */
export const deleteMemberRoleDtoSchema = v.object({
  id: v.string(),
});

/**
 * メンバーロール単体取得用DTO
 */
export const getMemberRoleByIdDtoSchema = v.object({
  id: v.string(),
});

export const memberRoleQuerySchema = getMemberRolesQueryDtoSchema;

export type GetMemberRolesQueryDto = v.InferOutput<
  typeof getMemberRolesQueryDtoSchema
>;
export type CreateMemberRoleDto = v.InferOutput<
  typeof createMemberRoleDtoSchema
>;
export type CreateMemberRoleRequest = v.InferOutput<
  typeof createMemberRoleRequestSchema
>;
export type UpdateMemberRoleDto = v.InferOutput<
  typeof updateMemberRoleDtoSchema
>;
export type UpdateMemberRoleRequest = v.InferOutput<
  typeof updateMemberRoleRequestSchema
>;
export type DeleteMemberRoleDto = v.InferOutput<
  typeof deleteMemberRoleDtoSchema
>;
export type GetMemberRoleByIdDto = v.InferOutput<
  typeof getMemberRoleByIdDtoSchema
>;
