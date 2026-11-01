import { useMemo } from "react";
import { useAuth } from "@/shareds/provider";
import { createRoleColumns } from "../config/roleColumns";
import type { AdminSettingRolePageProps } from "../model";
import type { MemberRoleEntity } from "../model/admin-setting-role.response";
import { useTableControls } from "./useControl";
import { useRoleData } from "./useRoleData";

const applyFilterAndSort = (
  items: MemberRoleEntity[],
  searchText: string,
  sortBy: { field: string; order: "asc" | "desc" },
) => {
  const loweredSearchText = searchText.trim().toLowerCase();

  const filtered = loweredSearchText
    ? items.filter((item) => {
        const record = item as MemberRoleEntity;
        const role = (record.role ?? "").toLowerCase();
        const description = (
          (record.description ?? "") as string
        ).toLowerCase();

        return (
          role.includes(loweredSearchText) ||
          description.includes(loweredSearchText)
        );
      })
    : items;

  return [...filtered].sort((a, b) => {
    const recordA = a as MemberRoleEntity;
    const recordB = b as MemberRoleEntity;
    const lhs = String(recordA[sortBy.field as keyof MemberRoleEntity] ?? "");
    const rhs = String(recordB[sortBy.field as keyof MemberRoleEntity] ?? "");
    const compareResult = lhs.localeCompare(rhs, "ja");

    return sortBy.order === "asc" ? compareResult : -compareResult;
  });
};

/**
 * ロール設定ページに必要な状態とハンドラーを統合します。
 */
export const useAdminSettingRolePageHooks = (): AdminSettingRolePageProps => {
  const { queryParams, onSearch, onSortChange } = useTableControls();
  const { isLoading: authLoading, accessToken, currentTenantId } = useAuth();

  const { roles, isLoading, isFetching, error } = useRoleData({
    tenantId: currentTenantId,
    accessToken,
    authLoading,
  });

  const columns = useMemo(() => createRoleColumns(), []);

  const data = useMemo(
    () => applyFilterAndSort(roles, queryParams.searchText, queryParams.sortBy),
    [roles, queryParams.searchText, queryParams.sortBy],
  );

  return {
    data,
    columns,
    isLoading,
    isFetching,
    error,
    onSearch,
    onSortChange,
    sortState: queryParams.sortBy,
    totalCount: data.length,
  };
};
