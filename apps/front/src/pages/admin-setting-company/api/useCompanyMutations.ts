import { honoApiClient } from "@repo/main-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";

export const useCompanyMutations = () => {
  const queryClient = useQueryClient();
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();

  const deleteCompany = useMutation({
    mutationFn: async (companyId: string) => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.companies[":companyId"].$delete(
            { param: { companyId } },
            {
              headers: {
                ...headers,
                "X-Tenant-Id": currentTenantId || "",
              },
            },
          ),
        async (response) => {
          return await response.json();
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "企業の削除に失敗しました。",
        },
      );
    },
    onSuccess: async (data) => {
      toaster.create({
        type: data.success ? "success" : "error",
        description: data.success
          ? "企業を削除しました。"
          : "企業の削除に失敗しました。",
      });
      await queryClient.invalidateQueries({
        queryKey: ["companyList"],
        exact: false,
      });
    },
    onError: () => {
      toaster.create({
        type: "error",
        description: "企業の削除処理でエラーが発生しました。",
      });
    },
  });

  return {
    deleteCompany,
  };
};
