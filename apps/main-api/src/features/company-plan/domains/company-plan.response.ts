import type * as v from "valibot";
import { companyPlanEntitySchema } from "./company-plan.entity";

/**
 * 企業プランレスポンススキーマ
 */
export const companyPlanResponseSchema = companyPlanEntitySchema;

/**
 * 企業プラン作成レスポンス
 */
export const createCompanyPlanResponseSchema = companyPlanResponseSchema;

/**
 * 企業プラン検索レスポンス
 */
export const findCompanyPlanByIdResponseSchema = companyPlanResponseSchema;

/**
 * 企業プラン更新レスポンス
 */
export const updateCompanyPlanResponseSchema = companyPlanResponseSchema;

export type CompanyPlanResponse = v.InferOutput<
  typeof companyPlanResponseSchema
>;
export type CreateCompanyPlanResponse = v.InferOutput<
  typeof createCompanyPlanResponseSchema
>;
export type FindCompanyPlanByIdResponse = v.InferOutput<
  typeof findCompanyPlanByIdResponseSchema
>;
export type UpdateCompanyPlanResponse = v.InferOutput<
  typeof updateCompanyPlanResponseSchema
>;
