import * as v from "valibot";
import { userDeletedEntitySchema } from "./user-deleted.entity";

export const getUserDeletedQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  userId: v.optional(v.string()),
});

export const createUserDeletedDtoSchema = v.pick(userDeletedEntitySchema, [
  "userId",
  "createdBy",
  "updatedBy",
]);

export const updateUserDeletedDtoSchema = v.object({
  id: v.string(),
  userId: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteUserDeletedDtoSchema = v.object({
  id: v.string(),
});

export const getUserDeletedByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetUserDeletedQueryDto = v.InferOutput<
  typeof getUserDeletedQueryDtoSchema
>;
export type CreateUserDeletedDto = v.InferOutput<
  typeof createUserDeletedDtoSchema
>;
export type UpdateUserDeletedDto = v.InferOutput<
  typeof updateUserDeletedDtoSchema
>;
export type DeleteUserDeletedDto = v.InferOutput<
  typeof deleteUserDeletedDtoSchema
>;
export type GetUserDeletedByIdDto = v.InferOutput<
  typeof getUserDeletedByIdDtoSchema
>;
