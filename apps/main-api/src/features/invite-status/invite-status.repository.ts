import type { Client } from "@db/index";
import * as schema from "@db/migrations/schema";

/**
 * 招待状態マスタを取得します。
 */
export const inviteStatusRepository = (db: Client) => {
  return {
    find: async () => {
      return await db.select().from(schema.inviteStatus);
    },
  };
};

export type InviteStatusRepository = ReturnType<typeof inviteStatusRepository>;
