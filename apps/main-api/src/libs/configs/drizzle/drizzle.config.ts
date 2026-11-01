import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/migrations/schema.ts",
  out: "./drizzle/migrations",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
