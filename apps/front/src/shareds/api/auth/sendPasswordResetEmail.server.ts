import { createSupabaseServerClient } from "../supabase.server";

/**
 * パスワードリセットリクエストを送信する
 * サーバー専用: Supabase Auth を使用してパスワードリセット用のメールを送信します
 *
 * @param email - パスワードをリセットするユーザーのメールアドレス
 * @returns Supabase のレスポンス
 */
export const sendPasswordResetEmail = async (email: string) => {
  const supabase = createSupabaseServerClient();

  // パスワードリセット用のリダイレクトURLを設定
  // 本番環境のURLまたは開発環境のURLを使用
  const baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:3000";
  const redirectTo = `${baseUrl}/password-reset`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
