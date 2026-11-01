import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSignUp = vi.fn();

vi.mock("../supabase.server", () => ({
  createSupabaseServerClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}));

describe("signUpWithPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user with email and password", async () => {
    const { signUpWithPassword } = await import("./signup.server");
    const response = {
      user: { id: "user-1" },
      session: null,
    };

    mockSignUp.mockResolvedValue({ data: response, error: null });

    const result = await signUpWithPassword({
      email: "user@example.com",
      password: "password-123",
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password-123",
    });
    expect(result).toEqual(response);
  });

  it("throws when supabase returns an error", async () => {
    const { signUpWithPassword } = await import("./signup.server");

    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "signup failed" },
    });

    await expect(
      signUpWithPassword({
        email: "user@example.com",
        password: "password-123",
      }),
    ).rejects.toThrow("signup failed");
  });
});
