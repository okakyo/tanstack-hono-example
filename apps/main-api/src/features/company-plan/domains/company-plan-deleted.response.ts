import type * as v from "valibot";
import { companyPlanDeletedEntitySchema } from "./company-plan-deleted.entity";

export const companyPlanDeletedResponseSchema = companyPlanDeletedEntitySchema;
export const createCompanyPlanDeletedResponseSchema =
  companyPlanDeletedResponseSchema;
export const findCompanyPlanDeletedByIdResponseSchema =
  companyPlanDeletedResponseSchema;
export const updateCompanyPlanDeletedResponseSchema =
  companyPlanDeletedResponseSchema;

export type CompanyPlanDeletedResponse = v.InferOutput<
  typeof companyPlanDeletedResponseSchema
>;
export type CreateCompanyPlanDeletedResponse = v.InferOutput<
  typeof createCompanyPlanDeletedResponseSchema
>;
export type FindCompanyPlanDeletedByIdResponse = v.InferOutput<
  typeof findCompanyPlanDeletedByIdResponseSchema
>;
export type UpdateCompanyPlanDeletedResponse = v.InferOutput<
  typeof updateCompanyPlanDeletedResponseSchema
>;
