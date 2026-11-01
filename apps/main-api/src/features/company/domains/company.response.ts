import type * as v from "valibot";
import { companyEntitySchema } from "./company.entity";

/**
 * API レスポンスは Domain Entity をそのまま返すか、必要に応じて一部を制限する。
 * この層では重複した schema を持たず、Entity をベースに軽く定義する。
 */
export const companyResponseSchema = companyEntitySchema;
export const createCompanyResponseSchema = companyResponseSchema;
export const findCompanyByIdResponseSchema = companyResponseSchema;
export const updateCompanyResponseSchema = companyResponseSchema;

export type CompanyResponse = v.InferOutput<typeof companyResponseSchema>;
export type CreateCompanyResponse = v.InferOutput<
  typeof createCompanyResponseSchema
>;
export type FindCompanyByIdResponse = v.InferOutput<
  typeof findCompanyByIdResponseSchema
>;
export type UpdateCompanyResponse = v.InferOutput<
  typeof updateCompanyResponseSchema
>;
