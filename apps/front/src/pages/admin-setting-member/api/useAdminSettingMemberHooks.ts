import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAuth } from "@/shareds/provider";
import { isAdminRole } from "@/shareds/provider/auth/authorization";
import { createMemberColumns } from "../config/memberColumns";
import type { AdminSettingMemberPageProps } from "../model";
import { useTableControls } from "./useControl";
import { useInviteStatusData } from "./useInviteStatusData";
import { useMemberData } from "./useMemberData";
import { useMemberMutations } from "./useMemberMutations";

/**
 * メンバー設定ページに必要な状態とハンドラーを統合します。
 */
export const useAdminSettingMemberPageHooks =
  (): AdminSettingMemberPageProps => {
    const navigate = useNavigate();
    const { queryParams, onSearch, onSortChange, onPageChange } =
      useTableControls();
    const {
      isLoading: authLoading,
      accessToken,
      currentTenantId,
      user,
    } = useAuth();
    const canManage = isAdminRole(user?.role);
    const { deleteMember } = useMemberMutations();

    const { members, totalCount, isLoading, isFetching, error } = useMemberData(
      {
        ...queryParams,
        tenantId: currentTenantId,
        accessToken,
        authLoading,
      },
    );
    const {
      inviteStatuses,
      isLoading: isInviteStatusesLoading,
      isFetching: isInviteStatusesFetching,
      error: inviteStatusesError,
    } = useInviteStatusData({
      tenantId: currentTenantId,
      accessToken,
      authLoading,
    });

    const inviteStatusLookup = useMemo(() => {
      return Object.fromEntries(
        inviteStatuses.map((status) => [status.id, status.name]),
      );
    }, [inviteStatuses]);

    const columns = useMemo(
      () =>
        createMemberColumns(
          (id) => deleteMember.mutate(id),
          canManage,
          inviteStatusLookup,
        ),
      [deleteMember, canManage, inviteStatusLookup],
    );

    const onClickRow = (id: string) => {
      navigate({ to: "/settings/members/$id", params: { id } });
    };

    return {
      canManage,
      data: members,
      columns,
      totalCount,
      isLoading: isLoading || isInviteStatusesLoading,
      isFetching: isFetching || isInviteStatusesFetching,
      error: error ?? inviteStatusesError,
      onSearch,
      onSortChange,
      sortState: queryParams.sortBy,
      page: queryParams.page,
      onPageChange,
      onClickRow,
    };
  };
