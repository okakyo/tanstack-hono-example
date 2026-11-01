import { honoApiClient, type InferResponseType } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
/**
 * ロール一覧データを取得します。
 */
export const useRoleData = (queryParams: {
  tenantId: string | null;
  accessToken: string | null;
  authLoading?: boolean;
}) => {
  const { executeWithAutoReauth } = useAuthApiRequest();
  const { currentTenantId } = useAuth();

  type MemberRolesGet = (typeof honoApiClient)["member-roles"]["$get"];

  const {
    data: roles = [],
    isLoading,
    error,
    isFetching,
  } = useQuery<InferResponseType<MemberRolesGet, 200>["data"], Error>({
    queryKey: ["memberRoleList", queryParams.tenantId],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient["member-roles"].$get(
            {
              query: {},
            },
            {
              headers: {
                ...headers,
                "X-Tenant-Id": currentTenantId ?? "",
              },
            },
          ),
        async (result) => {
          const { data } = await result.json();
          return data ?? [];
        },
        {
          tenantId: queryParams.tenantId,
          defaultErrorMessage: "Failed to fetch member role list",
        },
      );
    },
    enabled: !!queryParams.accessToken && !queryParams.authLoading,
  });

  return {
    roles,
    isLoading: queryParams.authLoading || isLoading,
    isFetching,
    error,
  };
};
