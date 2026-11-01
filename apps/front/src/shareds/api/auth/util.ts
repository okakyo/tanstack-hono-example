import { getCookies, setCookie } from "@tanstack/react-start/server";
import { AUTH_SESSION_INVALIDATION_ERROR_NAME } from "@/shareds/provider/auth/constants";
import type { AuthSession } from "@/shareds/provider/auth/type";
import {
  CURRENT_TENANT_COOKIE_MAX_AGE,
  CURRENT_TENANT_COOKIE_NAME,
} from "./const";

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export const readResponseData = <T>(payload: unknown): T | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const wrapped = payload as Partial<ApiSuccessResponse<T>>;
  if ("data" in wrapped && wrapped.data !== undefined) {
    return wrapped.data ?? null;
  }

  return payload as T;
};

export const isSupabaseRefreshTokenError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    code?: string;
    message?: string;
    name?: string;
  };

  if (candidate.code === "refresh_token_not_found") {
    return true;
  }

  if (candidate.name === AUTH_SESSION_INVALIDATION_ERROR_NAME) {
    return true;
  }

  return (
    typeof candidate.message === "string" &&
    /invalid refresh token|refresh token not found/i.test(candidate.message)
  );
};

export const createSessionInvalidationError = (error: unknown) => {
  const message =
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "認証セッションが無効です。再度ログインしてください。";

  const invalidationError = new Error(message);
  invalidationError.name = AUTH_SESSION_INVALIDATION_ERROR_NAME;
  return invalidationError;
};

export const getCurrentTenantCookie = () => {
  const currentTenantId = getCookies()[CURRENT_TENANT_COOKIE_NAME];

  if (typeof currentTenantId !== "string" || currentTenantId.length === 0) {
    return null;
  }

  return currentTenantId;
};

export const setCurrentTenantCookie = (tenantId: string | null) => {
  setCookie(CURRENT_TENANT_COOKIE_NAME, tenantId ?? "", {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: tenantId ? CURRENT_TENANT_COOKIE_MAX_AGE : 0,
  });
};

export const clearAuthCookies = () => {
  const cookieNames = Object.keys(getCookies());

  for (const cookieName of cookieNames) {
    if (cookieName === CURRENT_TENANT_COOKIE_NAME || /^sb-/i.test(cookieName)) {
      setCookie(cookieName, "", {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
  }

  setCurrentTenantCookie(null);
};

export const createFallbackUser = (
  user: {
    id: string;
    email?: string | null;
    user_metadata?: { name?: string | null };
  } | null,
): AuthSession["user"] => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.user_metadata?.name ?? user.email ?? user.id,
    currentTenantName: null,
    currentCompanyId: null,
    companyName: null,
    role: null,
  };
};
