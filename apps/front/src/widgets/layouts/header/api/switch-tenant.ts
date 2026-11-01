import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { switchTenant } from "@/shareds/api";
import { toaster } from "@/shareds/ui/base-toaster";

const AUTH_QUERY_KEY = ["auth", "session"] as const;
const TENANT_SWITCH_INVALIDATION_KEYS = [
  ["profile"],
  ["documentList"],
  ["documentDetails"],
  ["statuses"],
  ["tags"],
  ["companyPlanList"],
  ["companyList"],
  ["companyDetail"],
  ["memberRoleList"],
  ["memberList"],
  ["memberDetail"],
  ["statusList"],
] as const;

const switchTenantInputSchema = v.object({
  tenantId: v.pipe(v.string(), v.minLength(1, "tenantIdを指定してください。")),
});

export const switchTenantServerFn = createServerFn()
  .inputValidator(switchTenantInputSchema)
  .handler(async ({ data }) => {
    await switchTenant(data.tenantId);
  });

export const useSwitchTenant = () => {
  const queryClient = useQueryClient();

  const switchTenantMutation = useMutation({
    mutationFn: switchTenantServerFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: AUTH_QUERY_KEY,
          exact: true,
        }),
        ...TENANT_SWITCH_INVALIDATION_KEYS.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey, exact: false }),
        ),
      ]);

      toaster.create({
        type: "success",
        description: "テナントの切替に成功しました。",
      });

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (error: Error) => {
      toaster.create({
        type: "error",
        description:
          error.message || "テナントの切替中に予期しないエラーが発生しました。",
      });
    },
  });

  return switchTenantMutation;
};
