import { createServerFn } from "@tanstack/react-start";
import { updatePassword } from "@/shareds/api/auth/updatePassword.server";
import { resetPasswordInputDtoSchema } from "./schema";

/**
 * パスワード更新のサーバー関数
 *
 * 新しいパスワードを受け取り、パスワードを更新します。
 */
export const updatePasswordServerFn = createServerFn()
  .inputValidator(resetPasswordInputDtoSchema)
  .handler(async ({ data }) => {
    return await updatePassword(data.password);
  });
