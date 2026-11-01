import * as v from "valibot";

/**
 * ドメインの正規表現として持つテナント。
 * 組織単位の業務状態を表し、境界の DTO とは分離する。
 */
export const tenantEntitySchema = v.object({
  id: v.string(),
  companyId: v.string(),
  name: v.string(),
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

export type TenantEntity = v.InferOutput<typeof tenantEntitySchema>;
