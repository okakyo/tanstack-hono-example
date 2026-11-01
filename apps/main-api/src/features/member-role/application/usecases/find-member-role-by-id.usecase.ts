import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { MemberRoleEntity } from "@/features/member-role/domains/member-role.entity";
import type { GetMemberRoleByIdDto } from "@/features/member-role/domains/member-role.input";
import type { Repository } from "@/features/member-role/member-role.repository";

/**
 * IDでメンバーロールを取得するユースケース
 * @param input - 取得するメンバーロールのID
 * @param repository - リポジトリ
 * @returns メンバーロール
 */
export const findMemberRoleByIdUsecase = async (
  input: GetMemberRoleByIdDto,
  repository: Repository,
): Promise<Result<MemberRoleEntity, HTTPException>> => {
  try {
    const memberRole = await repository.memberRoleRepository.findById(input.id);

    if (!memberRole) {
      return err(new HTTPException(404, { message: "Member role not found" }));
    }

    return ok({
      ...memberRole,
      createdAt: memberRole.createdAt,
      updatedAt: memberRole.updatedAt,
    });
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to find member role" }),
    );
  }
};
