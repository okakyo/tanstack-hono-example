import * as v from "valibot";

export const authUserEntitySchema = v.object({
  id: v.string(),
  name: v.string(),
  currentTenantId: v.string(),
  currentCompanyId: v.string(),
  currentTenantName: v.string(),
  companyName: v.string(),
  memberRole: v.string(),
});

export const authTenantEntitySchema = v.object({
  tenantId: v.string(),
  tenantName: v.string(),
  companyId: v.string(),
  companyName: v.string(),
  memberRole: v.string(),
});

export const authUserTenantsEntitySchema = v.object({
  tenants: v.array(authTenantEntitySchema),
});

export const authProfileEntitySchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
});

export const switchTenantEntitySchema = v.object({
  success: v.literal(true),
  tenantId: v.string(),
  message: v.string(),
});

export type AuthUserEntity = v.InferOutput<typeof authUserEntitySchema>;
export type AuthTenantEntity = v.InferOutput<typeof authTenantEntitySchema>;
export type AuthUserTenantsEntity = v.InferOutput<
  typeof authUserTenantsEntitySchema
>;
export type AuthProfileEntity = v.InferOutput<typeof authProfileEntitySchema>;
export type SwitchTenantEntity = v.InferOutput<typeof switchTenantEntitySchema>;
