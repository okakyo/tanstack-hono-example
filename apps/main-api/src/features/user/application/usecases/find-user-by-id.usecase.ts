import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type FindUserByIdResponse,
  findUserByIdResponseSchema,
} from "@/features/user/domains/users.response";
import type { UserRepository } from "@/features/user/user.repository";

/**
 * IDでユーザーを取得する
 *
 * @param repository - ユーザーリポジトリ
 * @returns ユーザー取得のユースケース関数
 */
export type FindUserByIdResult = Result<FindUserByIdResponse, HTTPException>;

export const findUserByIdUseCase =
  (repository: UserRepository) =>
  async (userId: string): Promise<FindUserByIdResult> => {
    try {
      const user = await repository.findById(userId);
      if (!user) {
        return err(new HTTPException(404, { message: "User not found" }));
      }

      // レスポンスデータの検証
      const parsedResponse = v.safeParse(findUserByIdResponseSchema, {
        ...user,
        createdAt: user.createdAt ?? null,
        updatedAt: user.updatedAt ?? null,
      });

      if (!parsedResponse.success) {
        return err(
          new HTTPException(500, {
            message: "ユーザーデータが無効です",
          }),
        );
      }

      return ok(parsedResponse.output);
    } catch (_error) {
      return err(
        new HTTPException(500, {
          message:
            _error instanceof Error ? _error.message : "Internal server error",
        }),
      );
    }
  };
