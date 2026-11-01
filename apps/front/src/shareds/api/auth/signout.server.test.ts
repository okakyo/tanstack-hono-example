import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSignOut = vi.fn();
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
      signOut: mockSignOut,
    },
  }),
}));

describe("signOut", () => {
  beforeEach(() => {
    cookieStore.clear();
    vi.clearAllMocks();
  });

  it("clears all Supabase auth cookies on sign out", async () => {
    const { signOut } = await import("./signout.server");

    cookieStore.set("current_tenant_id", "tenant-123");
    cookieStore.set("sb-test-project-auth-token", "access-refresh-token");
    cookieStore.set(
      "sb-test-project-auth-token-code-verifier",
      "code-verifier",
    );
    mockSignOut.mockResolvedValue({ error: null });

    await signOut();

    expect(cookieStore.has("current_tenant_id")).toBe(false);
    expect(cookieStore.has("sb-test-project-auth-token")).toBe(false);
    expect(cookieStore.has("sb-test-project-auth-token-code-verifier")).toBe(
      false,
    );
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
