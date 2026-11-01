import { honoApiClient } from "@repo/main-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";
import type { UpdateUserDto } from "../model/profile.input";

/**
 * プロフィール情報を更新するカスタムフック
 *
 * @param params - アクセストークンとテナントID
 * @returns プロフィール更新のミューテーション
 */
export const useUpdateProfile = (params: {
  accessToken: string | null;
  tenantId?: string | null;
}) => {
  const queryClient = useQueryClient();
  const { executeWithAutoReauth } = useAuthApiRequest();
  const { currentTenantId } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.users[":userId"].$put(
            {
              param: { userId: data.id },
              json: data,
            },
            {
              headers: {
                ...headers,
                "X-Tenant-Id": currentTenantId ?? "",
              },
            },
          ),
        async (result) => {
          return await result.json();
        },
        {
          tenantId: params.tenantId,
          defaultErrorMessage: "プロフィールの更新に失敗しました。",
        },
      );
    },
    onSuccess: () => {
      toaster.create({
        type: "success",
        description: "プロフィールの更新に成功しました！",
      });
      // プロフィールデータのキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] });
    },
  });
};
