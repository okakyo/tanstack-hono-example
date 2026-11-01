CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"phone" varchar(20),
	"address" varchar(512),
	"thumbnail" varchar(512),
	"company_plan_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"is_parent" boolean DEFAULT false NOT NULL,
	"is_supplier" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "company_deleted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_deleted" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "company_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(256) DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" varchar(256) DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_plan_deleted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_plan_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_status" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	CONSTRAINT "invite_status_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "latest_accessed_tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"accessed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	CONSTRAINT "user_tenant_unique" UNIQUE("user_id","tenant_id")
);
--> statement-breakpoint
ALTER TABLE "latest_accessed_tenant" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"member_role_id" uuid NOT NULL,
	"bio" varchar(2048),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"invite_status_id" uuid DEFAULT '00000000-0000-0000-0000-000000000101' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "member_deleted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_deleted" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "member_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_role_deleted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_tenant_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_deleted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	CONSTRAINT "user_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_deleted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"updated_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_company_plan_id_company_plan_id_fk" FOREIGN KEY ("company_plan_id") REFERENCES "public"."company_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "latest_accessed_tenant" ADD CONSTRAINT "latest_accessed_tenant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "latest_accessed_tenant" ADD CONSTRAINT "latest_accessed_tenant_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_member_role_id_member_role_id_fk" FOREIGN KEY ("member_role_id") REFERENCES "public"."member_role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_invite_status_id_invite_status_id_fk" FOREIGN KEY ("invite_status_id") REFERENCES "public"."invite_status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_accessed_at" ON "latest_accessed_tenant" USING btree ("user_id" uuid_ops,"accessed_at" uuid_ops);--> statement-breakpoint
CREATE POLICY "company_tenant_isolation" ON "company" AS PERMISSIVE FOR ALL TO public USING ((((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)) AND (NOT (EXISTS ( SELECT 1
   FROM company_deleted cd
  WHERE (((cd.company_id)::text = (company.id)::text) AND ((cd.tenant_id)::text = current_setting('app.current_tenant_id'::text, true)))))))) WITH CHECK (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)));--> statement-breakpoint
CREATE POLICY "company_deleted_tenant_isolation" ON "company_deleted" AS PERMISSIVE FOR ALL TO public USING (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))) WITH CHECK (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)));--> statement-breakpoint
CREATE POLICY "latest_accessed_tenant_isolation" ON "latest_accessed_tenant" AS PERMISSIVE FOR ALL TO public USING (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))) WITH CHECK (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)));--> statement-breakpoint
CREATE POLICY "member_tenant_isolation" ON "member" AS PERMISSIVE FOR ALL TO public USING ((((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)) AND (NOT (EXISTS ( SELECT 1
   FROM member_deleted md
  WHERE (((md.member_id)::text = (member.id)::text) AND ((md.tenant_id)::text = current_setting('app.current_tenant_id'::text, true)))))))) WITH CHECK (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)));--> statement-breakpoint
CREATE POLICY "member_deleted_tenant_isolation" ON "member_deleted" AS PERMISSIVE FOR ALL TO public USING (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))) WITH CHECK (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)));--> statement-breakpoint
CREATE POLICY "profile_tenant_isolation" ON "profile" AS PERMISSIVE FOR ALL TO public USING (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))) WITH CHECK (((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)));