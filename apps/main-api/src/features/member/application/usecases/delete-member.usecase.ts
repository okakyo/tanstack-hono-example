import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { DeleteMemberDto } from "@/features/member/domains/member.input";
import type { Repository } from "@/features/member/member.repository";

/**
 * メンバーを削除するユースケース
 * ソフトデリート方式で、deleted テーブルに記録されます
 * @param input - 削除するメンバーのID
 * @param repository - リポジトリ
 * @returns 削除成功の真偽値
 */
export const deleteMemberUsecase = async (
  input: DeleteMemberDto,
  repository: Repository,
): Promise<Result<boolean, HTTPException>> => {
  try {
    // メンバーが存在するか確認
    const member = await repository.memberRepository.findById(input.id);
    if (!member) {
      return err(new HTTPException(404, { message: "Member not found" }));
    }

    // ソフトデリート実行
    const result = await repository.memberRepository.delete(
      input.id,
      member.tenantId,
    );
    return ok(result);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to delete member" }));
  }
};
