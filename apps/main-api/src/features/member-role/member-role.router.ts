import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import type { AppEnv } from "@/app.env";
import { errorResponse, handleResult } from "@/libs/utils/responseHelper";
import { validateTenantAccessMiddleware } from "@/middlewares/validateTenantAccess.middleware";
import {
  createMemberRoleRequestSchema,
  memberRoleQuerySchema,
  updateMemberRoleRequestSchema,
} from "./domains/member-role.input";
import type { MemberRoleModule } from "./member-role.module";

export const memberRoleRouter = (module: MemberRoleModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", validateTenantAccessMiddleware);
  app.use("*", module);

  return app
    .get("/", vValidator("query", memberRoleQuerySchema), async (c) => {
      const query = c.req.valid("query");
      const memberRoleService = c.get("memberRoleService");

      const res = await memberRoleService.findAll(query);

      if (res.isErr()) {
        return errorResponse(c, res.error);
      }

      c.header("X-Total-Count", String(res.value.total));
      c.header("Access-Control-Expose-Headers", "X-Total-Count");

      return c.json({
        success: true,
        data: res.value.memberRoles,
        message: "",
      });
    })
    .get("/:roleId", async (c) => {
      const { roleId } = c.req.param();
      const memberRoleService = c.get("memberRoleService");
      const res = await memberRoleService.findById({ id: roleId });

      return handleResult(c, res);
    })
    .post("/", vValidator("json", createMemberRoleRequestSchema), async (c) => {
      const body = c.req.valid("json");
      const authUserId = c.get("authUserId");
      const memberRoleService = c.get("memberRoleService");

      const res = await memberRoleService.create({
        ...body,
        createdBy: authUserId,
      });

      return handleResult(c, res, 201);
    })
    .put(
      "/:roleId",
      vValidator("json", updateMemberRoleRequestSchema),
      async (c) => {
        const { roleId } = c.req.param();
        const body = c.req.valid("json");
        const authUserId = c.get("authUserId");
        const memberRoleService = c.get("memberRoleService");

        const res = await memberRoleService.update({
          id: roleId,
          ...body,
          updatedBy: authUserId,
        });

        return handleResult(c, res);
      },
    )
    .delete("/:roleId", async (c) => {
      const { roleId } = c.req.param();
      const memberRoleService = c.get("memberRoleService");
      const res = await memberRoleService.delete({ id: roleId });

      return handleResult(c, res);
    });
};
