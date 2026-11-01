import type * as v from "valibot";
import { userEntitySchema } from "./users.entity";

// ユーザーレスポンススキーマ
export const userResponseSchema = userEntitySchema;

// レスポンススキーマ
export const registerUserResponseSchema = userResponseSchema;
export const findUserByIdResponseSchema = userResponseSchema;

export type RegisterUserResponse = v.InferOutput<
  typeof registerUserResponseSchema
>;
export type FindUserByIdResponse = v.InferOutput<
  typeof findUserByIdResponseSchema
>;
