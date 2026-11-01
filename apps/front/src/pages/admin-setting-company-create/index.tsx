import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CompanyForm, type CompanyFormData } from "@/features/company-form";
import { useAuth } from "@/shareds/provider";
import { useAuthApiRequest } from "@/shareds/provider/auth/useAuthApiRequest";
import { toaster } from "@/shareds/ui/base-toaster";

/**
 * 企業新規作成ページです。
 */
export const CompanyCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentTenantId } = useAuth();
  const { executeWithAutoReauth } = useAuthApiRequest();

  const createCompany = useMutation({
    mutationFn: async (form: CompanyFormData) => {
      return await executeWithAutoReauth(
        (headers) =>
          fetch("http://localhost:3100/companies", {
            method: "POST",
            credentials: "include",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: form.name,
              isSupplier: form.isSupplier ?? false,
              phone: form.phone || null,
              address: form.address || null,
              thumbnail: null,
            }),
          }),
        async (result) => {
          return await result.json();
        },
        {
          tenantId: currentTenantId,
          defaultErrorMessage: "企業の作成に失敗しました。",
        },
      );
    },
    onSuccess: async () => {
      toaster.create({ type: "success", description: "企業を作成しました。" });
      await queryClient.invalidateQueries({
        queryKey: ["companyList"],
        exact: false,
      });
      navigate({ to: "/settings/companies" });
    },
    onError: (error: Error) => {
      toaster.create({ type: "error", description: error.message });
    },
  });

  return (
    <CompanyForm
      title="企業作成"
      submitText="作成"
      isLoading={createCompany.isPending}
      onCancel={() => navigate({ to: "/settings/companies" })}
      onSubmit={async (form) => {
        await createCompany.mutateAsync(form);
      }}
    />
  );
};
