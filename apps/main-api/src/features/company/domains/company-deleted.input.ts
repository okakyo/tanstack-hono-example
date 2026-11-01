import * as v from "valibot";
import { companyDeletedEntitySchema } from "./company-deleted.entity";

export const getCompanyDeletedQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  page: v.optional(v.pipe(v.number(), v.minValue(1))),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  companyId: v.optional(v.string()),
  tenantId: v.optional(v.string()),
});

export const createCompanyDeletedDtoSchema = v.pick(
  companyDeletedEntitySchema,
  ["companyId", "tenantId", "createdBy", "updatedBy"],
);

export const updateCompanyDeletedDtoSchema = v.object({
  id: v.string(),
  companyId: v.optional(v.string()),
  tenantId: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export const deleteCompanyDeletedDtoSchema = v.object({
  id: v.string(),
});

export const getCompanyDeletedByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetCompanyDeletedQueryDto = v.InferOutput<
  typeof getCompanyDeletedQueryDtoSchema
>;
export type CreateCompanyDeletedDto = v.InferOutput<
  typeof createCompanyDeletedDtoSchema
>;
export type UpdateCompanyDeletedDto = v.InferOutput<
  typeof updateCompanyDeletedDtoSchema
>;
export type DeleteCompanyDeletedDto = v.InferOutput<
  typeof deleteCompanyDeletedDtoSchema
>;
export type GetCompanyDeletedByIdDto = v.InferOutput<
  typeof getCompanyDeletedByIdDtoSchema
>;
