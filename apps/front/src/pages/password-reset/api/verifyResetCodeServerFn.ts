import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { verifyPasswordResetCode } from "@/shareds/api/auth/updatePassword.server";

/**
 * パスワードリセットコード検証用のスキーマ
 */
const verifyResetCodeSchema = v.object({
  code: v.string(),
});

/**
 * パスワードリセットコードを検証するサーバー関数
 *
 * URLから取得したcodeを使ってSupabaseセッションを確立します
 */
export const verifyResetCodeServerFn = createServerFn()
  .inputValidator(verifyResetCodeSchema)
  .handler(async ({ data }) => {
    await verifyPasswordResetCode(data.code);
    return { success: true };
  });
