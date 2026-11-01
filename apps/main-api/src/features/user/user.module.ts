import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { userService } from "./application/user.service";

export const USER_SERVICE_KEY = "userService";

export const createUserModule = (repository: Repository) => {
  const { userRepository } = repository;

  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(USER_SERVICE_KEY, userService(userRepository));
    await next();
  });
};

export type UserModule = ReturnType<typeof createUserModule>;
