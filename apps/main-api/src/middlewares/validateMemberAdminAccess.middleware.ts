import * as schema from "@db/migrations/schema";
import { and, eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "@/app.env";

const ADMIN_ROLE = "管理者";

/**
 * メンバー管理 API の利用者が admin 権限を持つか確認します。
 */
export const validateMemberAdminAccessMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    const repository = c.get("repository");
    const authUserId = c.get("authUserId");
    const tenantId = c.get("tenantId");

    if (!repository) {
      throw new HTTPException(500, {
        message: "リポジトリの初期化に失敗しました。",
      });
    }

    if (!authUserId) {
      throw new HTTPException(401, {
        message: "認証情報が見つかりません。",
      });
    }

    if (!tenantId) {
      throw new HTTPException(400, {
        message: "X-Tenant-Id ヘッダーは必須です。",
      });
    }

    const { memberRepository, userRepository } = repository;
    const dbUser = await userRepository.findByAuthUserId(authUserId);

    if (!dbUser) {
      throw new HTTPException(404, {
        message: "ユーザーが見つかりません。",
      });
    }

    const memberships = await memberRepository.find({
      where: and(
        eq(schema.member.userId, dbUser.id),
        eq(schema.member.tenantId, tenantId),
      ),
    });

    const currentMembership = memberships[0];
    const currentRole = currentMembership?.memberRole?.role;

    if (!currentMembership || !currentRole) {
      throw new HTTPException(403, {
        message: "指定されたテナントに所属していません。",
      });
    }

    if (currentRole !== ADMIN_ROLE) {
      throw new HTTPException(403, {
        message: "メンバー管理は admin 権限を持つユーザーのみ利用できます。",
      });
    }

    await next();
  },
);
