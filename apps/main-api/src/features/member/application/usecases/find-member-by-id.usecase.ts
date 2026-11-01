import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { GetMemberByIdDto } from "@/features/member/domains/member.input";
import type { Repository } from "@/features/member/member.repository";

type FindMemberByIdResult = NonNullable<
  Awaited<ReturnType<Repository["memberRepository"]["findById"]>>
>;

/**
 * IDでメンバーを取得するユースケース
 * @param input - 取得するメンバーのID
 * @param repository - リポジトリ
 * @returns メンバー
 */
export const findMemberByIdUsecase = async (
  input: GetMemberByIdDto,
  repository: Repository,
): Promise<Result<FindMemberByIdResult, HTTPException>> => {
  try {
    const member = await repository.memberRepository.findById(input.id);

    if (!member) {
      return err(new HTTPException(404, { message: "Member not found" }));
    }

    return ok(member);
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to find member" }));
  }
};
