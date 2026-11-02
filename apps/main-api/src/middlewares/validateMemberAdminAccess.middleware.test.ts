import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import type { AppEnv } from "@/app.env";
import { validateMemberAdminAccessMiddleware } from "./validateMemberAdminAccess.middleware";

describe("validateMemberAdminAccessMiddleware", () => {
  it("admin 権限がない場合は 403 を返す", async () => {
    const app = new Hono<AppEnv>();

    app.use("*", async (c, next) => {
      c.set("authUserId", "auth-user-1");
      c.set("tenantId", "tenant-1");
      c.set("repository", {
        userRepository: {
          findByAuthUserId: vi.fn().mockResolvedValue({ id: "user-1" }),
        },
        memberRepository: {
          find: vi.fn().mockResolvedValue([{ memberRole: { role: "member" } }]),
        },
      } as unknown as AppEnv["Variables"]["repository"]);
      await next();
    });

    app.use("*", validateMemberAdminAccessMiddleware);
    app.get("/", (c) => c.text("ok"));

    const response = await app.request("http://localhost/");

    expect(response.status).toBe(403);
    expect(await response.text()).toContain("admin");
  });

  it("admin 権限がある場合は通す", async () => {
    const app = new Hono<AppEnv>();

    app.use("*", async (c, next) => {
      c.set("authUserId", "auth-user-1");
      c.set("tenantId", "tenant-1");
      c.set("repository", {
        userRepository: {
          findByAuthUserId: vi.fn().mockResolvedValue({ id: "user-1" }),
        },
        memberRepository: {
          find: vi.fn().mockResolvedValue([{ memberRole: { role: "admin" } }]),
        },
      } as unknown as AppEnv["Variables"]["repository"]);
      await next();
    });

    app.use("*", validateMemberAdminAccessMiddleware);
    app.get("/", (c) => c.text("ok"));

    const response = await app.request("http://localhost/");

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
  });
});
