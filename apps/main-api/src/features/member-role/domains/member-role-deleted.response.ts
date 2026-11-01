import type * as v from "valibot";
import { memberRoleDeletedEntitySchema } from "./member-role-deleted.entity";

export const memberRoleDeletedResponseSchema = memberRoleDeletedEntitySchema;
export const createMemberRoleDeletedResponseSchema =
  memberRoleDeletedResponseSchema;
export const findMemberRoleDeletedByIdResponseSchema =
  memberRoleDeletedResponseSchema;
export const updateMemberRoleDeletedResponseSchema =
  memberRoleDeletedResponseSchema;

export type MemberRoleDeletedResponse = v.InferOutput<
  typeof memberRoleDeletedResponseSchema
>;
export type CreateMemberRoleDeletedResponse = v.InferOutput<
  typeof createMemberRoleDeletedResponseSchema
>;
export type FindMemberRoleDeletedByIdResponse = v.InferOutput<
  typeof findMemberRoleDeletedByIdResponseSchema
>;
export type UpdateMemberRoleDeletedResponse = v.InferOutput<
  typeof updateMemberRoleDeletedResponseSchema
>;
