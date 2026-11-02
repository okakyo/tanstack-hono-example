import * as v from "valibot";

const INVALID_INTEGER_MESSAGE = "整数を指定してください";
const MIN_PAGE_VALUE = 1;
const MAX_LIMIT_VALUE = 100;

const queryIntegerSchema = v.pipe(
  v.union([v.string(), v.number()]),
  v.transform((input) => (typeof input === "number" ? input : Number(input))),
  v.check((input) => Number.isInteger(input), INVALID_INTEGER_MESSAGE),
  v.minValue(MIN_PAGE_VALUE),
);

/**
 * 境界層の DTO。
 * API / repository との受け渡しに使う最小の入力契約。
 */
export const getMembersQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(queryIntegerSchema, v.maxValue(MAX_LIMIT_VALUE))),
  page: v.optional(queryIntegerSchema),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  tenantId: v.optional(v.string()),
  userId: v.optional(v.string()),
  companyId: v.optional(v.string()),
  memberRoleId: v.optional(v.string()),
  inviteStatusId: v.optional(v.string()),
  name: v.optional(v.string()),
});

/**
 * メンバー作成用DTO
 */
export const createMemberDtoSchema = v.object({
  tenantId: v.string(),
  userId: v.string(),
  companyId: v.string(),
  memberRoleId: v.string(),
  bio: v.optional(v.nullable(v.string())),
  inviteStatusId: v.optional(v.string()),
  createdBy: v.string(),
});

export const createMemberRequestSchema = v.object({
  email: v.pipe(
    v.string(),
    v.email("有効なメールアドレスを指定してください。"),
  ),
  memberRoleId: v.string(),
  inviteStatusId: v.optional(v.string()),
});

/**
 * メンバー更新用DTO
 */
export const updateMemberDtoSchema = v.object({
  id: v.string(),
  name: v.optional(v.string()),
  email: v.optional(
    v.pipe(v.string(), v.email("有効なメールアドレスを指定してください。")),
  ),
  memberRoleId: v.optional(v.string()),
  bio: v.optional(v.nullable(v.string())),
  inviteStatusId: v.optional(v.string()),
  updatedBy: v.string(),
});

export const updateMemberRequestSchema = v.object({
  name: v.optional(v.string()),
  email: v.optional(
    v.pipe(v.string(), v.email("有効なメールアドレスを指定してください。")),
  ),
  memberRoleId: v.optional(v.string()),
  inviteStatusId: v.optional(v.string()),
});

/**
 * メンバー削除用DTO
 */
export const deleteMemberDtoSchema = v.object({
  id: v.string(),
});

/**
 * メンバー単体取得用DTO
 */
export const getMemberByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetMembersQueryDto = v.InferOutput<typeof getMembersQueryDtoSchema>;
export type CreateMemberDto = v.InferOutput<typeof createMemberDtoSchema>;
export type UpdateMemberDto = v.InferOutput<typeof updateMemberDtoSchema>;
export type DeleteMemberDto = v.InferOutput<typeof deleteMemberDtoSchema>;
export type GetMemberByIdDto = v.InferOutput<typeof getMemberByIdDtoSchema>;
