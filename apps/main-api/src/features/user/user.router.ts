import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import type { AppEnv } from "@/app.env";
import {
  createUserDtoSchema,
  updateUserDtoSchema,
} from "@/features/user/domains/users.input";
import { handleResult } from "@/libs/utils/responseHelper";
import { validateTenantAccessMiddleware } from "@/middlewares/validateTenantAccess.middleware";
import type { UserModule } from "./user.module";

export const userRouter = (module: UserModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", validateTenantAccessMiddleware);
  app.use("*", module);

  return app
    .get("/:userId", async (c) => {
      const { userId } = c.req.param();
      const userService = c.get("userService");
      const res = await userService.findById(userId);

      return handleResult(c, res);
    })
    .post("/", vValidator("json", createUserDtoSchema), async (c) => {
      const body = c.req.valid("json");
      const userService = c.get("userService");
      const res = await userService.register(body);

      return handleResult(c, res, 201, "ユーザーが正常に登録されました");
    })
    .put("/:userId", vValidator("json", updateUserDtoSchema), async (c) => {
      const { userId } = c.req.param();
      const body = c.req.valid("json");
      const userService = c.get("userService");
      const res = await userService.edit(userId, body);

      return handleResult(c, res, 200, "ユーザー情報が正常に更新されました");
    })
    .delete("/:userId", async (c) => {
      const { userId } = c.req.param();
      const userService = c.get("userService");
      const res = await userService.withdraw(userId);

      return handleResult(c, res, 200, "ユーザーが正常に削除されました");
    });
};
