import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type MemberRoleEntity,
  memberRoleEntitySchema,
} from "@/features/member-role/domains/member-role.entity";
import type { UpdateMemberRoleDto } from "@/features/member-role/domains/member-role.input";
import type { Repository } from "@/features/member-role/member-role.repository";

/**
 * メンバーロールを更新するユースケース
 * 削除されたメンバーロールは更新できません
 * @param input - 更新するメンバーロールの情報
 * @param repository - リポジトリ
 * @returns 更新されたメンバーロール
 */
export const updateMemberRoleUsecase = async (
  input: UpdateMemberRoleDto,
  repository: Repository,
): Promise<Result<MemberRoleEntity, HTTPException>> => {
  try {
    // 削除されたメンバーロールは更新できない
    const isDeleted = await repository.memberRoleRepository.isDeleted(input.id);
    if (isDeleted) {
      return err(
        new HTTPException(400, {
          message: "Cannot update deleted member role",
        }),
      );
    }

    const updatedMemberRole = await repository.memberRoleRepository.update(
      input.id,
      {
        role: input.role,
        description: input.description,
        updatedBy: input.updatedBy,
      },
    );

    if (!updatedMemberRole) {
      return err(new HTTPException(404, { message: "Member role not found" }));
    }

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedMemberRole = v.safeParse(memberRoleEntitySchema, {
      ...updatedMemberRole,
      createdAt: updatedMemberRole.createdAt,
      updatedAt: updatedMemberRole.updatedAt,
    });

    if (!parsedMemberRole.success) {
      return err(
        new HTTPException(500, {
          message: "Updated member role data is invalid",
        }),
      );
    }

    return ok(parsedMemberRole.output);
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to update member role" }),
    );
  }
};
