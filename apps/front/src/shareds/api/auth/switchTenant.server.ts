import { honoApiClient } from "@repo/main-api";
import { createSupabaseServerClient } from "../supabase.server";
import { getAuthSession } from "./getAuthSession.server";
import { setCurrentTenantCookie } from "./util";

export const switchTenant = async (tenantId: string) => {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token ?? null;

  if (!accessToken) {
    throw new Error("アクセストークンが取得できませんでした。");
  }

  try {
    const response = await honoApiClient.auth.user["switch-tenant"].$post(
      {
        json: { tenantId },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(
        errorPayload?.message ?? "テナントの切り替えに失敗しました。",
      );
    }

    setCurrentTenantCookie(tenantId);
    await getAuthSession(tenantId);
  } catch (error) {
    console.error("テナントの切り替え中にエラーが発生しました:", error);
    throw error;
  }
};
