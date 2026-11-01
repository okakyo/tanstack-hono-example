import * as v from "valibot";
import { userEntitySchema } from "./users.entity";

export const getUsersQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
});

export const createUserDtoSchema = v.pick(userEntitySchema, [
  "authUserId",
  "name",
  "email",
]);

export const updateUserDtoSchema = v.pick(userEntitySchema, [
  "id",
  "name",
  "email",
]);

export type GetUsersQueryDto = v.InferOutput<typeof getUsersQueryDtoSchema>;
export type CreateUserDto = v.InferOutput<typeof createUserDtoSchema>;
export type UpdateUserDto = v.InferOutput<typeof updateUserDtoSchema>;
