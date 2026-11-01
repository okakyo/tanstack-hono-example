import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "./AuthProvider";
import { authServerFn } from "./authServerFn";
import { AUTH_SESSION_INVALIDATION_ERROR_NAME } from "./constants";
import type { AuthSession } from "./type";

const AUTH_QUERY_KEY = ["auth", "session"] as const;

export class SessionExpiredError extends Error {
  constructor(
    message = "認証の有効期限が切れました。再度ログインしてください。",
  ) {
    super(message);
    this.name = "SessionExpiredError";
  }
}

export class ApiResponseError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
  }
}

type RequestOptions = {
  tenantId?: string | null;
  defaultErrorMessage: string;
};

const readErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.clone().json()) as { message?: string };
    return payload.message;
  } catch {
    return undefined;
  }
};

const createApiResponseError = async (
  response: Response,
  defaultErrorMessage: string,
) => {
  const detail = await readErrorMessage(response);

  if (response.status === 500) {
    console.error("[API 500] Internal Server Error", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      message: detail ?? defaultErrorMessage,
    });
  }

  return new ApiResponseError(response.status, detail ?? defaultErrorMessage);
};

const isAuthSessionInvalidationError = (error: unknown) => {
  return (
    error instanceof Error &&
    error.name === AUTH_SESSION_INVALIDATION_ERROR_NAME
  );
};

export const useAuthApiRequest = () => {
  const queryClient = useQueryClient();
  const { accessToken, currentTenantId } = useAuth();
  const getAuthSession = useServerFn(authServerFn);

  const refreshAuthSession = async () => {
    try {
      return await queryClient.fetchQuery<AuthSession>({
        queryKey: AUTH_QUERY_KEY,
        queryFn: () => getAuthSession(),
        staleTime: 0,
        retry: false,
      });
    } catch (error) {
      if (isAuthSessionInvalidationError(error)) {
        queryClient.setQueryData(AUTH_QUERY_KEY, {
          user: null,
          accessToken: null,
          currentTenantId: null,
          currentCompanyId: null,
          selectableTenants: [],
        } satisfies AuthSession);
      }

      throw error;
    }
  };

  const executeWithAutoReauth = async <T>(
    request: (headers: Record<string, string>) => Promise<Response>,
    parse: (response: Response) => Promise<T>,
    options: RequestOptions,
  ) => {
    if (!accessToken) {
      throw new SessionExpiredError(
        "認証情報が見つかりません。再度ログインしてください。",
      );
    }

    const resolveTenantId = options.tenantId ?? currentTenantId;
    const includeTenant = !!resolveTenantId;

    const buildHeaders = (token: string): Record<string, string> => {
      return {
        Authorization: `Bearer ${token}`,
        ...(includeTenant ? { "X-Tenant-Id": String(resolveTenantId) } : {}),
      };
    };

    const firstResponse = await request(buildHeaders(accessToken));

    if (firstResponse.status === 401) {
      let refreshedSession: AuthSession;

      try {
        refreshedSession = await refreshAuthSession();
      } catch (error) {
        if (isAuthSessionInvalidationError(error)) {
          throw new SessionExpiredError(
            "現在のテナント情報が無効です。再度ログインしてください。",
          );
        }

        throw error;
      }

      const retriedToken = refreshedSession.accessToken;

      if (!retriedToken) {
        queryClient.setQueryData(AUTH_QUERY_KEY, {
          user: null,
          accessToken: null,
          currentTenantId: null,
          currentCompanyId: null,
          selectableTenants: [],
        } satisfies AuthSession);
        throw new SessionExpiredError();
      }

      const retriedResponse = await request(buildHeaders(retriedToken));
      if (!retriedResponse.ok) {
        throw await createApiResponseError(
          retriedResponse,
          options.defaultErrorMessage,
        );
      }

      return await parse(retriedResponse);
    }
    if (!firstResponse.ok) {
      throw await createApiResponseError(
        firstResponse,
        options.defaultErrorMessage,
      );
    }

    return await parse(firstResponse);
  };

  return {
    executeWithAutoReauth,
  };
};
