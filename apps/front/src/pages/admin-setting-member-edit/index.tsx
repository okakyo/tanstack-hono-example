import {
  honoApiClient,
  type InferRequestType,
  type InferResponseType,
} from "@repo/main-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { MemberForm, type MemberFormData } from "@/features/member-form";
import { useAuth } from "@/shareds/provider";
import { isAdminRole } from "@/shareds/provider/auth/authorization";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";

/**
 * メンバー編集ページです。
 */
export const MemberEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams({
    from: "/(authenticated)/_authenticated/settings/members/$id",
  });
  const {
    isLoading: authLoading,
    accessToken,
    currentTenantId,
    user,
  } = useAuth();
  const canManage = isAdminRole(user?.role);
  const { executeWithAutoReauth } = useAuthApiRequest();
  const isQueryEnabled =
    !!id && !!currentTenantId && !!accessToken && !authLoading;
  type MemberRolesGet = (typeof honoApiClient)["member-roles"]["$get"];
  type MemberRolesGetData = InferResponseType<MemberRolesGet, 200>["data"];
  type MemberPut = (typeof honoApiClient.members)[":memberId"]["$put"];
  type MemberPutJson = InferRequestType<MemberPut>["json"];

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
    enabled: isQueryEnabled,
  });
  type MemberDetailResponseData = InferResponseType<
    (typeof honoApiClient.members)[":memberId"]["$get"],
    200
  >["data"];

  const { data: member, isLoading: loadingMember } = useQuery<
    MemberDetailResponseData | null,
    Error
  >({
    queryKey: ["memberDetail", id],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.members[":memberId"].$get(
            { param: { memberId: id } },
            { headers },
          ),
        async (result) => {
          const payload = await result.json();
          return payload.data ?? null;
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "メンバー情報の取得に失敗しました。",
        },
      );
    },
    enabled: isQueryEnabled,
  });

  const updateMember = useMutation({
    mutationFn: async (form: MemberFormData) => {
      const json: MemberPutJson = {
        name: form.name,
        email: form.email,
        memberRoleId: form.memberRoleId,
      };
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.members[":memberId"].$put(
            { param: { memberId: id }, json },
            { headers },
          ),
        async (result) => {
          return await result.json();
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "メンバーの更新に失敗しました。",
        },
      );
    },
    onSuccess: async () => {
      toaster.create({
        type: "success",
        description: "メンバーを更新しました。",
      });
      await queryClient.invalidateQueries({
        queryKey: ["memberList"],
        exact: false,
      });
      await queryClient.invalidateQueries({ queryKey: ["memberDetail", id] });
      navigate({ to: "/settings/members" });
    },
    onError: (error: Error) => {
      toaster.create({ type: "error", description: error.message });
    },
  });

  return (
    <MemberForm
      title={canManage ? "メンバー編集" : "メンバー詳細"}
      submitText="更新"
      roles={roles}
      defaultValues={{
        name: member?.user?.name ?? "",
        email: member?.user?.email ?? "",
        memberRoleId: member?.memberRoleId ?? "",
      }}
      isLoading={loadingRoles || loadingMember || updateMember.isPending}
      readOnly={!canManage}
      onCancel={() => navigate({ to: "/settings/members" })}
      onSubmit={async (form) => {
        await updateMember.mutateAsync(form);
      }}
    />
  );
};
