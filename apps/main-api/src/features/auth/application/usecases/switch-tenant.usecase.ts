import * as schema from "@db/migrations/schema";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { err, ok, type Result } from "neverthrow";
import type { AuthRepository } from "@/features/auth/auth.repository";

export type SwitchTenantInput = {
  authUserId: string;
  tenantId: string;
};

export type SwitchTenantResponse = {
  success: true;
  tenantId: string;
  message: string;
};

export type SwitchTenantResult = Result<SwitchTenantResponse, HTTPException>;

export const switchTenantUseCase = async (
  input: SwitchTenantInput,
  repository: AuthRepository,
): Promise<SwitchTenantResult> => {
  try {
    const loggedInUser = await repository.userRepository.findByAuthUserId(
      input.authUserId,
    );

    if (!loggedInUser) {
      return err(
        new HTTPException(404, { message: "ユーザーが見つかりません。" }),
      );
    }

    const members = await repository.memberRepository.find({
      where: and(
        eq(schema.member.userId, loggedInUser.id),
        eq(schema.member.tenantId, input.tenantId),
      ),
    });

    if (members.length === 0) {
      return err(
        new HTTPException(403, {
          message: "指定されたテナントに所属していません。",
        }),
      );
    }

    await repository.latestAccessedTenantRepository.upsertAccess(
      loggedInUser.id,
      input.tenantId,
    );

    return ok({
      success: true,
      tenantId: input.tenantId,
      message: "テナントを切り替えました",
    });
  } catch (_error) {
    return err(
      new HTTPException(500, {
        message:
          _error instanceof Error ? _error.message : "Internal server error",
      }),
    );
  }
};
