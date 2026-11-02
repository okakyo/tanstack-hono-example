import { useMemo } from "react";
import { useAuth } from "@/shareds/provider";
import { createRoleColumns } from "../config/roleColumns";
import type { AdminSettingRolePageProps } from "../model";
import { useTableControls } from "./useControl";
import { useRoleData } from "./useRoleData";

/**
 * ロール設定ページに必要な状態とハンドラーを統合します。
 */
export const useAdminSettingRolePageHooks = (): AdminSettingRolePageProps => {
  const { queryParams, onSearch, onSortChange, onPageChange } =
    useTableControls();
  const { isLoading: authLoading, accessToken, currentTenantId } = useAuth();

  const { roles, totalCount, isLoading, isFetching, error } = useRoleData({
    page: queryParams.page,
    sortBy: queryParams.sortBy,
    tenantId: currentTenantId,
    accessToken,
    authLoading,
  });

  const columns = useMemo(() => createRoleColumns(), []);

  return {
    data: roles,
    columns,
    isLoading,
    isFetching,
    error,
    onSearch,
    onSortChange,
    sortState: queryParams.sortBy,
    totalCount,
    page: queryParams.page,
    onPageChange,
  };
};
