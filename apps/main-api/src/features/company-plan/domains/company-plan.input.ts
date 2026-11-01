import * as v from "valibot";

/**
 * 境界層の DTO。
 * HTTP / repository との受け渡しに使う最小のクエリ契約。
 */
export const getCompanyPlansQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  name: v.optional(v.string()),
});

/**
 * 企業プラン作成用DTO
 */
export const createCompanyPlanDtoSchema = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.string(),
});

/**
 * 企業プラン更新用DTO
 */
export const updateCompanyPlanDtoSchema = v.object({
  id: v.string(),
  name: v.optional(v.string()),
  description: v.optional(v.nullable(v.string())),
  updatedBy: v.string(),
});

/**
 * 企業プラン削除用DTO
 */
export const deleteCompanyPlanDtoSchema = v.object({
  id: v.string(),
});

/**
 * 企業プラン単体取得用DTO
 */
export const getCompanyPlanByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetCompanyPlansQueryDto = v.InferOutput<
  typeof getCompanyPlansQueryDtoSchema
>;
export type CreateCompanyPlanDto = v.InferOutput<
  typeof createCompanyPlanDtoSchema
>;
export type UpdateCompanyPlanDto = v.InferOutput<
  typeof updateCompanyPlanDtoSchema
>;
export type DeleteCompanyPlanDto = v.InferOutput<
  typeof deleteCompanyPlanDtoSchema
>;
export type GetCompanyPlanByIdDto = v.InferOutput<
  typeof getCompanyPlanByIdDtoSchema
>;
