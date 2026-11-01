import { HTTPException } from "hono/http-exception";
import { err, ok, type Result } from "neverthrow";
import type { AuthRepository } from "@/features/auth/auth.repository";
import { resolveCurrentTenantId } from "@/features/auth/auth.repository";

export type GetAuthUserTenantsResponse = {
  tenants: Array<{
    tenantId: string;
    tenantName: string;
    companyId: string;
    companyName: string;
    memberRole: string;
  }>;
};

export type GetAuthUserTenantsResult = Result<
  GetAuthUserTenantsResponse,
  HTTPException
>;

export const getAuthUserTenantsUseCase = async (
  authUserId: string,
  repository: AuthRepository,
): Promise<GetAuthUserTenantsResult> => {
  try {
    const loggedInUser =
      await repository.userRepository.findByAuthUserIdWithMembers(authUserId);

    if (!loggedInUser) {
      return err(
        new HTTPException(404, { message: "ユーザーが見つかりません。" }),
      );
    }

    if (loggedInUser.members.length === 0) {
      return err(
        new HTTPException(403, {
          message:
            "所属テナント情報が見つかりません。再度ログインしてください。",
        }),
      );
    }

    const currentTenantId = await resolveCurrentTenantId(
      loggedInUser.id,
      loggedInUser.members.map((member) => member.tenantId),
      repository.latestAccessedTenantRepository,
    );

    return ok({
      tenants: loggedInUser.members
        .filter((member) => member.tenantId !== currentTenantId)
        .map((member) => ({
          tenantId: member.tenantId,
          tenantName: member.tenant.name,
          companyId: member.company.id,
          companyName: member.company.name,
          memberRole: member.memberRole.role,
        })),
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
