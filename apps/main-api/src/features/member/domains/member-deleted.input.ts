import * as v from "valibot";
import { memberDeletedEntitySchema } from "./member-deleted.entity";

export const getMemberDeletedQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  memberId: v.optional(v.string()),
  tenantId: v.optional(v.string()),
});

export const createMemberDeletedDtoSchema = v.pick(memberDeletedEntitySchema, [
  "memberId",
  "tenantId",
  "createdBy",
  "updatedBy",
]);

export const updateMemberDeletedDtoSchema = v.object({
  id: v.string(),
  memberId: v.optional(v.string()),
  tenantId: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteMemberDeletedDtoSchema = v.object({
  id: v.string(),
});

export const getMemberDeletedByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetMemberDeletedQueryDto = v.InferOutput<
  typeof getMemberDeletedQueryDtoSchema
>;
export type CreateMemberDeletedDto = v.InferOutput<
  typeof createMemberDeletedDtoSchema
>;
export type UpdateMemberDeletedDto = v.InferOutput<
  typeof updateMemberDeletedDtoSchema
>;
export type DeleteMemberDeletedDto = v.InferOutput<
  typeof deleteMemberDeletedDtoSchema
>;
export type GetMemberDeletedByIdDto = v.InferOutput<
  typeof getMemberDeletedByIdDtoSchema
>;
