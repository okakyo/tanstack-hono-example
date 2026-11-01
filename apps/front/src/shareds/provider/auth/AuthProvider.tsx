import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect } from "react";
import { AUTH_QUERY_KEY, authSessionQueryOptions } from "./authQuery";
import { AUTH_SESSION_INVALIDATION_ERROR_NAME } from "./constants";
import type { AuthContextValue, AuthSession } from "./type";

export const AuthContext = createContext<AuthContextValue | null>(null);
export type AuthProviderProps = {
  children: ReactNode;
};

/**
 * 認証情報をオプショナルで取得するフック
 * SSR時や未認証時でもエラーを投げず、nullを返します
 * @returns 認証状態（accessToken, currentTenantId, isLoading）
 */
export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // currentTenantId: → Supabase の tenantId ではなく、アプリケーション側で管理しているテナントIDを返すように変更
  return {
    user: value.user,
    accessToken: value.accessToken,
    currentTenantId: value.currentTenantId,
    currentCompanyId: value.currentCompanyId,
    selectableTenants: value.selectableTenants,
    isLoading: value.isLoading,
  };
}

/**
 * 認証状態をアプリ全体で共有する Provider
 * - Supabase のユーザー情報を 1 箇所で取得し、重複取得を防ぎます
 * - getUser() を使用することで、Supabase Auth サーバーで認証を検証し、セキュリティを向上させます
 * - TanStack Query を使用してキャッシングと自動再取得を実現します
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const INTERNAL_SERVER_ERROR_PATH = "/500";

  const isInvalidationError = useCallback((error: unknown) => {
    return (
      error instanceof Error &&
      error.name === AUTH_SESSION_INVALIDATION_ERROR_NAME
    );
  }, []);

  const { data, isLoading, error } = useQuery<AuthSession>({
    ...authSessionQueryOptions,
    retry: (failureCount, queryError) => {
      if (isInvalidationError(queryError)) {
        return false;
      }

      return failureCount < 1;
    },
  });

  useEffect(() => {
    if (!isInvalidationError(error)) {
      return;
    }

    queryClient.setQueryData(AUTH_QUERY_KEY, {
      user: null,
      accessToken: null,
      currentTenantId: null,
      currentCompanyId: null,
      selectableTenants: [],
    } satisfies AuthSession);

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/signin"
    ) {
      window.location.replace("/signin");
    }
  }, [error, queryClient, isInvalidationError]);

  useEffect(() => {
    if (!error || isInvalidationError(error)) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== INTERNAL_SERVER_ERROR_PATH
    ) {
      window.location.replace(INTERNAL_SERVER_ERROR_PATH);
    }
  }, [error, isInvalidationError]);

  const session: AuthSession = data ?? {
    user: null,
    accessToken: null,
    currentTenantId: null,
    currentCompanyId: null,
    selectableTenants: [],
  };

  return (
    <AuthContext.Provider value={{ isLoading, ...session }}>
      {children}
    </AuthContext.Provider>
  );
};
