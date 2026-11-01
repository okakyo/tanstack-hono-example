import type * as v from "valibot";
import { companyDeletedEntitySchema } from "./company-deleted.entity";

export const companyDeletedResponseSchema = companyDeletedEntitySchema;
export const createCompanyDeletedResponseSchema = companyDeletedResponseSchema;
export const findCompanyDeletedByIdResponseSchema =
  companyDeletedResponseSchema;
export const updateCompanyDeletedResponseSchema = companyDeletedResponseSchema;

export type CompanyDeletedResponse = v.InferOutput<
  typeof companyDeletedResponseSchema
>;
export type CreateCompanyDeletedResponse = v.InferOutput<
  typeof createCompanyDeletedResponseSchema
>;
export type FindCompanyDeletedByIdResponse = v.InferOutput<
  typeof findCompanyDeletedByIdResponseSchema
>;
export type UpdateCompanyDeletedResponse = v.InferOutput<
  typeof updateCompanyDeletedResponseSchema
>;
