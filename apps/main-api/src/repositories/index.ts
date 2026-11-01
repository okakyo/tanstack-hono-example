import type { Client, Transaction, TransactionExecutor } from "@db/index";
import { connectDatabase } from "@db/index";
import * as schema from "@db/migrations";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import { companyRepository } from "@/features/company/company.repository";
// Import repository modules
import { companyPlanRepository } from "@/features/company-plan/company-plan.repository";
import { inviteStatusRepository } from "@/features/invite-status/invite-status.repository";
import { latestAccessedTenantRepository } from "@/features/latest-accessed-tenant/latest-accessed-tenant.repository";
import { memberRepository } from "@/features/member/member.repository";
import { memberRoleRepository } from "@/features/member-role/member-role.repository";
import { tenantRepository } from "@/features/tenant/tenant.repository";
import { userRepository } from "@/features/user/user.repository";

const drizzleRepositories = (db: PostgresJsDatabase<typeof schema>) => {
  return {
    companyRepository: companyRepository(db),
    companyPlanRepository: companyPlanRepository(db),
    userRepository: userRepository(db),
    inviteStatusRepository: inviteStatusRepository(db),
    latestAccessedTenantRepository: latestAccessedTenantRepository(db),
    memberRepository: memberRepository(db),
    memberRoleRepository: memberRoleRepository(db),
    tenantRepository: tenantRepository(db),
  };
};

export const createRepository = (): Repository => {
  const postgresClient = connectDatabase();
  const db = drizzle(postgresClient, { schema });

  return {
    ...drizzleRepositories(db),
    executeTransaction: createTransactionExecutor(db),
  };
};

export const createTransactionExecutor = (
  db: Client | Transaction,
): TransactionExecutor => {
  return async <T>(callback: (trx: Transaction) => Promise<T>): Promise<T> => {
    return await db.transaction(callback);
  };
};

export type Repository = ReturnType<typeof drizzleRepositories> & {
  executeTransaction: TransactionExecutor;
};
