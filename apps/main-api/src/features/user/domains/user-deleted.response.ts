import type * as v from "valibot";
import { userDeletedEntitySchema } from "./user-deleted.entity";

export const userDeletedResponseSchema = userDeletedEntitySchema;
export const createUserDeletedResponseSchema = userDeletedResponseSchema;
export const findUserDeletedByIdResponseSchema = userDeletedResponseSchema;
export const updateUserDeletedResponseSchema = userDeletedResponseSchema;

export type UserDeletedResponse = v.InferOutput<
  typeof userDeletedResponseSchema
>;
export type CreateUserDeletedResponse = v.InferOutput<
  typeof createUserDeletedResponseSchema
>;
export type FindUserDeletedByIdResponse = v.InferOutput<
  typeof findUserDeletedByIdResponseSchema
>;
export type UpdateUserDeletedResponse = v.InferOutput<
  typeof updateUserDeletedResponseSchema
>;
