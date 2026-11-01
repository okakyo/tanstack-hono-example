import * as schema from "@db/migrations/schema";
import { vValidator } from "@hono/valibot-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import type { AppEnv } from "@/app.env";
import { errorResponse } from "@/libs/utils/responseHelper";
import {
  createTenantTransactionExecutor,
  TENANT_ID_HEADER,
} from "@/middlewares/createRepository.middleware";
import { validateTenantAccessMiddleware } from "@/middlewares/validateTenantAccess.middleware";
import {
  createMemberRequestSchema,
  getMembersQueryDtoSchema,
  updateMemberRequestSchema,
} from "./domains/member.input";
import type { MemberModule } from "./member.module";

const memberIdParamSchema = v.object({
  memberId: v.pipe(v.string(), v.uuid("有効な memberId を指定してください。")),
});

export const memberRouter = (module: MemberModule) => {
  const app = new Hono<AppEnv>();

  app.use("*", validateTenantAccessMiddleware);
  app.use("*", module);

  return app
    .get("/select-options", async (c) => {
      const tenantId = c.get("tenantId");
      const memberService = c.get("memberService");
      const res = await memberService.findSelectOptions({ tenantId });

      if (res.isErr()) {
        return errorResponse(c, res.error);
      }

      return c.json({ success: true, data: res.value, message: "" }, 200);
    })
    .get("/", vValidator("query", getMembersQueryDtoSchema), async (c) => {
      const query = c.req.valid("query");
      const tenantId = c.get("tenantId");
      const memberService = c.get("memberService");

      const res = await memberService.findAll({
        ...query,
        tenantId,
      });

      if (res.isErr()) {
        return errorResponse(c, res.error);
      }

      const { total, members } = res.value;
      c.header("X-Total-Count", String(total));
      c.header("Access-Control-Expose-Headers", "X-Total-Count");

      return c.json({ success: true, data: members, message: "" }, 200);
    })
    .get("/:memberId", vValidator("param", memberIdParamSchema), async (c) => {
      const { memberId } = c.req.valid("param");
      const tenantId = c.get("tenantId");
      const memberService = c.get("memberService");
      const res = await memberService.findById({ id: memberId });

      if (res.isErr()) {
        return errorResponse(c, res.error);
      }

      if (res.value.tenantId !== tenantId) {
        throw new HTTPException(404, { message: "Member not found" });
      }

      return c.json({ success: true, data: res.value, message: "" }, 200);
    })
    .post("/", vValidator("json", createMemberRequestSchema), async (c) => {
      const body = c.req.valid("json");
      const authUserId = c.get("authUserId");
      const tenantId = c.get("tenantId");
      const repository = c.get("repository");
      const { memberRepository, tenantRepository, userRepository } = repository;
      const memberService = c.get("memberService");

      const tenant = await tenantRepository.findById(tenantId);
      if (!tenant) {
        throw new HTTPException(400, { message: "Tenant not found" });
      }

      const actor = await userRepository.findByAuthUserId(authUserId);
      if (!actor) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const memberships = await memberRepository.find({
        where: and(
          eq(schema.member.userId, actor.id),
          eq(schema.member.tenantId, tenantId),
        ),
      });

      const actorMembership = memberships[0];
      if (!actorMembership?.company?.id) {
        throw new HTTPException(403, {
          message: "Company membership not found",
        });
      }

      const user = await userRepository.findByEmail(body.email);
      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const res = await memberService.create({
        tenantId,
        userId: user.id,
        companyId: actorMembership.company.id,
        memberRoleId: body.memberRoleId,
        createdBy: authUserId,
      });

      if (res.isErr()) {
        return errorResponse(c, res.error);
      }

      return c.json({ success: true, data: res.value, message: "" }, 201);
    })
    .put(
      "/:memberId",
      vValidator("json", updateMemberRequestSchema),
      async (c) => {
        const { memberId } = c.req.param();
        const body = c.req.valid("json");
        const authUserId = c.get("authUserId");
        const tenantId = c.get("tenantId");
        const repository = c.get("repository");
        const { memberRepository, userRepository } = repository;
        const executeTransaction = createTenantTransactionExecutor(
          repository,
          c.req.header(TENANT_ID_HEADER),
        );

        const member = await memberRepository.findById(memberId);
        if (!member || member.tenantId !== tenantId) {
          throw new HTTPException(404, { message: "Member not found" });
        }

        const currentUser = await userRepository.findById(member.userId);
        if (!currentUser) {
          throw new HTTPException(404, { message: "User not found" });
        }

        const updatedMember = await executeTransaction(async (trx) => {
          await userRepository.update(
            member.userId,
            {
              id: member.userId,
              name: body.name ?? currentUser.name,
              email: body.email ?? currentUser.email,
            },
            trx,
          );

          return await memberRepository.update(
            member.id,
            {
              ...(body.memberRoleId ? { memberRoleId: body.memberRoleId } : {}),
              ...(body.inviteStatusId
                ? { inviteStatusId: body.inviteStatusId }
                : {}),
              updatedBy: authUserId,
            },
            trx,
          );
        });

        return c.json(
          {
            success: true,
            data: {
              ...updatedMember,
              createdAt: updatedMember.createdAt,
              updatedAt: updatedMember.updatedAt,
            },
            message: "",
          },
          200,
        );
      },
    )
    .delete("/:memberId", async (c) => {
      const { memberId } = c.req.param();
      const tenantId = c.get("tenantId");
      const memberService = c.get("memberService");

      const memberRes = await memberService.findById({ id: memberId });
      if (memberRes.isErr() || memberRes.value.tenantId !== tenantId) {
        throw new HTTPException(404, { message: "Member not found" });
      }

      const res = await memberService.delete({ id: memberId });

      if (res.isErr()) {
        const error = res.error;
        return c.json(
          { success: false, data: null, message: error.message },
          error.status,
        );
      }

      return c.json({ success: true, data: res.value, message: "" }, 200);
    });
};
