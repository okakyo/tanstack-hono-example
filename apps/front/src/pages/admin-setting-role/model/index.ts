import type { ColumnDef } from "@tanstack/react-table";
import type { MemberRoleEntity } from "./admin-setting-role.response";

export type AdminSettingRolePageProps = {
  data: MemberRoleEntity[];
  columns: ColumnDef<MemberRoleEntity>[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  searchText: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (sortBy: { field: string; order: "asc" | "desc" }) => void;
  sortState: { field: string; order: "asc" | "desc" } | null;
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
};
