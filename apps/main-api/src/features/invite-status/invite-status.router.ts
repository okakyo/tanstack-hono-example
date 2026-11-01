import { Hono } from "hono";
import type { AppEnv } from "@/app.env";
import { handleResult } from "@/libs/utils/responseHelper";
import { validateTenantAccessMiddleware } from "@/middlewares/validateTenantAccess.middleware";
import type { InviteStatusModule } from "./invite-status.module";

export const inviteStatusRouter = (module: InviteStatusModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", validateTenantAccessMiddleware);
  app.use("*", module);

  return app.get("/", async (c) => {
    const inviteStatusService = c.get("inviteStatusService");
    const res = await inviteStatusService.find();
    return handleResult(c, res);
  });
};
