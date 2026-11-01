import { createClient } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";

const resolveSupabaseEnv = () => {
  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new HTTPException(500, {
      message:
        "Supabase Admin設定が不足しています。SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。",
    });
  }

  return {
    supabaseUrl,
    serviceRoleKey,
  };
};

const createSupabaseAdminClient = () => {
  const { supabaseUrl, serviceRoleKey } = resolveSupabaseEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const inviteAuthUserByEmail = async (email: string) => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    throw new HTTPException(400, {
      message: error.message,
    });
  }

  const authUserId = data.user?.id;
  if (!authUserId) {
    throw new HTTPException(500, {
      message: "招待ユーザーの作成に失敗しました。",
    });
  }

  return authUserId;
};

export const deleteAuthUserById = async (authUserId: string) => {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(authUserId);

  if (error) {
    throw new HTTPException(500, {
      message: "招待ユーザーの後処理に失敗しました。",
    });
  }
};
