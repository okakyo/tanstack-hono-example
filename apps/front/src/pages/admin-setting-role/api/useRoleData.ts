import { honoApiClient, type InferResponseType } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
/**
 * ロール一覧データを取得します。
 */
export const useRoleData = (queryParams: {
  page: number;
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

  type MemberRolesGetResponse = InferResponseType<
    (typeof honoApiClient)["member-roles"]["$get"],
    200
  >;

  const {
    data: rolePage = { data: [], totalCount: 0 },
    isLoading,
    error,
    isFetching,
  } = useQuery<
    { data: MemberRolesGetResponse["data"]; totalCount: number },
    Error
  >({
    queryKey: [
      "memberRoleList",
      queryParams.tenantId,
      queryParams.page,
      queryParams.sortBy.field,
      queryParams.sortBy.order,
    ],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient["member-roles"].$get(
            {
              query: {
                limit: "10",
                page: String(queryParams.page),
                sortBy: queryParams.sortBy.field,
                orderBy: queryParams.sortBy.order,
              },
            },
            {
              headers: {
                ...headers,
                "X-Tenant-Id": currentTenantId ?? "",
              },
            },
          ),
        async (result) => {
          const getTotalCount = result.headers.get("X-Total-Count");
          const totalCount = getTotalCount
            ? Number.parseInt(getTotalCount, 10)
            : 0;
          const { data } = await result.json();
          return { data: data ?? [], totalCount };
        },
        {
          tenantId: queryParams.tenantId,
          defaultErrorMessage: "Failed to fetch member role list",
        },
      );
    },
    placeholderData: (previousData) => previousData,
    enabled: !!queryParams.accessToken && !queryParams.authLoading,
  });

  return {
    roles: rolePage.data ?? [],
    totalCount: rolePage.totalCount ?? 0,
    isLoading: queryParams.authLoading || isLoading,
    isFetching,
    error,
  };
};
