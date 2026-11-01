import { HTTPException } from "hono/http-exception";
import { err, ok, type Result } from "neverthrow";
import type { AuthRepository } from "@/features/auth/auth.repository";
import { resolveCurrentTenantId } from "@/features/auth/auth.repository";

export type GetAuthUserResponse = {
  id: string;
  name: string;
  currentTenantId: string;
  currentCompanyId: string;
  currentTenantName: string;
  companyName: string;
  memberRole: string;
};

export type GetAuthUserResult = Result<GetAuthUserResponse, HTTPException>;

export const getAuthUserUseCase = async (
  authUserId: string,
  repository: AuthRepository,
): Promise<GetAuthUserResult> => {
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

    const currentTenant = loggedInUser.members.find(
      (member) => member.tenantId === currentTenantId,
    );

    if (!currentTenant || !currentTenantId) {
      return err(
        new HTTPException(403, {
          message: "現在のテナント情報が無効です。再度ログインしてください。",
        }),
      );
    }

    return ok({
      id: loggedInUser.id,
      name: loggedInUser.name,
      currentTenantId,
      currentCompanyId: currentTenant.company.id,
      currentTenantName: currentTenant.tenant.name,
      companyName: currentTenant.company.name,
      memberRole: currentTenant.memberRole.role,
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
