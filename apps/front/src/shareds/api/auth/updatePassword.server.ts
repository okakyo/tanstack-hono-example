import { createSupabaseServerClient } from "../supabase.server";

/**
 * パスワード更新用のサーバー関数
 *
 * @param newPassword - 新しいパスワード
 * @returns 更新後のユーザー情報
 */
export const updatePassword = async (newPassword: string) => {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * パスワードリセット用のコードを検証してセッションを確立する
 *
 * Supabaseのパスワードリセットメールには、codeパラメータが含まれています。
 * このcodeを使ってセッションを確立する必要があります。
 *
 * @param code - URLパラメータから取得したcode
 * @returns セッション確立の成否
 */
export const verifyPasswordResetCode = async (code: string) => {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};

/**
 * パスワードリセット用のトークンを検証してセッションを確立する（レガシー対応）
 *
 * 古いSupabaseの実装では、access_tokenとrefresh_tokenがURLハッシュに含まれます。
 *
 * @param accessToken - URLから取得したアクセストークン
 * @param refreshToken - URLから取得したリフレッシュトークン
 * @returns セッション確立の成否
 */
export const verifyPasswordResetTokens = async (
  accessToken: string,
  refreshToken: string,
) => {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};
