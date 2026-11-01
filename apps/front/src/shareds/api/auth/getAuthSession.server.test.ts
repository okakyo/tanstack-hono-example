import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUser = vi.fn();
const mockGetSession = vi.fn();
const mockGetUserTenantInfo = vi.fn();
const mockGetTenantList = vi.fn();
const cookieStore = new Map<string, string>();

vi.mock("@tanstack/react-start/server", () => ({
  getCookies: () => Object.fromEntries(cookieStore.entries()),
  setCookie: (name: string, value: string | null) => {
    if (value === null || value === "") {
      cookieStore.delete(name);
      return;
    }

    cookieStore.set(name, value);
  },
}));

vi.mock("../supabase.server", () => ({
  createSupabaseServerClient: () => ({
    auth: {
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
  }),
}));

vi.mock("@repo/main-api", () => ({
  honoApiClient: {
    auth: {
      user: {
        $get: mockGetUserTenantInfo,
        tenants: {
          $get: mockGetTenantList,
        },
      },
    },
  },
}));

describe("getAuthSession", () => {
  beforeEach(() => {
    cookieStore.clear();
    vi.clearAllMocks();
  });

  it("keeps authentication state when tenant metadata fetch fails", async () => {
    const { getAuthSession } = await import("./getAuthSession.server");

    cookieStore.set("current_tenant_id", "tenant-123");
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          email: "user@example.com",
          user_metadata: { name: "User Name" },
        },
      },
      error: null,
    });
    mockGetSession.mockResolvedValue({
      data: {
        session: { access_token: "access-token-1" },
      },
    });
    mockGetUserTenantInfo.mockRejectedValue(new TypeError("fetch failed"));
    mockGetTenantList.mockRejectedValue(new TypeError("fetch failed"));

    const session = await getAuthSession();

    expect(session.accessToken).toBe("access-token-1");
    expect(session.currentTenantId).toBe("tenant-123");
    expect(session.user).toMatchObject({
      id: "user-1",
      name: "User Name",
    });
    expect(session.selectableTenants).toEqual([]);
  });

  it("invalidates the session when Supabase reports a missing refresh token", async () => {
    const { getAuthSession } = await import("./getAuthSession.server");

    mockGetUser.mockRejectedValue({
      code: "refresh_token_not_found",
      message: "Invalid Refresh Token: Refresh Token Not Found",
    });

    await expect(getAuthSession()).rejects.toMatchObject({
      name: "AuthSessionInvalidationError",
    });
  });
});
