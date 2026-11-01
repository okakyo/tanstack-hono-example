import {
  honoApiClient,
  type InferRequestType,
  type InferResponseType,
} from "@repo/main-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { MemberForm, type MemberFormData } from "@/features/member-form";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";

/**
 * メンバー新規作成ページです。
 */
export const MemberCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();

  type MemberRolesGet = (typeof honoApiClient)["member-roles"]["$get"];
  type MemberRolesGetData = InferResponseType<MemberRolesGet, 200>["data"];
  type MembersPostJson = InferRequestType<
    typeof honoApiClient.members.$post
  >["json"];

  const { data: roles = [], isLoading: loadingRoles } = useQuery<
    MemberRolesGetData,
    Error
  >({
    queryKey: ["memberRoleList", currentTenantId],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient["member-roles"].$get({ query: {} }, { headers }),
        async (result) => {
          const payload = await result.json();
          return payload.data ?? [];
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "ロール一覧の取得に失敗しました。",
        },
      );
    },
  });

  const createMember = useMutation({
    mutationFn: async (form: MemberFormData) => {
      // メンバー作成 API は既存ユーザーをメールアドレスで特定するため、name は送信しない
      const json: MembersPostJson = {
        email: form.email,
        memberRoleId: form.memberRoleId,
      };
      return await executeWithAutoReauth(
        (headers) => honoApiClient.members.$post({ json }, { headers }),
        async (result) => {
          return await result.json();
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "メンバーの作成に失敗しました。",
        },
      );
    },
    onSuccess: async () => {
      toaster.create({
        type: "success",
        description: "メンバーを作成しました。",
      });
      await queryClient.invalidateQueries({
        queryKey: ["memberList"],
        exact: false,
      });
      navigate({ to: "/settings/members" });
    },
    onError: (error: Error) => {
      toaster.create({ type: "error", description: error.message });
    },
  });

  return (
    <MemberForm
      title="メンバー作成"
      submitText="作成"
      roles={roles}
      isLoading={loadingRoles || createMember.isPending}
      onCancel={() => navigate({ to: "/settings/members" })}
      onSubmit={async (form) => {
        await createMember.mutateAsync(form);
      }}
    />
  );
};
