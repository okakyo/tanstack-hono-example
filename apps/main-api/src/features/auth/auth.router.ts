/**
 * 認証関連の API ルーター
 *
 * ユーザーの認証情報を管理するエンドポイントを提供します。
 * - ユーザー情報の取得
 * - 所属テナント一覧の取得
 * - テナント切り替え
 */

import { vValidator } from "@hono/valibot-validator";
import { type Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "@/app.env";
import { handleResult } from "@/libs/utils/responseHelper";
import { verifyJwtMiddleware } from "@/middlewares/verifyJwt.middleware";
import type { AuthModule } from "./auth.module";
import { switchTenantRequestSchema } from "./domains/auth.input";

const USER_ID_NOT_FOUND_MESSAGE = "トークンにユーザーIDが含まれていません。";

const resolveAuthUserId = (c: Context<AppEnv>): string => {
  const authUserId = c.get("jwtPayload")?.payload.sub;
  if (!authUserId) {
    throw new HTTPException(401, {
      message: USER_ID_NOT_FOUND_MESSAGE,
    });
  }

  return authUserId;
};

/**
 * GET /auth/user
 * ログインユーザーの基本情報と現在の所属テナント情報を取得
 */
export const authRouter = (module: AuthModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", verifyJwtMiddleware);
  app.use("*", module);

  return app
    .get("/user", async (c) => {
      const authService = c.get("authService");
      const authUserId = resolveAuthUserId(c);

      const result = await authService.getUser(authUserId);
      return handleResult(c, result);
    })
    .get("/user/tenants", async (c) => {
      const authService = c.get("authService");
      const authUserId = resolveAuthUserId(c);

      const result = await authService.getUserTenants(authUserId);
      return handleResult(c, result);
    })
    .get("/user/profile", async (c) => {
      const authService = c.get("authService");
      const authUserId = resolveAuthUserId(c);

      const result = await authService.getProfile(authUserId);
      return handleResult(c, result);
    })
    .post(
      "/user/switch-tenant",
      vValidator("json", switchTenantRequestSchema),
      async (c) => {
        const authService = c.get("authService");
        const authUserId = resolveAuthUserId(c);
        const body = c.req.valid("json");

        const result = await authService.switchTenant(
          authUserId,
          body.tenantId,
        );

        return handleResult(c, result, 200, "テナントを切り替えました");
      },
    );
};
