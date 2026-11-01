import type * as v from "valibot";
import { memberRoleEntitySchema } from "./member-role.entity";

/**
 * メンバーロールレスポンススキーマ
 */
export const memberRoleResponseSchema = memberRoleEntitySchema;

/**
 * メンバーロール作成レスポンス
 */
export const createMemberRoleResponseSchema = memberRoleResponseSchema;

/**
 * メンバーロール検索レスポンス
 */
export const findMemberRoleByIdResponseSchema = memberRoleResponseSchema;

/**
 * メンバーロール更新レスポンス
 */
export const updateMemberRoleResponseSchema = memberRoleResponseSchema;

export type MemberRoleResponse = v.InferOutput<typeof memberRoleResponseSchema>;
export type CreateMemberRoleResponse = v.InferOutput<
  typeof createMemberRoleResponseSchema
>;
export type FindMemberRoleByIdResponse = v.InferOutput<
  typeof findMemberRoleByIdResponseSchema
>;
export type UpdateMemberRoleResponse = v.InferOutput<
  typeof updateMemberRoleResponseSchema
>;
