import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_SESSION_INVALIDATION_ERROR_NAME } from "@/shareds/provider/auth/constants";
import {
  clearAuthCookies,
  createFallbackUser,
  createSessionInvalidationError,
  getCurrentTenantCookie,
  isSupabaseRefreshTokenError,
  readResponseData,
  setCurrentTenantCookie,
} from "./util";

const { cookieStore, mockSetCookie } = vi.hoisted(() => {
  const store = new Map<string, string>();
  const setCookie = vi.fn((name: string, value: string | null) => {
    if (value === null || value === "") {
      store.delete(name);
      return;
    }

    store.set(name, value);
  });

  return {
    cookieStore: store,
    mockSetCookie: setCookie,
  };
});

vi.mock("@tanstack/react-start/server", () => ({
  getCookies: () => Object.fromEntries(cookieStore.entries()),
  setCookie: mockSetCookie,
}));

describe("readResponseData", () => {
  it("returns wrapped data when payload has data field", () => {
    expect(
      readResponseData<{ id: string }>({ data: { id: "user-1" } }),
    ).toEqual({ id: "user-1" });
  });

  it("returns payload itself when payload has no data field", () => {
    expect(readResponseData<{ id: string }>({ id: "user-1" })).toEqual({
      id: "user-1",
    });
  });

  it("returns null for non-object payload", () => {
    expect(readResponseData("text")).toBeNull();
    expect(readResponseData(null)).toBeNull();
  });
});

describe("isSupabaseRefreshTokenError", () => {
  it("returns true for refresh token error code", () => {
    expect(
      isSupabaseRefreshTokenError({ code: "refresh_token_not_found" }),
    ).toBe(true);
  });

  it("returns true for session invalidation error name", () => {
    expect(
      isSupabaseRefreshTokenError({
        name: AUTH_SESSION_INVALIDATION_ERROR_NAME,
      }),
    ).toBe(true);
  });

  it("returns true for refresh token error message", () => {
    expect(
      isSupabaseRefreshTokenError({
        message: "Invalid Refresh Token: Refresh Token Not Found",
      }),
    ).toBe(true);
  });

  it("returns false for unrelated error", () => {
    expect(isSupabaseRefreshTokenError({ message: "something else" })).toBe(
      false,
    );
  });
});

describe("createSessionInvalidationError", () => {
  it("creates invalidation error with provided message", () => {
    const error = createSessionInvalidationError({ message: "invalid" });

    expect(error.name).toBe(AUTH_SESSION_INVALIDATION_ERROR_NAME);
    expect(error.message).toBe("invalid");
  });

  it("creates invalidation error with default message", () => {
    const error = createSessionInvalidationError({});

    expect(error.name).toBe(AUTH_SESSION_INVALIDATION_ERROR_NAME);
    expect(error.message).toBe(
      "認証セッションが無効です。再度ログインしてください。",
    );
  });
});

describe("tenant cookie helpers", () => {
  beforeEach(() => {
    cookieStore.clear();
    vi.clearAllMocks();
  });

  it("gets current tenant id from cookie", () => {
    cookieStore.set("current_tenant_id", "tenant-1");

    expect(getCurrentTenantCookie()).toBe("tenant-1");
  });

  it("returns null when current tenant cookie is missing", () => {
    expect(getCurrentTenantCookie()).toBeNull();
  });

  it("sets current tenant cookie", () => {
    setCurrentTenantCookie("tenant-1");

    expect(mockSetCookie).toHaveBeenCalledWith(
      "current_tenant_id",
      "tenant-1",
      expect.objectContaining({
        path: "/",
        sameSite: "lax",
        httpOnly: true,
      }),
    );
  });

  it("clears supabase and tenant cookies", () => {
    cookieStore.set("current_tenant_id", "tenant-1");
    cookieStore.set("sb-project-auth-token", "token");
    cookieStore.set("normal_cookie", "keep");

    clearAuthCookies();

    expect(cookieStore.has("current_tenant_id")).toBe(false);
    expect(cookieStore.has("sb-project-auth-token")).toBe(false);
    expect(cookieStore.get("normal_cookie")).toBe("keep");
  });
});

describe("createFallbackUser", () => {
  it("returns null when user is null", () => {
    expect(createFallbackUser(null)).toBeNull();
  });

  it("prefers metadata name for fallback user name", () => {
    const user = createFallbackUser({
      id: "user-1",
      email: "user@example.com",
      user_metadata: { name: "Display Name" },
    });

    expect(user).toMatchObject({
      id: "user-1",
      name: "Display Name",
      currentTenantName: null,
      currentCompanyId: null,
      companyName: null,
      role: null,
    });
  });
});
