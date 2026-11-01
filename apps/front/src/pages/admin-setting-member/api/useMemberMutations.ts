import { honoApiClient } from "@repo/main-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";

export const useMemberMutations = () => {
  const queryClient = useQueryClient();
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();

  const deleteMember = useMutation({
    mutationFn: async (memberId: string) => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.members[":memberId"].$delete(
            { param: { memberId } },
            { headers },
          ),
        async (response) => {
          return await response.json();
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "メンバーの削除に失敗しました。",
        },
      );
    },
    onSuccess: async (data) => {
      toaster.create({
        type: data.success ? "success" : "error",
        description: data.success
          ? "メンバーを削除しました。"
          : "メンバーの削除に失敗しました。",
      });
      await queryClient.invalidateQueries({
        queryKey: ["memberList"],
        exact: false,
      });
    },
    onError: () => {
      toaster.create({
        type: "error",
        description: "メンバーの削除処理でエラーが発生しました。",
      });
    },
  });

  return {
    deleteMember,
  };
};
