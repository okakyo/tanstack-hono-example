import { honoApiClient, type InferResponseType } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
/**
 * プロフィールページで表示する所属テナント一覧を取得するカスタムフック
 * 現在の所属テナントは API 側で除外されています
 */
export const useProfileTenantData = (params: {
  accessToken: string | null;
  tenantId?: string | null;
  authLoading: boolean;
}) => {
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();

  type UserTenantsGet = typeof honoApiClient.auth.user.tenants.$get;
  type UserTenantsData = InferResponseType<UserTenantsGet, 200>["data"];

  const {
    data: tenantData = [],
    isLoading,
    error,
  } = useQuery<UserTenantsData["tenants"], Error>({
    queryKey: ["profile", "tenants", currentTenantId],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.auth.user.tenants.$get(
            {},
            {
              headers: {
                ...headers,
                "X-Tenant-Id": currentTenantId ?? "",
              },
            },
          ),
        async (result) => {
          const response = await result.json();
          return response.data?.tenants ?? [];
        },
        {
          tenantId: params.tenantId,
          defaultErrorMessage: "所属テナント情報の取得に失敗しました",
        },
      );
    },
    enabled: !!params.accessToken && !params.authLoading,
    staleTime: 1000 * 60 * 5,
  });

  return {
    tenantData,
    isLoading: params.authLoading || isLoading,
    error,
  };
};
