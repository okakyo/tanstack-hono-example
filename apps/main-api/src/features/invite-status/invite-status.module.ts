import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { inviteStatusService } from "./application/invite-status.service";

export const INVITE_STATUS_SERVICE_KEY = "inviteStatusService";

export const createInviteStatusModule = (repository: Repository) => {
  const { inviteStatusRepository } = repository;

  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(
      INVITE_STATUS_SERVICE_KEY,
      inviteStatusService(inviteStatusRepository),
    );
    await next();
  });
};

export type InviteStatusModule = ReturnType<typeof createInviteStatusModule>;
