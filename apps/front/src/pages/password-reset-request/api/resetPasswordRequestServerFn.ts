import { createServerFn } from "@tanstack/react-start";
import { sendPasswordResetEmail } from "@/shareds/api/auth/sendPasswordResetEmail.server";
import { resetPasswordRequestInputDtoSchema } from "./schema";

/**
 * パスワードリセットリクエストのサーバー関数
 *
 * メールアドレスを受け取り、パスワードリセット用のメールを送信します。
 */
export const resetPasswordRequestServerFn = createServerFn()
  .inputValidator(resetPasswordRequestInputDtoSchema)
  .handler(async ({ data }) => {
    return await sendPasswordResetEmail(data.email);
  });
