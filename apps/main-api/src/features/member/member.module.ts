import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { memberService } from "./application/member.service";

export const MEMBER_SERVICE_KEY = "memberService";

export const createMemberModule = (repository: Repository) => {
  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(MEMBER_SERVICE_KEY, memberService(repository));
    await next();
  });
};

export type MemberModule = ReturnType<typeof createMemberModule>;
