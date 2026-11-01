import { honoApiClient } from "@repo/main-api";
import { useQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { type ProfileData, profileDataSchema } from "../model";

/**
 * プロフィールデータを取得するカスタムフック
 * /auth/user/profile エンドポイントからプロフィール情報を取得します
 *
 * @param params - アクセストークンと認証ローディング状態
 * @returns プロフィールデータ、ローディング状態、エラー情報
 */
export const useProfileData = (params: {
  accessToken: string | null;
  tenantId?: string | null;
  authLoading: boolean;
}) => {
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery<ProfileData, Error>({
    queryKey: ["profile", "user", params.tenantId],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.auth.user.profile.$get(
            {},
            {
              headers: {
                ...headers,
                "X-Tenant-Id": currentTenantId || "",
              },
            },
          ),
        async (result) => {
          const payload = await result.json();
          return v.parse(profileDataSchema, payload.data);
        },
        {
          tenantId: params.tenantId,
          defaultErrorMessage: "プロフィール情報の取得に失敗しました",
        },
      );
    },
    enabled: !!params.accessToken && !params.authLoading,
    staleTime: 1000 * 60 * 5,
  });

  return {
    profileData: profileData ?? null,
    isLoading: params.authLoading || isLoading,
    error,
  };
};
