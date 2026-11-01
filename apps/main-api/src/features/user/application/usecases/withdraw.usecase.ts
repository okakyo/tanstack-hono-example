import { HTTPException } from "hono/http-exception";
import { err, ok } from "neverthrow";
import type { UserRepository } from "@/features/user/user.repository";

/**
 * ユーザーを退会させる
 *
 * @param repository - ユーザーリポジトリ
 * @returns ユーザー退会のユースケース関数
 */
export const withdrawUseCase =
  (repository: UserRepository) => async (userId: string) => {
    try {
      const existingUser = await repository.findById(userId);
      if (!existingUser) {
        return err(new HTTPException(404, { message: "User not found" }));
      }

      await repository.delete(userId);
      return ok(null);
    } catch (_error) {
      return err(
        new HTTPException(500, {
          message:
            _error instanceof Error ? _error.message : "Internal server error",
        }),
      );
    }
  };
