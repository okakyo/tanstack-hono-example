import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type FindInviteStatusesResponse,
  findInviteStatusesResponseSchema,
} from "@/features/invite-status/domains/invite-status.response";
import type { InviteStatusRepository } from "@/features/invite-status/invite-status.repository";

export type FindInviteStatusesResult = Result<
  FindInviteStatusesResponse,
  HTTPException
>;

/**
 * 招待状態マスタ一覧を取得します。
 */
export const findInviteStatusesUseCase = (
  repository: InviteStatusRepository,
) => {
  return async (): Promise<FindInviteStatusesResult> => {
    try {
      const result = await repository.find();
      const parsedResponse = v.safeParse(
        findInviteStatusesResponseSchema,
        result.map((status) => ({
          id: status.id,
          code: status.code,
          name: status.name,
          description: status.description ?? null,
        })),
      );

      if (!parsedResponse.success) {
        return err(
          new HTTPException(500, {
            message: "招待状態一覧データが無効です",
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
};
