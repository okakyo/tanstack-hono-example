import type * as v from "valibot";
import { profileEntitySchema } from "./profile.entity";

/**
 * プロフィールレスポンススキーマ
 */
export const profileResponseSchema = profileEntitySchema;

/**
 * プロフィール作成レスポンス
 */
export const createProfileResponseSchema = profileResponseSchema;

/**
 * プロフィール検索レスポンス
 */
export const findProfileByIdResponseSchema = profileResponseSchema;

/**
 * プロフィール更新レスポンス
 */
export const updateProfileResponseSchema = profileResponseSchema;

export type ProfileResponse = v.InferOutput<typeof profileResponseSchema>;
export type CreateProfileResponse = v.InferOutput<
  typeof createProfileResponseSchema
>;
export type FindProfileByIdResponse = v.InferOutput<
  typeof findProfileByIdResponseSchema
>;
export type UpdateProfileResponse = v.InferOutput<
  typeof updateProfileResponseSchema
>;
