import { honoApiClient, type InferResponseType } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";

/**
 * メンバー一覧データを取得します。
 */
export const useMemberData = (queryParams: {
  page: number;
  searchText: string;
  sortBy: {
    field: string;
    order: "asc" | "desc";
  };
  tenantId: string | null;
  accessToken: string | null;
  authLoading?: boolean;
}) => {
  const { executeWithAutoReauth } = useAuthApiRequest();
  const { currentTenantId } = useAuth();

  type MembersGet = typeof honoApiClient.members.$get;

  const {
    data: members = [],
    isLoading,
    error,
    isFetching,
  } = useQuery<InferResponseType<MembersGet, 200>["data"], Error>({
    queryKey: ["memberList", currentTenantId ?? queryParams.tenantId],
    queryFn: async () => {
      const response = await executeWithAutoReauth(
        (headers) =>
          honoApiClient.members.$get(
            {
              query: {},
            },
            { headers },
          ),
        async (result) => {
          const payload = await result.json();
          return payload.data ?? [];
        },
        {
          tenantId: queryParams.tenantId,
          defaultErrorMessage: "メンバー一覧の取得に失敗しました。",
        },
      );

      return response;
    },
    enabled: !!queryParams.accessToken && !queryParams.authLoading,
  });

  return {
    members,
    totalCount: members.length,
    isLoading: queryParams.authLoading || isLoading,
    isFetching,
    error,
  };
};
