import { relations } from "drizzle-orm/relations";
import { tenant, user, latestAccessedTenant,  member, memberRole, company, inviteStatus, profile, companyPlan } from "./schema";


export const tenantRelations = relations(tenant, ({many}) => ({
	latestAccessedTenants: many(latestAccessedTenant),
	members: many(member),
	profiles: many(profile),
	companies: many(company),
}));

export const latestAccessedTenantRelations = relations(latestAccessedTenant, ({one}) => ({
	user: one(user, {
		fields: [latestAccessedTenant.userId],
		references: [user.id]
	}),
	tenant: one(tenant, {
		fields: [latestAccessedTenant.tenantId],
		references: [tenant.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	latestAccessedTenants: many(latestAccessedTenant),
	members: many(member),
}));

export const memberRelations = relations(member, ({one, many}) => ({
	tenant: one(tenant, {
		fields: [member.tenantId],
		references: [tenant.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	}),
	memberRole: one(memberRole, {
		fields: [member.memberRoleId],
		references: [memberRole.id]
	}),
	company: one(company, {
		fields: [member.companyId],
		references: [company.id]
	}),
	inviteStatus: one(inviteStatus, {
		fields: [member.inviteStatusId],
		references: [inviteStatus.id]
	}),
	profiles: many(profile),
}));

export const memberRoleRelations = relations(memberRole, ({many}) => ({
	members: many(member),
}));

export const companyRelations = relations(company, ({one, many}) => ({
	members: many(member),
	companyPlan: one(companyPlan, {
		fields: [company.companyPlanId],
		references: [companyPlan.id]
	}),
	tenant: one(tenant, {
		fields: [company.tenantId],
		references: [tenant.id]
  }),
}));

export const inviteStatusRelations = relations(inviteStatus, ({many}) => ({
	members: many(member),
}));

export const profileRelations = relations(profile, ({one}) => ({
	member: one(member, {
		fields: [profile.memberId],
		references: [member.id]
	}),
	tenant: one(tenant, {
		fields: [profile.tenantId],
		references: [tenant.id]
	}),
}));

export const companyPlanRelations = relations(companyPlan, ({many}) => ({
	companies: many(company),
}));
