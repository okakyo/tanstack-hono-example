import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthUserUseCase } from "./get-auth-user.usecase";
import { switchTenantUseCase } from "./switch-tenant.usecase";

describe("auth usecases", () => {
  const repository = {
    userRepository: {
      findByAuthUserIdWithMembers: vi.fn(),
      findByAuthUserId: vi.fn(),
    },
    memberRepository: {
      find: vi.fn(),
    },
    latestAccessedTenantRepository: {
      findLatestByUserId: vi.fn(),
      upsertAccess: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ログインユーザーの現在テナント情報を取得できる", async () => {
    repository.userRepository.findByAuthUserIdWithMembers.mockResolvedValue({
      id: "user-1",
      name: "山田太郎",
      members: [
        {
          tenantId: "tenant-1",
          company: { id: "company-1", name: "テスト会社" },
          tenant: { id: "tenant-1", name: "テストテナント" },
          memberRole: { role: "admin" },
        },
      ],
    });
    repository.latestAccessedTenantRepository.findLatestByUserId.mockResolvedValue(
      null,
    );
    repository.latestAccessedTenantRepository.upsertAccess.mockResolvedValue({
      tenantId: "tenant-1",
    });

    const result = await getAuthUserUseCase("auth-user-1", repository);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      id: "user-1",
      name: "山田太郎",
      currentTenantId: "tenant-1",
      currentCompanyId: "company-1",
      currentTenantName: "テストテナント",
      companyName: "テスト会社",
      memberRole: "admin",
    });
  });

  it("テナント切り替えが成功する", async () => {
    repository.userRepository.findByAuthUserId.mockResolvedValue({
      id: "user-1",
      name: "山田太郎",
      email: "user@example.com",
    });
    repository.memberRepository.find.mockResolvedValue([{ id: "member-1" }]);
    repository.latestAccessedTenantRepository.upsertAccess.mockResolvedValue({
      tenantId: "tenant-2",
    });

    const result = await switchTenantUseCase(
      { authUserId: "auth-user-1", tenantId: "tenant-2" },
      repository,
    );

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      success: true,
      tenantId: "tenant-2",
      message: "テナントを切り替えました",
    });
  });
});
