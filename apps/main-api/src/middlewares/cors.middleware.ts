import { cors } from "hono/cors";

/**
 * CORS ミドルウェア
 * 許可されたフロントエンドのオリジンを設定し、クロスオリジンリクエストを制御します。
 */

const DEFAULT_FRONTEND_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const CONFIGURED_FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedFrontendOrigins =
  CONFIGURED_FRONTEND_ORIGINS.length > 0
    ? CONFIGURED_FRONTEND_ORIGINS
    : DEFAULT_FRONTEND_ORIGINS;

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) {
      return allowedFrontendOrigins[0] ?? "";
    }

    return allowedFrontendOrigins.includes(origin) ? origin : undefined;
  },
  credentials: true,
});
