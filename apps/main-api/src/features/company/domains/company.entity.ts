import * as v from "valibot";

/**
 * ドメインの正規表現として持つ企業の関連情報。
 * 外部入力や DB の生データと同一ではなく、業務上の意味を持つ値だけを定義する。
 */
export const companyPlanEntitySchema = v.object({
  id: v.string(),
  name: v.string(),
});

export const companyEntitySchema = v.object({
  id: v.string(),
  name: v.string(),
  companyPlan: v.nullable(companyPlanEntitySchema),
  isSupplier: v.boolean(),
  phone: v.nullable(v.string()),
  address: v.nullable(v.string()),
  thumbnail: v.nullable(v.string()),
  createdAt: v.pipe(
    v.string(),
    v.transform((value) => new Date(value).toISOString()),
  ),
  updatedAt: v.pipe(
    v.string(),
    v.transform((value) => new Date(value).toISOString()),
  ),
  createdBy: v.string(),
  updatedBy: v.string(),
});

export type CompanyPlanEntity = v.InferOutput<typeof companyPlanEntitySchema>;
export type CompanyEntity = v.InferOutput<typeof companyEntitySchema>;
