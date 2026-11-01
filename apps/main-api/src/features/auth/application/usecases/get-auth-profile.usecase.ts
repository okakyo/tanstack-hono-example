import { HTTPException } from "hono/http-exception";
import { err, ok, type Result } from "neverthrow";
import type { AuthRepository } from "@/features/auth/auth.repository";

export type GetAuthProfileResponse = {
  id: string;
  name: string;
  email: string;
};

export type GetAuthProfileResult = Result<
  GetAuthProfileResponse,
  HTTPException
>;

export const getAuthProfileUseCase = async (
  authUserId: string,
  repository: AuthRepository,
): Promise<GetAuthProfileResult> => {
  try {
    const loggedInUser =
      await repository.userRepository.findByAuthUserId(authUserId);

    if (!loggedInUser) {
      return err(
        new HTTPException(404, { message: "ユーザーが見つかりません。" }),
      );
    }

    return ok({
      id: loggedInUser.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
    });
  } catch (_error) {
    return err(
      new HTTPException(500, {
        message:
          _error instanceof Error ? _error.message : "Internal server error",
      }),
    );
  }
};
