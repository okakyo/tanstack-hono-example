import { HTTPException } from "hono/http-exception";
import { err, ok } from "neverthrow";
import type { UpdateUserDto } from "@/features/user/domains/users.input";
import type { UserRepository } from "@/features/user/user.repository";

/**
 * ユーザープロフィールを編集する
 *
 * @param repository - ユーザーリポジトリ
 * @returns プロフィール編集のユースケース関数
 */
export const editProfileUseCase =
  (repository: UserRepository) =>
  async (userId: string, user: UpdateUserDto) => {
    try {
      const existingUser = await repository.findById(userId);
      if (!existingUser) {
        return err(new HTTPException(404, { message: "User not found" }));
      }

      const result = await repository.update(userId, user);
      if (!result) {
        return err(
          new HTTPException(422, { message: "Failed to update user" }),
        );
      }
      return ok(result);
    } catch (_error) {
      return err(
        new HTTPException(500, {
          message:
            _error instanceof Error ? _error.message : "Internal server error",
        }),
      );
    }
  };
