import * as v from "valibot";

/**
 * ドメインの正規表現として持つ企業プラン。
 * 外部入力や DB 生データではなく、業務上のプラン情報を表す。
 */
export const companyPlanEntitySchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.optional(v.nullable(v.string())),
  createdAt: v.optional(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  updatedAt: v.optional(
    v.pipe(
      v.string(),
      v.transform((d) => new Date(d).toISOString()),
    ),
  ),
  createdBy: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
});

export type CompanyPlanEntity = v.InferOutput<typeof companyPlanEntitySchema>;
