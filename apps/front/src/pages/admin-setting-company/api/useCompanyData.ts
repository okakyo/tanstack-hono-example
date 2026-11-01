import { honoApiClient, type InferResponseType } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";

/**
 * 企業一覧データを取得します。
 */
type CompaniesGetResponse = InferResponseType<
  typeof honoApiClient.companies.$get,
  200
>;

export const useCompanyData = (queryParams: {
  page: number;
  searchText: string;
  sortBy: {
    field: string;
    order: "asc" | "desc";
  };
  tenantId: string | null;
  currentCompanyId: string | null;
  accessToken: string | null;
  authLoading?: boolean;
}) => {
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();
  const {
    data: companyPage = { data: [], totalCount: 0 },
    isLoading,
    error,
    isFetching,
  } = useQuery<
    { data: CompaniesGetResponse["data"]; totalCount: number },
    Error
  >({
    queryKey: [
      "companyList",
      queryParams.page,
      queryParams.searchText,
      queryParams.sortBy.field,
      queryParams.sortBy.order,
      queryParams.currentCompanyId,
    ],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.companies.$get(
            {
              query: {
                limit: "10",
                page: String(queryParams.page),
                name: queryParams.searchText || undefined,
                sortBy: queryParams.sortBy.field,
                orderBy: queryParams.sortBy.order,
                excludeCompanyId: queryParams.currentCompanyId || undefined,
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

          return { data, totalCount };
        },
        {
          tenantId: queryParams.tenantId,
          defaultErrorMessage: "Failed to fetch company list",
        },
      );
    },
    placeholderData: (previousData) => previousData,
    enabled: !!queryParams.accessToken && !queryParams.authLoading,
  });

  return {
    companies: companyPage.data ?? [],
    totalCount: companyPage.totalCount ?? 0,
    isLoading: queryParams.authLoading || isLoading,
    isFetching,
    error,
  };
};
