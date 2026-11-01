import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSession = vi.fn();
const mockSwitchTenantPost = vi.fn();
const mockGetAuthSession = vi.fn();
const mockSetCurrentTenantCookie = vi.fn();

vi.mock("../supabase.server", () => ({
  createSupabaseServerClient: () => ({
    auth: {
      getSession: mockGetSession,
    },
  }),
}));

vi.mock("@repo/main-api", () => ({
  honoApiClient: {
    auth: {
      user: {
        "switch-tenant": {
          $post: mockSwitchTenantPost,
        },
      },
    },
  },
}));

vi.mock("./getAuthSession.server", () => ({
  getAuthSession: mockGetAuthSession,
}));

vi.mock("./util", async () => {
  const actual = await vi.importActual<typeof import("./util")>("./util");
  return {
    ...actual,
    setCurrentTenantCookie: mockSetCurrentTenantCookie,
  };
});

describe("switchTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when access token is missing", async () => {
    const { switchTenant } = await import("./switchTenant.server");

    mockGetSession.mockResolvedValue({
      data: { session: null },
    });

    await expect(switchTenant("tenant-1")).rejects.toThrow(
      "アクセストークンが取得できませんでした。",
    );
    expect(mockSwitchTenantPost).not.toHaveBeenCalled();
  });

  it("throws api error message when switching tenant fails", async () => {
    const { switchTenant } = await import("./switchTenant.server");
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: "access-token-1" } },
    });
    mockSwitchTenantPost.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "switch failed" }),
    });

    await expect(switchTenant("tenant-1")).rejects.toThrow("switch failed");

    consoleErrorSpy.mockRestore();
  });

  it("sets cookie and refreshes auth session when switching tenant succeeds", async () => {
    const { switchTenant } = await import("./switchTenant.server");

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: "access-token-1" } },
    });
    mockSwitchTenantPost.mockResolvedValue({
      ok: true,
      json: vi.fn(),
    });
    mockGetAuthSession.mockResolvedValue({});

    await switchTenant("tenant-1");

    expect(mockSwitchTenantPost).toHaveBeenCalledWith(
      {
        json: { tenantId: "tenant-1" },
      },
      {
        headers: {
          Authorization: "Bearer access-token-1",
        },
      },
    );
    expect(mockSetCurrentTenantCookie).toHaveBeenCalledWith("tenant-1");
    expect(mockGetAuthSession).toHaveBeenCalledWith("tenant-1");
  });
});
