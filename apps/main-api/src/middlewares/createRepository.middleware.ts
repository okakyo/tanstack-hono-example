import type { TransactionExecutor } from "@db/index";
import { sql } from "drizzle-orm";
import type { createRepository } from "@/repositories";

export const TENANT_ID_HEADER = "X-Tenant-Id";
const TENANT_SETTING_KEY = "app.current_tenant_id";

type Repository = ReturnType<typeof createRepository>;

/**
 * 必要なときだけ tenant 設定済みトランザクションを実行するためのヘルパー。
 */
export const createTenantTransactionExecutor = (
  repository: Repository,
  tenantId?: string,
): TransactionExecutor => {
  return async (callback) => {
    if (!tenantId) {
      return await repository.executeTransaction(callback);
    }

    return await repository.executeTransaction(async (trx) => {
      await trx.execute(
        sql`SELECT set_config(${TENANT_SETTING_KEY}, ${tenantId}, true);`,
      );

      return await callback(trx);
    });
  };
};
