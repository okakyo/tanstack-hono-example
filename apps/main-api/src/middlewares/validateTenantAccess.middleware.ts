import * as schema from "@db/migrations/schema";
import { and, eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "@/app.env";

import { verifySupabaseToken } from "@/middlewares/verifyJwt.middleware";
import { createTenantTransactionExecutor } from "./createRepository.middleware";

const TENANT_NOT_MEMBER_MESSAGE = "指定されたテナントに所属していません。";
const TENANT_ID_HEADER = "X-Tenant-Id";

/**
 * 認証済みユーザーIDとテナントIDをコンテキストへ注入します。
 */
export const validateTenantAccessMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    let jwtPayload = c.get("jwtPayload")?.payload;

    if (!jwtPayload) {
      const authorizationHeader = c.req.header("Authorization");
      const bearerToken = authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.replace("Bearer ", "").trim()
        : undefined;

      if (!bearerToken) {
        throw new HTTPException(401, {
          message: "認証情報が見つかりません。",
        });
      }

      const verifiedJwtPayload = await verifySupabaseToken(bearerToken);
      if (!verifiedJwtPayload) {
        throw new HTTPException(401, {
          message: "認証情報が見つかりません。",
        });
      }

      jwtPayload = verifiedJwtPayload;
      c.set("jwtPayload", { payload: jwtPayload });
    }

    const repository = c.get("repository");

    if (!repository) {
      throw new HTTPException(500, {
        message: "リポジトリの初期化に失敗しました。",
      });
    }

    const requestedTenantId = c.req.header(TENANT_ID_HEADER);
    const { memberRepository, userRepository } = repository;
    const executeTransaction = createTenantTransactionExecutor(
      repository,
      requestedTenantId,
    );
    const jwtAuthUserId = jwtPayload.sub ? String(jwtPayload.sub) : "";

    if (!requestedTenantId) {
      throw new HTTPException(400, {
        message: `${TENANT_ID_HEADER} ヘッダーは必須です。`,
      });
    }

    if (!jwtAuthUserId) {
      throw new HTTPException(401, {
        message: "トークンにユーザーIDが含まれていません。",
      });
    }
    const dbUser = await userRepository.findByAuthUserId(jwtAuthUserId);

    if (!dbUser) {
      throw new HTTPException(404, {
        message: "ユーザーが見つかりません。",
      });
    }

    const tenantMemberships = await executeTransaction(async (trx) => {
      return await memberRepository.find({
        where: and(
          eq(schema.member.userId, dbUser.id),
          eq(schema.member.tenantId, requestedTenantId),
        ),
        trx,
      });
    });

    if (tenantMemberships.length === 0) {
      throw new HTTPException(403, {
        message: TENANT_NOT_MEMBER_MESSAGE,
      });
    }

    c.set("authUserId", jwtAuthUserId);
    c.set("tenantId", requestedTenantId);

    await next();
  },
);
