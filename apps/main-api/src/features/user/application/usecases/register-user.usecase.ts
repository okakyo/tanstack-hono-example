import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import type { CreateUserDto } from "@/features/user/domains/users.input";
import {
  type RegisterUserResponse,
  registerUserResponseSchema,
} from "@/features/user/domains/users.response";
import type { UserRepository } from "@/features/user/user.repository";

/**
 * 新しいユーザーを登録する
 *
 * @param repository - ユーザーリポジトリ
 * @returns ユーザー登録のユースケース関数
 */
export type RegisterUserResult = Result<RegisterUserResponse, HTTPException>;

export const registerUserUseCase =
  (repository: UserRepository) =>
  async (user: CreateUserDto): Promise<RegisterUserResult> => {
    try {
      const [result] = await repository.create(user);
      if (!result) {
        return err(
          new HTTPException(422, { message: "Failed to register user" }),
        );
      }

      // レスポンスデータの検証
      const parsedResponse = v.safeParse(registerUserResponseSchema, {
        ...result,
        createdAt: result.createdAt ?? null,
        updatedAt: result.updatedAt ?? null,
      });

      if (!parsedResponse.success) {
        return err(
          new HTTPException(500, {
            message: "登録されたユーザーのデータが無効です",
          }),
        );
      }

      return ok(parsedResponse.output);
    } catch (_error) {
      return err(new HTTPException(500, { message: "Internal server error" }));
    }
  };
