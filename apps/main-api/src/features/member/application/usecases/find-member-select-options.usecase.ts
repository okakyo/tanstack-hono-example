import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { MemberSelectOptionEntity } from "@/features/member/domains/member.response";
import type { Repository } from "@/features/member/member.repository";

type FindMemberSelectOptionsInput = {
  tenantId: string;
};

/**
 * Select 用のメンバー一覧（id, name）を取得します。
 */
export const findMemberSelectOptionsUsecase = async (
  input: FindMemberSelectOptionsInput,
  repository: Repository,
): Promise<Result<MemberSelectOptionEntity[], HTTPException>> => {
  try {
    const members =
      await repository.memberRepository.findSelectOptionsByTenantId(
        input.tenantId,
      );

    return ok(
      members.map((member) => ({
        id: member.id,
        name: member.name,
      })),
    );
  } catch (_error) {
    return err(
      new HTTPException(500, {
        message: "Failed to find member select options",
      }),
    );
  }
};
