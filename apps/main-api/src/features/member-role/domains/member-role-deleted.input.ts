import * as v from "valibot";
import { memberRoleDeletedEntitySchema } from "./member-role-deleted.entity";

export const getMemberRoleDeletedQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  memberRoleId: v.optional(v.string()),
});

export const createMemberRoleDeletedDtoSchema = v.pick(
  memberRoleDeletedEntitySchema,
  ["memberRoleId", "createdBy", "updatedBy"],
);

export const updateMemberRoleDeletedDtoSchema = v.object({
  id: v.string(),
  memberRoleId: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteMemberRoleDeletedDtoSchema = v.object({
  id: v.string(),
});

export const getMemberRoleDeletedByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetMemberRoleDeletedQueryDto = v.InferOutput<
  typeof getMemberRoleDeletedQueryDtoSchema
>;
export type CreateMemberRoleDeletedDto = v.InferOutput<
  typeof createMemberRoleDeletedDtoSchema
>;
export type UpdateMemberRoleDeletedDto = v.InferOutput<
  typeof updateMemberRoleDeletedDtoSchema
>;
export type DeleteMemberRoleDeletedDto = v.InferOutput<
  typeof deleteMemberRoleDeletedDtoSchema
>;
export type GetMemberRoleDeletedByIdDto = v.InferOutput<
  typeof getMemberRoleDeletedByIdDtoSchema
>;
