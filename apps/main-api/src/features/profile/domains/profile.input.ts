import * as v from "valibot";
import { profileEntitySchema } from "./profile.entity";

/**
 * プロフィール一覧取得用クエリDTO
 */
export const getProfilesQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  tenantId: v.optional(v.string()),
  memberId: v.optional(v.string()),
});

/**
 * プロフィール作成用DTO
 */
export const createProfileDtoSchema = v.pick(profileEntitySchema, [
  "tenantId",
  "memberId",
]);

/**
 * プロフィール更新用DTO
 */
export const updateProfileDtoSchema = v.object({
  id: v.string(),
  tenantId: v.optional(v.string()),
  memberId: v.optional(v.string()),
});

export type GetProfilesQueryDto = v.InferOutput<
  typeof getProfilesQueryDtoSchema
>;
export type CreateProfileDto = v.InferOutput<typeof createProfileDtoSchema>;
export type UpdateProfileDto = v.InferOutput<typeof updateProfileDtoSchema>;
