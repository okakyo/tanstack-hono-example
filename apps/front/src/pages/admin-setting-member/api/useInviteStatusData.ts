import { honoApiClient, type InferResponseType } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";

/**
 * 招待状態マスタ一覧を取得します。
 */

type InviteStatusesGetResponse = InferResponseType<
  (typeof honoApiClient)["invite-statuses"]["$get"],
  200
>;
type InviteStatusesGetResponseData = InviteStatusesGetResponse["data"];

export const useInviteStatusData = (queryParams: {
  tenantId: string | null;
  accessToken: string | null;
  authLoading?: boolean;
}) => {
  const { executeWithAutoReauth } = useAuthApiRequest();
  const {
    data: inviteStatuses = [],
    isLoading,
    error,
    isFetching,
  } = useQuery<InviteStatusesGetResponseData, Error>({
    queryKey: ["inviteStatusList", queryParams.tenantId],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) => honoApiClient["invite-statuses"].$get({}, { headers }),
        async (result) => {
          const { data } = await result.json();
          return data ?? [];
        },
        {
          tenantId: queryParams.tenantId,
          defaultErrorMessage: "Failed to fetch invite status list",
        },
      );
    },
    enabled: !!queryParams.accessToken && !queryParams.authLoading,
  });

  return {
    inviteStatuses,
    isLoading: queryParams.authLoading || isLoading,
    isFetching,
    error,
  };
};
