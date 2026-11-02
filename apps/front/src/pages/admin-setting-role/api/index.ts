import { useMemo } from "react";
import { useAuth } from "@/shareds/provider";
import { useTableControls } from "../../admin-setting-member/api/useControl";
import { createRoleColumns } from "../config/roleColumns";
import type { AdminSettingRolePageProps } from "../model";
import { useRoleData } from "./useRoleData";

/**
 * ロール設定ページに必要な状態とハンドラーを統合します。
 */
export const useAdminSettingRolePageHooks = (): AdminSettingRolePageProps => {
  const { queryParams, searchText, onSearch, onSortChange, onPageChange } =
    useTableControls({
      defaultSort: { field: "role", order: "asc" },
    });
  const { isLoading: authLoading, accessToken, currentTenantId } = useAuth();

  const { roles, totalCount, isLoading, isFetching, error } = useRoleData({
    page: queryParams.page,
    searchText: queryParams.searchText,
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
    searchText,
    totalCount,
    page: queryParams.page,
    onPageChange,
  };
};
