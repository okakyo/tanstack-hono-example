import { useEffect, useState } from "react";
import * as v from "valibot";
import { useAuth } from "@/shareds/provider";
import { toaster } from "@/shareds/ui/base-toaster";
import {
  type ProfileFormData,
  type ProfilePageUiProps,
  profileFormSchema,
} from "../model";
import { useProfileData } from "./useProfileData";
import { useProfileTenantData } from "./useProfileTenantData";
import { useUpdateProfile } from "./useUpdateProfile";

/**
 * プロフィールページの統合カスタムフック
 * 各種機能のhooksを組み合わせて、ページ全体の状態と動作を提供します
 *
 * @returns ProfilePageUiProps - プロフィールデータ、ローディング状態、エラー、フォーム機能
 */
export const useProfilePageHooks = (): ProfilePageUiProps => {
  const {
    isLoading: authLoading,
    accessToken,
    user,
    currentTenantId: tenantId,
  } = useAuth();

  const {
    profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useProfileData({
    accessToken,
    tenantId,
    authLoading,
  });

  const {
    tenantData,
    isLoading: tenantLoading,
    error: tenantError,
  } = useProfileTenantData({
    accessToken,
    tenantId,
    authLoading,
  });

  // フォームデータの状態管理
  const [formData, setFormData] = useState<ProfileFormData>({
    id: "",
    name: "",
    email: "",
  });

  // プロフィールデータが取得できたらフォームに反映
  useEffect(() => {
    if (profileData) {
      setFormData({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
      });
    }
  }, [profileData]);

  // プロフィール更新のミューテーション
  const updateMutation = useUpdateProfile({
    accessToken,
    tenantId,
  });

  /**
   * フォーム送信ハンドラー
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 入力値をスキーマで検証
    const parsed = v.safeParse(profileFormSchema, formData);
    if (!parsed.success) {
      toaster.create({
        type: "error",
        description:
          parsed.issues[0]?.message ?? "入力内容を確認してください。",
      });
      return;
    }

    // 更新APIを呼び出し（所属テナント情報は含めない）
    await updateMutation.mutateAsync({
      id: parsed.output.id,
      name: parsed.output.name,
      email: parsed.output.email,
    });
  };

  return {
    profileData,
    isLoading: profileLoading || tenantLoading,
    error: profileError ?? tenantError,
    currentTenant: {
      tenantId,
      tenantName: user?.currentTenantName ?? null,
      companyName: user?.companyName ?? null,
      memberRole: user?.role ?? null,
    },
    selectableTenants: tenantData,
    formData,
    setFormData,
    onSubmit,
    isUpdating: updateMutation.isPending,
    isSuccess: updateMutation.isSuccess,
  };
};
