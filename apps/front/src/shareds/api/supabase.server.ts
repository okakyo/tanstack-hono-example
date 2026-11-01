import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 環境変数が設定されているか確認
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase の環境変数が設定されていません。.env.local ファイルを確認してください。",
  );
}

/**
 * Supabase サーバークライアントを作成する
 * サーバー専用: @tanstack/react-start/server の getCookies, setCookie を使用
 */
export const createSupabaseServerClient = () => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      // OAuth の URL コールバック処理は main-api 側で行うため、ここでは無効
    },
    cookieOptions: {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    cookies: {
      getAll: () => {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          setCookie(name, value, options);
        });
      },
    },
  });
};
