import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type MemberEntity,
  memberEntitySchema,
} from "@/features/member/domains/member.entity";
import type { UpdateMemberDto } from "@/features/member/domains/member.input";
import type { Repository } from "@/features/member/member.repository";

/**
 * メンバーを更新するユースケース
 * 削除されたメンバーは更新できません
 * @param input - 更新するメンバーの情報
 * @param repository - リポジトリ
 * @returns 更新されたメンバー
 */
export const updateMemberUsecase = async (
  input: UpdateMemberDto,
  repository: Repository,
): Promise<Result<MemberEntity, HTTPException>> => {
  try {
    // 削除されたメンバーは更新できない
    const isDeleted = await repository.memberRepository.isDeleted(input.id);
    if (isDeleted) {
      return err(
        new HTTPException(400, { message: "Cannot update deleted member" }),
      );
    }

    const updatedMember = await repository.memberRepository.update(input.id, {
      memberRoleId: input.memberRoleId,
      bio: input.bio,
      inviteStatusId: input.inviteStatusId,
      updatedBy: input.updatedBy,
    });

    if (!updatedMember) {
      return err(new HTTPException(404, { message: "Member not found" }));
    }

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedMember = v.safeParse(memberEntitySchema, {
      ...updatedMember,
      createdAt: updatedMember.createdAt,
      updatedAt: updatedMember.updatedAt,
    });

    if (!parsedMember.success) {
      return err(
        new HTTPException(500, {
          message: "Updated member data is invalid",
        }),
      );
    }

    return ok(parsedMember.output);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to update member" }));
  }
};
