import type { LatestAccessedTenantRepository } from "@/features/latest-accessed-tenant/latest-accessed-tenant.repository";
import type { MemberRepository } from "@/features/member/member.repository";
import type { UserRepository } from "@/features/user/user.repository";

// TODO: 型を Hono RPC, Valibot に置き換える
export type AuthUserMember = {
  tenantId: string;
  company: {
    id: string;
    name: string;
  };
  tenant: {
    id: string;
    name: string;
  };
  memberRole: {
    role: string;
  };
};

export type AuthUserWithMembers = {
  id: string;
  name: string;
  members: AuthUserMember[];
};

export type AuthUserProfile = {
  id: string;
  name: string;
  email: string;
};

export type AuthRepository = {
  userRepository: Pick<
    UserRepository,
    "findByAuthUserIdWithMembers" | "findByAuthUserId"
  >;
  memberRepository: Pick<MemberRepository, "find">;
  latestAccessedTenantRepository: Pick<
    LatestAccessedTenantRepository,
    "findLatestByUserId" | "upsertAccess"
  >;
};

export const resolveCurrentTenantId = async (
  userId: string,
  memberTenantIds: string[],
  latestAccessedTenantRepository: AuthRepository["latestAccessedTenantRepository"],
): Promise<string | null> => {
  const latestAccessedTenant =
    await latestAccessedTenantRepository.findLatestByUserId(userId);

  if (latestAccessedTenant?.tenantId) {
    return latestAccessedTenant.tenantId;
  }

  const fallbackTenantId = memberTenantIds[0];

  if (!fallbackTenantId) {
    return null;
  }

  await latestAccessedTenantRepository.upsertAccess(userId, fallbackTenantId);
  return fallbackTenantId;
};
