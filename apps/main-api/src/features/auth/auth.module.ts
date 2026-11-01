import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { authService } from "./application/auth.service";

export const AUTH_SERVICE_KEY = "authService";

export const createAuthModule = (repository: Repository) => {
  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(AUTH_SERVICE_KEY, authService(repository));
    await next();
  });
};

export type AuthModule = ReturnType<typeof createAuthModule>;
