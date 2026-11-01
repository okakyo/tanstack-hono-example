import { createServerFn } from "@tanstack/react-start";
import { signOut } from "@/shareds/api";

/**
 * サインアウト用のサーバー関数
 * Supabase Auth を使用してユーザーをサインアウトします
 */
export const signoutServerFn = createServerFn().handler(async () => {
  return await signOut();
});
