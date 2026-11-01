import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type MemberEntity,
  memberEntitySchema,
} from "@/features/member/domains/member.entity";
import type { CreateMemberDto } from "@/features/member/domains/member.input";
import type { Repository } from "@/features/member/member.repository";

/**
 * メンバーを作成するユースケース
 * @param input - 作成するメンバーの情報
 * @param repository - リポジトリ
 * @returns 作成されたメンバー
 */
export const createMemberUsecase = async (
  input: CreateMemberDto,
  repository: Repository,
): Promise<Result<MemberEntity, HTTPException>> => {
  try {
    const newMember = await repository.memberRepository.create({
      tenantId: input.tenantId,
      userId: input.userId,
      companyId: input.companyId,
      memberRoleId: input.memberRoleId,
      bio: input.bio,
      inviteStatusId: input.inviteStatusId,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
    });

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedMember = v.safeParse(memberEntitySchema, {
      ...newMember,
      createdAt: newMember.createdAt,
      updatedAt: newMember.updatedAt,
    });

    if (!parsedMember.success) {
      return err(
        new HTTPException(500, {
          message: "Created member data is invalid",
        }),
      );
    }

    return ok(parsedMember.output);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to create member" }));
  }
};
