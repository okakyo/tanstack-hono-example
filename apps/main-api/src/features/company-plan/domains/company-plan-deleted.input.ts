import * as v from "valibot";
import { companyPlanDeletedEntitySchema } from "./company-plan-deleted.entity";

export const getCompanyPlanDeletedQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  companyPlanId: v.optional(v.string()),
});

export const createCompanyPlanDeletedDtoSchema = v.pick(
  companyPlanDeletedEntitySchema,
  ["companyPlanId", "createdBy", "updatedBy"],
);

export const updateCompanyPlanDeletedDtoSchema = v.object({
  id: v.string(),
  companyPlanId: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteCompanyPlanDeletedDtoSchema = v.object({
  id: v.string(),
});

export const getCompanyPlanDeletedByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetCompanyPlanDeletedQueryDto = v.InferOutput<
  typeof getCompanyPlanDeletedQueryDtoSchema
>;
export type CreateCompanyPlanDeletedDto = v.InferOutput<
  typeof createCompanyPlanDeletedDtoSchema
>;
export type UpdateCompanyPlanDeletedDto = v.InferOutput<
  typeof updateCompanyPlanDeletedDtoSchema
>;
export type DeleteCompanyPlanDeletedDto = v.InferOutput<
  typeof deleteCompanyPlanDeletedDtoSchema
>;
export type GetCompanyPlanDeletedByIdDto = v.InferOutput<
  typeof getCompanyPlanDeletedByIdDtoSchema
>;
