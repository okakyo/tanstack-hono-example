import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUpdateUser = vi.fn();
const mockExchangeCodeForSession = vi.fn();
const mockSetSession = vi.fn();

vi.mock("../supabase.server", () => ({
  createSupabaseServerClient: () => ({
    auth: {
      updateUser: mockUpdateUser,
      exchangeCodeForSession: mockExchangeCodeForSession,
      setSession: mockSetSession,
    },
  }),
}));

describe("updatePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates user password", async () => {
    const { updatePassword } = await import("./updatePassword.server");
    const data = { user: { id: "user-1" } };

    mockUpdateUser.mockResolvedValue({ data, error: null });

    const result = await updatePassword("new-password");

    expect(mockUpdateUser).toHaveBeenCalledWith({
      password: "new-password",
    });
    expect(result).toEqual(data);
  });

  it("throws when password update fails", async () => {
    const { updatePassword } = await import("./updatePassword.server");

    mockUpdateUser.mockResolvedValue({
      data: null,
      error: { message: "update failed" },
    });

    await expect(updatePassword("new-password")).rejects.toThrow(
      "update failed",
    );
  });
});

describe("verifyPasswordResetCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("establishes session with code", async () => {
    const { verifyPasswordResetCode } = await import("./updatePassword.server");

    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const result = await verifyPasswordResetCode("reset-code");

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("reset-code");
    expect(result).toEqual({ success: true });
  });

  it("throws when code verification fails", async () => {
    const { verifyPasswordResetCode } = await import("./updatePassword.server");

    mockExchangeCodeForSession.mockResolvedValue({
      error: { message: "invalid code" },
    });

    await expect(verifyPasswordResetCode("reset-code")).rejects.toThrow(
      "invalid code",
    );
  });
});

describe("verifyPasswordResetTokens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("establishes session with tokens", async () => {
    const { verifyPasswordResetTokens } = await import(
      "./updatePassword.server"
    );

    mockSetSession.mockResolvedValue({ error: null });

    const result = await verifyPasswordResetTokens(
      "access-token",
      "refresh-token",
    );

    expect(mockSetSession).toHaveBeenCalledWith({
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
    expect(result).toEqual({ success: true });
  });

  it("throws when token verification fails", async () => {
    const { verifyPasswordResetTokens } = await import(
      "./updatePassword.server"
    );

    mockSetSession.mockResolvedValue({
      error: { message: "invalid tokens" },
    });

    await expect(
      verifyPasswordResetTokens("access-token", "refresh-token"),
    ).rejects.toThrow("invalid tokens");
  });
});
