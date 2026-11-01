import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type MemberRoleEntity,
  memberRoleEntitySchema,
} from "@/features/member-role/domains/member-role.entity";
import type { CreateMemberRoleDto } from "@/features/member-role/domains/member-role.input";
import type { Repository } from "@/features/member-role/member-role.repository";

/**
 * メンバーロールを作成するユースケース
 * @param input - 作成するメンバーロールの情報
 * @param repository - リポジトリ
 * @returns 作成されたメンバーロール
 */
export const createMemberRoleUsecase = async (
  input: CreateMemberRoleDto,
  repository: Repository,
): Promise<Result<MemberRoleEntity, HTTPException>> => {
  try {
    const newMemberRole = await repository.memberRoleRepository.create({
      role: input.role,
      description: input.description,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
    });

    // Parser を利用して、期待した値が取得できることを検証する
    const parsedMemberRole = v.safeParse(memberRoleEntitySchema, {
      ...newMemberRole,
      createdAt: newMemberRole.createdAt,
      updatedAt: newMemberRole.updatedAt,
    });

    if (!parsedMemberRole.success) {
      return err(
        new HTTPException(500, {
          message: "Created member role data is invalid",
        }),
      );
    }

    return ok(parsedMemberRole.output);
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to create member role" }),
    );
  }
};
