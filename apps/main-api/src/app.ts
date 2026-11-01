import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { HTTPException } from "hono/http-exception";
import { requestId } from "hono/request-id";
import type { AppEnv } from "./app.env";
import { createAppModule } from "./app.module";
import { authRouter } from "./features/auth/auth.router";
import { companyRouter } from "./features/company/company.router";
import { companyPlanRouter } from "./features/company-plan/company-plan.router";
import { inviteStatusRouter } from "./features/invite-status/invite-status.router";
import { memberRouter } from "./features/member/member.router";
import { memberRoleRouter } from "./features/member-role/member-role.router";
import { userRouter } from "./features/user/user.router";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { createRepository } from "./repositories";

const app = new Hono<AppEnv>();

const repository = createRepository();
const modules = createAppModule(repository);

// Repository を注入するミドルウェア
app.use("*", (c, next) => {
  c.set("repository", repository);
  return next();
});

app.use("*", corsMiddleware);

app.use(requestId());
app.use(contextStorage());

app.onError((err, c) => {
  const status = err instanceof HTTPException ? err.status : 500;
  const message =
    err instanceof HTTPException ? err.message : "Internal server error";

  console.error("[main-api] request failed", {
    requestId: c.var.requestId,
    method: c.req.method,
    path: c.req.path,
    status,
    message,
    cause: err instanceof HTTPException ? err.cause : undefined,
    error: err,
  });

  return c.json({ message }, status);
});

const route = app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/auth", authRouter(modules.authModule))
  .route("/companies", companyRouter(modules.companyModule))
  .route("/company-plans", companyPlanRouter(modules.companyPlanModule))
  .route("/invite-statuses", inviteStatusRouter(modules.inviteStatusModule))
  .route("/members", memberRouter(modules.memberModule))
  .route("/member-roles", memberRoleRouter(modules.memberRoleModule))
  .route("/users", userRouter(modules.userModule));

export type AppType = typeof route;

export { app };
