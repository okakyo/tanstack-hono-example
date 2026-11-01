import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import type { AppEnv } from "@/app.env";
import { handleResult } from "@/libs/utils/responseHelper";
import { validateTenantAccessMiddleware } from "@/middlewares/validateTenantAccess.middleware";
import type { CompanyPlanModule } from "./company-plan.module";
import { getCompanyPlansQueryDtoSchema } from "./domains/company-plan.input";

export const companyPlanRouter = (module: CompanyPlanModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", validateTenantAccessMiddleware);
  app.use("*", module);

  return app.get(
    "/",
    vValidator("query", getCompanyPlansQueryDtoSchema),
    async (c) => {
      const query = c.req.valid("query");
      const companyPlanService = c.get("companyPlanService");

      const res = await companyPlanService.findAll(query);

      if (res.isErr()) {
        return handleResult(c, res);
      }

      c.header("X-Total-Count", String(res.value.total));
      c.header("Access-Control-Expose-Headers", "X-Total-Count");

      return c.json({
        success: true,
        data: res.value.companyPlans,
        message: "",
      });
    },
  );
};
