import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import type { AppEnv } from "@/app.env";
import { errorResponse, handleResult } from "@/libs/utils/responseHelper";
import { validateMemberAdminAccessMiddleware } from "@/middlewares/validateMemberAdminAccess.middleware";
import { validateTenantAccessMiddleware } from "@/middlewares/validateTenantAccess.middleware";
import type { CompanyModule } from "./company.module";
import {
  createCompanyDtoSchema,
  getCompaniesQueryDtoSchema,
  updateCompanyDtoSchema,
} from "./domains/company.input";

const companyIdParamSchema = v.object({
  companyId: v.pipe(
    v.string(),
    v.uuid("有効な companyId を指定してください。"),
  ),
});

export const companyRouter = (module: CompanyModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", validateTenantAccessMiddleware);
  app.use("*", module);

  return app
    .get(
      "/",
      vValidator("query", getCompaniesQueryDtoSchema),
      validateMemberAdminAccessMiddleware,
      async (c) => {
        const query = c.req.valid("query");
        const tenantId = c.get("tenantId");
        const companyService = c.get("companyService");

        const res = await companyService.find({
          ...query,
          tenantId,
        });

        if (res.isErr()) {
          return errorResponse(c, res.error);
        }

        const { count, data } = res.value;
        c.header("X-Total-Count", String(count));
        c.header("Access-Control-Expose-Headers", "X-Total-Count");

        return c.json({ success: true, data, message: "" }, 200);
      },
    )
    .get(
      "/:companyId",
      vValidator("param", companyIdParamSchema),
      validateMemberAdminAccessMiddleware,
      async (c) => {
        const { companyId } = c.req.valid("param");
        const tenantId = c.get("tenantId");
        const companyService = c.get("companyService");

        const res = await companyService.findById({ id: companyId, tenantId });

        return handleResult(c, res);
      },
    )
    .post(
      "/",
      vValidator("json", createCompanyDtoSchema),
      validateMemberAdminAccessMiddleware,
      async (c) => {
        const body = c.req.valid("json");
        const tenantId = c.get("tenantId");
        const companyService = c.get("companyService");

        const res = await companyService.create({
          ...body,
          tenantId,
        });

        return handleResult(c, res, 201);
      },
    )
    .put(
      "/:companyId",
      vValidator("json", updateCompanyDtoSchema),
      validateMemberAdminAccessMiddleware,
      async (c) => {
        const { companyId } = c.req.param();
        const body = c.req.valid("json");
        const tenantId = c.get("tenantId");
        const companyService = c.get("companyService");

        const res = await companyService.update({
          id: companyId,
          tenantId,
          ...body,
        });

        return handleResult(c, res);
      },
    )
    .delete("/:companyId", validateMemberAdminAccessMiddleware, async (c) => {
      const { companyId } = c.req.param();
      const tenantId = c.get("tenantId");
      const companyService = c.get("companyService");

      const res = await companyService.delete({ id: companyId, tenantId });

      return handleResult(c, res);
    });
};
