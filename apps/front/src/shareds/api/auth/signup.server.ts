import { createSupabaseServerClient } from "../supabase.server";

export type SignUpCredentials = {
  email: string;
  password: string;
};

/**
 * 新しいユーザーをサインアップする
 * サーバー専用: Supabase Auth を使用してユーザーを作成します
 */
export const signUpWithPassword = async (credentials: SignUpCredentials) => {
  const supabase = createSupabaseServerClient();
  const { data: response, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return response;
};
