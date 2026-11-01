import { honoApiClient } from "@repo/main-api";
import type { AuthSession } from "@/shareds/provider/auth/type";
import { createSupabaseServerClient } from "../supabase.server";
import {
  clearAuthCookies,
  createFallbackUser,
  createSessionInvalidationError,
  getCurrentTenantCookie,
  isSupabaseRefreshTokenError,
  readResponseData,
  setCurrentTenantCookie,
} from "./util";

type AuthUserResponse = {
  id: string;
  name: string;
  currentTenantId: string;
  currentCompanyId: string;
  currentTenantName: string;
  companyName: string;
  memberRole: string;
};

type AuthTenantResponse = {
  tenants: Array<{
    tenantId: string;
    tenantName: string;
    companyId: string;
    companyName: string;
    memberRole: string;
  }>;
};

export const getAuthSession = async (
  fallbackTenantId?: string | null,
): Promise<AuthSession> => {
  const supabase = createSupabaseServerClient();
  const currentTenantIdFromCookie = getCurrentTenantCookie();
  const resolvedFallbackTenantId =
    fallbackTenantId ?? currentTenantIdFromCookie;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token ?? null;

    if (error || !user || !accessToken) {
      if (error && isSupabaseRefreshTokenError(error)) {
        clearAuthCookies();
        throw createSessionInvalidationError(error);
      }

      clearAuthCookies();
      return {
        user: null,
        accessToken: null,
        currentTenantId: null,
        currentCompanyId: null,
        selectableTenants: [],
      };
    }

    const fallbackUser = createFallbackUser(user);

    try {
      const getLoginUser = await honoApiClient.auth.user.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!getLoginUser.ok) {
        return {
          user: fallbackUser,
          accessToken,
          currentTenantId: resolvedFallbackTenantId,
          currentCompanyId: null,
          selectableTenants: [],
        };
      }

      const loginUserPayload = await getLoginUser.json();
      const loginUser = readResponseData<AuthUserResponse>(loginUserPayload);

      if (!loginUser) {
        return {
          user: fallbackUser,
          accessToken,
          currentTenantId: resolvedFallbackTenantId,
          currentCompanyId: null,
          selectableTenants: [],
        };
      }

      const resolvedCurrentTenantId = loginUser.currentTenantId ?? null;
      const resolvedCurrentCompanyId = loginUser.currentCompanyId ?? null;

      const currentUser: AuthSession["user"] = {
        id: loginUser.id,
        name: loginUser.name,
        currentTenantName: loginUser.currentTenantName,
        currentCompanyId: resolvedCurrentCompanyId,
        companyName: loginUser.companyName,
        role: loginUser.memberRole,
      };

      let selectableTenants: AuthSession["selectableTenants"] = [];

      if (resolvedCurrentTenantId) {
        selectableTenants.push({
          tenantId: resolvedCurrentTenantId,
          companyId: resolvedCurrentCompanyId ?? "",
          companyName: loginUser.companyName,
          memberRole: loginUser.memberRole,
        });
      }

      try {
        const getTenantList = await honoApiClient.auth.user.tenants.$get(
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (getTenantList.ok) {
          const tenantListPayload = await getTenantList.json();
          const tenantList =
            readResponseData<AuthTenantResponse>(tenantListPayload);

          const tenants = Array.isArray(tenantList?.tenants)
            ? tenantList.tenants
            : [];

          selectableTenants = [
            ...selectableTenants,
            ...tenants.map((tenant) => ({
              tenantId: tenant.tenantId,
              companyId: tenant.companyId,
              companyName: tenant.companyName,
              memberRole: tenant.memberRole,
            })),
          ].filter(
            (tenant, index, source) =>
              source.findIndex((item) => item.tenantId === tenant.tenantId) ===
              index,
          );
        }
      } catch (tenantError) {
        console.debug(
          "tenant情報の取得に失敗しましたが、認証状態は維持します:",
          tenantError,
        );

        setCurrentTenantCookie(resolvedCurrentTenantId);

        return {
          user: currentUser,
          accessToken,
          currentTenantId: resolvedCurrentTenantId,
          currentCompanyId: resolvedCurrentCompanyId,
          selectableTenants,
        };
      }

      setCurrentTenantCookie(resolvedCurrentTenantId);

      return {
        user: currentUser,
        accessToken,
        currentTenantId: resolvedCurrentTenantId,
        currentCompanyId: resolvedCurrentCompanyId,
        selectableTenants,
      };
    } catch (error) {
      console.debug(
        "tenant情報の取得に失敗しましたが、認証状態は維持します:",
        error,
      );
      return {
        user: fallbackUser,
        accessToken,
        currentTenantId: resolvedFallbackTenantId,
        currentCompanyId: null,
        selectableTenants: [],
      };
    }
  } catch (error) {
    if (isSupabaseRefreshTokenError(error)) {
      clearAuthCookies();
      throw createSessionInvalidationError(error);
    }

    console.debug(
      "認証セッションの取得に失敗しましたが、未認証として扱います:",
      error,
    );
    clearAuthCookies();
    return {
      user: null,
      accessToken: null,
      currentTenantId: null,
      currentCompanyId: null,
      selectableTenants: [],
    };
  }
};
