import { useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAuth } from "@/shareds/provider";
import { isAdminRole } from "@/shareds/provider/auth/authorization";
import { createCompanyColumns } from "../config/companyColumns";
import type { AdminSettingCompanyPageProps } from "../model";
import { useCompanyData } from "./useCompanyData";
import { useCompanyMutations } from "./useCompanyMutations";
import { useTableControls } from "./useControl";

/**
 * 企業設定ページに必要な状態とハンドラーを統合します。
 */
export const useAdminSettingCompanyPageHooks =
  (): AdminSettingCompanyPageProps => {
    const navigate = useNavigate();
    const location = useLocation();
    const { queryParams, searchText, onSearch, onSortChange, onPageChange } =
      useTableControls();
    const {
      isLoading: authLoading,
      accessToken,
      currentTenantId,
      currentCompanyId,
      user,
    } = useAuth();
    const canManage = isAdminRole(user?.role);
    const { deleteCompany } = useCompanyMutations();

    const { companies, totalCount, isLoading, isFetching, error } =
      useCompanyData({
        ...queryParams,
        tenantId: currentTenantId,
        currentCompanyId,
        accessToken,
        authLoading,
      });

    const columns = useMemo(
      () => createCompanyColumns((id) => deleteCompany.mutate(id), canManage),
      [deleteCompany, canManage],
    );

    const onClickRow = (id: string) => {
      navigate({
        to: "/settings/companies/$id",
        params: { id },
        search: location.search,
      });
    };

    return {
      canManage,
      data: companies,
      columns,
      totalCount,
      isLoading,
      isFetching,
      error,
      onSearch,
      onSortChange,
      sortState: queryParams.sortBy,
      searchText,
      page: queryParams.page,
      onPageChange,
      onClickRow,
    };
  };
