import { honoApiClient } from "@repo/main-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { CompanyForm, type CompanyFormData } from "@/features/company-form";
import { useAuth } from "@/shareds/provider";
import { isAdminRole } from "@/shareds/provider/auth/authorization";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";

/**
 * 企業編集ページです。
 */
export const CompanyEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams({
    from: "/(authenticated)/_authenticated/settings/companies/$id",
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

  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: ["companyDetail", id],
    queryFn: async () => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.companies[":companyId"].$get(
            { param: { companyId: id } },
            { headers },
          ),
        async (result) => {
          const payload = (await result.json()) as {
            data: {
              id: string;
              name: string;
              isSupplier?: boolean | null;
              phone: string | null;
              address: string | null;
            };
          };
          return payload.data;
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "企業情報の取得に失敗しました。",
        },
      );
    },
    enabled: isQueryEnabled,
  });

  const updateCompany = useMutation({
    mutationFn: async (form: CompanyFormData) => {
      return await executeWithAutoReauth(
        (headers) =>
          honoApiClient.companies[":companyId"].$put(
            {
              param: { companyId: id },
              json: {
                name: form.name,
                isSupplier: form.isSupplier ?? false,
                phone: form.phone || null,
                address: form.address || null,
                thumbnail: null,
              },
            },
            { headers },
          ),
        async (result) => {
          return await result.json();
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "企業の更新に失敗しました。",
        },
      );
    },
    onSuccess: async () => {
      toaster.create({ type: "success", description: "企業を更新しました。" });
      await queryClient.invalidateQueries({
        queryKey: ["companyList"],
        exact: false,
      });
      await queryClient.invalidateQueries({ queryKey: ["companyDetail", id] });
      navigate({ to: "/settings/companies" });
    },
    onError: (error: Error) => {
      toaster.create({ type: "error", description: error.message });
    },
  });

  return (
    <CompanyForm
      title={canManage ? "企業編集" : "企業詳細"}
      submitText="更新"
      defaultValues={{
        name: company?.name ?? "",
        isSupplier: company?.isSupplier ?? false,
        phone: company?.phone ?? "",
        address: company?.address ?? "",
      }}
      isLoading={loadingCompany || authLoading || updateCompany.isPending}
      readOnly={!canManage}
      onCancel={() => navigate({ to: "/settings/companies" })}
      onSubmit={async (form) => {
        await updateCompany.mutateAsync(form);
      }}
    />
  );
};
