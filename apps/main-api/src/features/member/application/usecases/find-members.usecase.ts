import * as schema from "@db/migrations/schema";

import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { GetMembersQueryDto } from "@/features/member/domains/member.input";
import type { MemberListItemEntity } from "@/features/member/domains/member.response";
import type { Repository } from "@/features/member/member.repository";

type Output = {
  members: MemberListItemEntity[];
  total: number;
  page: number;
  limit: number;
};

/**
 * メンバー一覧を取得するユースケース
 * @param input - 検索条件とページネーション
 * @param repository - リポジトリ
 * @returns メンバー一覧と総数
 */
export const findMembersUsecase = async (
  input: GetMembersQueryDto,
  repository: Repository,
): Promise<Result<Output, HTTPException>> => {
  try {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;
    const offset = (page - 1) * limit;

    // 条件を動的に構築
    const conditions = [];
    if (input.tenantId) {
      conditions.push(eq(schema.member.tenantId, input.tenantId));
    }
    if (input.userId) {
      conditions.push(eq(schema.member.userId, input.userId));
    }
    if (input.companyId) {
      conditions.push(eq(schema.member.companyId, input.companyId));
    }
    if (input.memberRoleId) {
      conditions.push(eq(schema.member.memberRoleId, input.memberRoleId));
    }
    if (input.inviteStatusId) {
      conditions.push(eq(schema.member.inviteStatusId, input.inviteStatusId));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy = input.sortBy
      ? [
          {
            field: input.sortBy,
            order: input.orderBy ?? "desc",
          },
        ]
      : undefined;

    const members = await repository.memberRepository.find({
      where,
      orderBy,
      limit,
      offset,
    });

    const total = await repository.memberRepository.count(where);

    return ok({
      members: members.map((member) => ({
        id: member.id,
        tenantId: member.tenantId,
        userId: member.userId,
        companyId: member.company?.id ?? "",
        memberRoleId: member.memberRoleId,
        inviteStatusId: member.inviteStatusId,
        updatedAt: member.updatedAt,
        user: member.user,
        company: member.company,
        memberRole: member.memberRole,
      })),
      total,
      page,
      limit,
    });
  } catch (_error) {
    return err(new HTTPException(500, { message: "Failed to find members" }));
  }
};
