import * as v from "valibot";
import { companyEntitySchema } from "../../company/domains/company.entity";
import { memberRoleEntitySchema } from "../../member-role/domains/member-role.entity";
import { userEntitySchema } from "../../user/domains/users.entity";
import { memberEntitySchema } from "./member.entity";

/**
 * メンバーレスポンススキーマ
 */
export const memberResponseSchema = memberEntitySchema;

/**
 * メンバー一覧レスポンススキーマ
 * メンバー本体に関連情報（ユーザー・企業・ロール）を含みます
 */
export const memberListItemResponseSchema = v.object({
  ...v.pick(memberEntitySchema, [
    "id",
    "tenantId",
    "userId",
    "companyId",
    "memberRoleId",
    "inviteStatusId",
    "updatedAt",
  ]).entries,
  user: v.nullable(v.pick(userEntitySchema, ["id", "name", "email"])),
  company: v.nullable(v.pick(companyEntitySchema, ["id", "name"])),
  memberRole: v.nullable(
    v.pick(memberRoleEntitySchema, ["id", "role", "description"]),
  ),
});

/**
 * Select 用メンバー一覧レスポンス
 */
export const memberSelectOptionResponseSchema = v.object({
  id: v.string(),
  name: v.string(),
});

/**
 * メンバー作成レスポンス
 */
export const createMemberResponseSchema = memberResponseSchema;

/**
 * メンバー検索レスポンス
 */
export const findMemberByIdResponseSchema = memberListItemResponseSchema;

/**
 * メンバー更新レスポンス
 */
export const updateMemberResponseSchema = memberResponseSchema;

export type MemberResponse = v.InferOutput<typeof memberResponseSchema>;
export type CreateMemberResponse = v.InferOutput<
  typeof createMemberResponseSchema
>;
export type FindMemberByIdResponse = v.InferOutput<
  typeof findMemberByIdResponseSchema
>;
export type UpdateMemberResponse = v.InferOutput<
  typeof updateMemberResponseSchema
>;
export type MemberListItemResponse = v.InferOutput<
  typeof memberListItemResponseSchema
>;
export type MemberSelectOptionResponse = v.InferOutput<
  typeof memberSelectOptionResponseSchema
>;

// 型エイリアス(使いやすさのため)
export type MemberListItemEntity = MemberListItemResponse;
export type MemberSelectOptionEntity = MemberSelectOptionResponse;
