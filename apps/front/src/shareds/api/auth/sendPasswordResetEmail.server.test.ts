import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockResetPasswordForEmail = vi.fn();

vi.mock("../supabase.server", () => ({
  createSupabaseServerClient: () => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}));

describe("sendPasswordResetEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends reset email with configured app url", async () => {
    const { sendPasswordResetEmail } = await import(
      "./sendPasswordResetEmail.server"
    );
    const data = { ok: true };

    vi.stubEnv("VITE_APP_URL", "https://example.test");
    mockResetPasswordForEmail.mockResolvedValue({ data, error: null });

    const result = await sendPasswordResetEmail("user@example.com");

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "https://example.test/password-reset",
    });
    expect(result).toEqual(data);
  });

  it("throws when reset email request fails", async () => {
    const { sendPasswordResetEmail } = await import(
      "./sendPasswordResetEmail.server"
    );

    mockResetPasswordForEmail.mockResolvedValue({
      data: null,
      error: { message: "reset failed" },
    });

    await expect(sendPasswordResetEmail("user@example.com")).rejects.toThrow(
      "reset failed",
    );
  });
});
