import type { JwtPayload } from "@supabase/supabase-js";
import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import type { AppEnv } from "../app.env";
import { validateTenantAccessMiddleware } from "./validateTenantAccess.middleware";
import { verifySupabaseToken } from "./verifyJwt.middleware";

vi.mock("./auth.middleware", () => ({
  verifySupabaseToken: vi.fn(),
}));

describe("validateTenantAccessMiddleware", () => {
  it("jwtPayload が未設定の場合は 401 を返す", async () => {
    const app = new Hono();
    app.use("*", validateTenantAccessMiddleware);
    app.get("/", (c) => c.text("ok"));

    const response = await app.request("http://localhost/");

    expect(response.status).toBe(401);
    const body = await response.text();
    expect(body).toContain("認証情報が見つかりません。");
  });

  it("jwtPayload の形式が不正な場合は 401 を返す", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", async (c, next) => {
      c.set("jwtPayload", { payload: {} as JwtPayload });
      c.set("repository", {
        memberRepository: { find: vi.fn() },
        userRepository: { findByAuthUserId: vi.fn() },
      } as unknown as AppEnv["Variables"]["repository"]);
      await next();
    });
    app.use("*", validateTenantAccessMiddleware);
    app.get("/", (c) => c.text("ok"));

    const response = await app.request("http://localhost/", {
      headers: { "X-Tenant-Id": "tenant-1" },
    });

    expect(response.status).toBe(401);
    const body = await response.text();
    expect(body).toContain("トークンにユーザーIDが含まれていません。");
  });

  it("Authorization ヘッダーがある場合は jwtPayload を補完して認証を通す", async () => {
    vi.mocked(verifySupabaseToken).mockResolvedValue({
      sub: "auth-user-1",
    } as JwtPayload);

    const app = new Hono<AppEnv>();
    app.use("*", async (c, next) => {
      c.set("repository", {
        memberRepository: {
          find: vi.fn().mockResolvedValue([{ id: "membership-1" }]),
        },
        userRepository: {
          findByAuthUserId: vi.fn().mockResolvedValue({ id: "user-1" }),
        },
      } as unknown as AppEnv["Variables"]["repository"]);
      await next();
    });
    app.use("*", validateTenantAccessMiddleware);
    app.get("/", (c) => c.text("ok"));

    const response = await app.request("http://localhost/", {
      headers: {
        Authorization: "Bearer valid-token",
        "X-Tenant-Id": "tenant-1",
      },
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
  });
});
