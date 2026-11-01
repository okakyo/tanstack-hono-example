import * as schema from "@db/migrations/schema";

import { like } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { MemberRoleEntity } from "@/features/member-role/domains/member-role.entity";
import type { GetMemberRolesQueryDto } from "@/features/member-role/domains/member-role.input";
import type { Repository } from "@/features/member-role/member-role.repository";

type Output = {
  memberRoles: MemberRoleEntity[];
  total: number;
  page: number;
  limit: number;
};

/**
 * メンバーロール一覧を取得するユースケース
 * @param input - 検索条件とページネーション
 * @param repository - リポジトリ
 * @returns メンバーロール一覧と総数
 */
export const findMemberRolesUsecase = async (
  input: GetMemberRolesQueryDto,
  repository: Repository,
): Promise<Result<Output, HTTPException>> => {
  try {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;
    const offset = (page - 1) * limit;

    const where = input.role
      ? like(schema.memberRole.role, `%${input.role}%`)
      : undefined;

    const memberRoles = await repository.memberRoleRepository.find({
      where,
      limit,
      offset,
    });

    const total = await repository.memberRoleRepository.count(where);

    return ok({
      memberRoles: memberRoles.map((role) => ({
        ...role,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (_error) {
    return err(
      new HTTPException(500, { message: "Failed to find member roles" }),
    );
  }
};
