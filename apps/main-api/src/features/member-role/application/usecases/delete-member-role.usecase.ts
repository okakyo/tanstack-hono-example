import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { DeleteMemberRoleDto } from "@/features/member-role/domains/member-role.input";
import type { Repository } from "@/features/member-role/member-role.repository";

/**
 * メンバーロールを削除するユースケース
 * ソフトデリート方式で、deleted テーブルに記録されます
 * @param input - 削除するメンバーロールのID
 * @param repository - リポジトリ
 * @returns 削除成功の真偽値
 */
export const deleteMemberRoleUsecase = async (
  input: DeleteMemberRoleDto,
  repository: Repository,
): Promise<Result<boolean, HTTPException>> => {
  try {
    // メンバーロールが存在するか確認
    const memberRole = await repository.memberRoleRepository.findById(input.id);
    if (!memberRole) {
      return err(new HTTPException(404, { message: "Member role not found" }));
    }

    // ソフトデリート実行
    const result = await repository.memberRoleRepository.delete(input.id);
    return ok(result);
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to delete member role" }),
    );
  }
};
