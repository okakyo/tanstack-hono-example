import type { ColumnDef } from "@tanstack/react-table";
import type { MemberListItemEntity } from "./admin-setting-member.response";

export type AdminSettingMemberPageProps = {
  canManage: boolean;
  data: MemberListItemEntity[];
  columns: ColumnDef<MemberListItemEntity>[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (sortBy: { field: string; order: "asc" | "desc" }) => void;
  sortState: { field: string; order: "asc" | "desc" } | null;
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  onClickRow: (id: string) => void;
};
