import { pgTable, pgPolicy, uuid, timestamp, varchar, foreignKey, text, unique, index, numeric, boolean, date, bigint, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const companyDeleted = pgTable("company_deleted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	tenantId: uuid("tenant_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
}, (table) => [
	pgPolicy("company_deleted_tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`, withCheck: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`  }),
]);

export const companyPlanDeleted = pgTable("company_plan_deleted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyPlanId: uuid("company_plan_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
});

export const memberDeleted = pgTable("member_deleted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	memberId: uuid("member_id").notNull(),
	tenantId: uuid("tenant_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
}, (table) => [
	pgPolicy("member_deleted_tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`, withCheck: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`  }),
]);

export const memberRoleDeleted = pgTable("member_role_deleted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	memberRoleId: uuid("member_role_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
});

export const tenantDeleted = pgTable("tenant_deleted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tenantId: uuid("tenant_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
});

export const userDeleted = pgTable("user_deleted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
});

export const companyPlan = pgTable("company_plan", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 256 }).notNull(),
	description: varchar({ length: 512 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar("created_by", { length: 256 }).default('00000000-0000-0000-0000-000000000000').notNull(),
	updatedBy: varchar("updated_by", { length: 256 }).default('00000000-0000-0000-0000-000000000000').notNull(),
});

export const tenant = pgTable("tenant", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	supabaseTenantId: varchar("supabase_tenant_id", { length: 256 }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
});

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	authUserId: varchar("auth_user_id", { length: 256 }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	email: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
}, (table) => [
	unique("user_auth_user_id_unique").on(table.authUserId),
	unique("user_email_unique").on(table.email),
]);

export const latestAccessedTenant = pgTable("latest_accessed_tenant", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	tenantId: uuid("tenant_id").notNull(),
	accessedAt: timestamp("accessed_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
}, (table) => [
	index("idx_user_accessed_at").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.accessedAt.desc().nullsFirst()),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "latest_accessed_tenant_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "latest_accessed_tenant_tenant_id_tenant_id_fk"
		}).onDelete("cascade"),
	unique("user_tenant_unique").on(table.userId, table.tenantId),
	pgPolicy("latest_accessed_tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`, withCheck: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`  }),
]);

export const member = pgTable("member", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tenantId: uuid("tenant_id").notNull(),
	userId: uuid("user_id").notNull(),
	companyId: uuid("company_id").notNull(),
	memberRoleId: uuid("member_role_id").notNull(),
	bio: varchar({ length: 2048 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	inviteStatusId: uuid("invite_status_id").default(sql`'00000000-0000-0000-0000-000000000101'`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "member_tenant_id_tenant_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "member_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.memberRoleId],
			foreignColumns: [memberRole.id],
			name: "member_member_role_id_member_role_id_fk"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "member_company_id_company_id_fk"
		}),
	foreignKey({
			columns: [table.inviteStatusId],
			foreignColumns: [inviteStatus.id],
			name: "member_invite_status_id_invite_status_id_fk"
		}),
	pgPolicy("member_tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)) AND (NOT (EXISTS ( SELECT 1
   FROM member_deleted md
  WHERE (((md.member_id)::text = (member.id)::text) AND ((md.tenant_id)::text = current_setting('app.current_tenant_id'::text, true)))))))`, withCheck: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`  }),
]);

export const memberRole = pgTable("member_role", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	role: varchar({ length: 256 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
});

export const inviteStatus = pgTable("invite_status", {
	id: uuid().primaryKey().notNull(),
	code: varchar({ length: 64 }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
}, (table) => [
	unique("invite_status_code_unique").on(table.code),
]);

export const profile = pgTable("profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tenantId: uuid("tenant_id").notNull(),
	memberId: uuid("member_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [member.id],
			name: "profile_member_id_member_id_fk"
		}),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "profile_tenant_id_tenant_id_fk"
		}),
	pgPolicy("profile_tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`, withCheck: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`  }),
]);

export const company = pgTable("company", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tenantId: uuid("tenant_id").notNull(),
	name: varchar({ length: 256 }).notNull(),
	phone: varchar({ length: 20 }),
	address: varchar({ length: 512 }),
	thumbnail: varchar({ length: 512 }),
	companyPlanId: uuid("company_plan_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	updatedBy: uuid("updated_by").default(sql`'00000000-0000-0000-0000-000000000000'`).notNull(),
	isParent: boolean("is_parent").default(false).notNull(),
	isSupplier: boolean("is_supplier").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyPlanId],
			foreignColumns: [companyPlan.id],
			name: "company_company_plan_id_company_plan_id_fk"
		}),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "company_tenant_id_tenant_id_fk"
		}),
	pgPolicy("company_tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)) AND (NOT (EXISTS ( SELECT 1
   FROM company_deleted cd
  WHERE (((cd.company_id)::text = (company.id)::text) AND ((cd.tenant_id)::text = current_setting('app.current_tenant_id'::text, true)))))))`, withCheck: sql`((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`  }),
]);
