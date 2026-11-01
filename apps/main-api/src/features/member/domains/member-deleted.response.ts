import type * as v from "valibot";
import { memberDeletedEntitySchema } from "./member-deleted.entity";

export const memberDeletedResponseSchema = memberDeletedEntitySchema;
export const createMemberDeletedResponseSchema = memberDeletedResponseSchema;
export const findMemberDeletedByIdResponseSchema = memberDeletedResponseSchema;
export const updateMemberDeletedResponseSchema = memberDeletedResponseSchema;

export type MemberDeletedResponse = v.InferOutput<
  typeof memberDeletedResponseSchema
>;
export type CreateMemberDeletedResponse = v.InferOutput<
  typeof createMemberDeletedResponseSchema
>;
export type FindMemberDeletedByIdResponse = v.InferOutput<
  typeof findMemberDeletedByIdResponseSchema
>;
export type UpdateMemberDeletedResponse = v.InferOutput<
  typeof updateMemberDeletedResponseSchema
>;
