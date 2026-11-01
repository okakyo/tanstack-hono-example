import { queryOptions } from "@tanstack/react-query";
import { notFound, redirect } from "@tanstack/react-router";
import { getTanstackQueryContext } from "@/shareds/config";
import { isAdminRole } from "./authorization";
import { authServerFn } from "./authServerFn";
import type { AuthSession } from "./type";

export const AUTH_QUERY_KEY = ["auth", "session"] as const;

const EMPTY_AUTH_SESSION: AuthSession = {
  user: null,
  accessToken: null,
  currentTenantId: null,
  currentCompanyId: null,
  selectableTenants: [],
};

/**
 * 認証セッションを TanStack Query で一元管理します。
 */
export const authSessionQueryOptions = queryOptions<AuthSession>({
  queryKey: AUTH_QUERY_KEY,
  queryFn: () => authServerFn(),
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});

/**
 * 認証セッションを取得し、未取得時は空のセッションを返します。
 */
export const ensureAuthSession = async () => {
  const { queryClient } = getTanstackQueryContext();
  return (
    (await queryClient.ensureQueryData(authSessionQueryOptions)) ??
    EMPTY_AUTH_SESSION
  );
};

/**
 * 未認証ユーザーをサインイン画面へリダイレクトします。
 */
export const requireAuthenticatedSession = async () => {
  const session = await ensureAuthSession();

  if (!session.accessToken) {
    throw redirect({ to: "/signin" });
  }

  return session;
};

/**
 * 管理者専用ルートへのアクセスを検証します。
 */
export const requireAdminAccess = async () => {
  const session = await requireAuthenticatedSession();

  if (!isAdminRole(session.user?.role)) {
    throw notFound();
  }

  return session;
};
