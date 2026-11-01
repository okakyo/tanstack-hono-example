import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { memberRoleService } from "./application/member-role.service";

export const MEMBER_ROLE_SERVICE_KEY = "memberRoleService";

export const createMemberRoleModule = (repository: Repository) => {
  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(MEMBER_ROLE_SERVICE_KEY, memberRoleService(repository));
    await next();
  });
};

export type MemberRoleModule = ReturnType<typeof createMemberRoleModule>;
