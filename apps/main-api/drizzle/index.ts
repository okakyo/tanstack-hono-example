import dotenv from "dotenv";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import {
  type PostgresJsDatabase,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./migrations";

dotenv.config();

export const connectDatabase = () => {

  const databaseUrl = process.env.DATABASE_URL || "";
  let postgresClient: ReturnType<typeof postgres> | undefined;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  if (process.env.NODE_ENV !== "production") {
    if (!global.postgresClient) {
      global.postgresClient = postgres(databaseUrl);
    }
    postgresClient = global.postgresClient;
  } else {
    postgresClient = postgres(databaseUrl);
  }
  return postgresClient;
};

declare namespace global {
  let postgresClient: ReturnType<typeof postgres> | undefined;
}

export type Client = PostgresJsDatabase<typeof schema>;
export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
  >;

export type TransactionExecutor = <T>(
  callback: (trx: Transaction) => Promise<T>,
) => Promise<T>;
