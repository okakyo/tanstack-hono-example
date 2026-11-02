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

  type MembersGetResponse = InferResponseType<
    typeof honoApiClient.members.$get,
    200
  >;

  const {
    data: memberPage = { data: [], totalCount: 0 },
    isLoading,
    error,
    isFetching,
  } = useQuery<{ data: MembersGetResponse["data"]; totalCount: number }, Error>({
    queryKey: [
      "memberList",
      currentTenantId ?? queryParams.tenantId,
      queryParams.page,
      queryParams.searchText,
      queryParams.sortBy.field,
      queryParams.sortBy.order,
    ],
    queryFn: async () => {
      const response = await executeWithAutoReauth(
        (headers) =>
          honoApiClient.members.$get(
            {
              query: {
                limit: "10",
                page: String(queryParams.page),
                sortBy: queryParams.sortBy.field,
                orderBy: queryParams.sortBy.order,
              },
            },
            { headers },
          ),
        async (result) => {
          const getTotalCount = result.headers.get("X-Total-Count");
          const totalCount = getTotalCount
            ? Number.parseInt(getTotalCount, 10)
            : 0;
          const payload = await result.json();

          return {
            data: payload.data ?? [],
            totalCount,
          };
        },
        {
          tenantId: queryParams.tenantId,
          defaultErrorMessage: "メンバー一覧の取得に失敗しました。",
        },
      );

      return response;
    },
    placeholderData: (previousData) => previousData,
    enabled: !!queryParams.accessToken && !queryParams.authLoading,
  });

  return {
    members: memberPage.data ?? [],
    totalCount: memberPage.totalCount ?? 0,
    isLoading: queryParams.authLoading || isLoading,
    isFetching,
    error,
  };
};
