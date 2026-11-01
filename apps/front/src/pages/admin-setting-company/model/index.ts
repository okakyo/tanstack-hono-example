import type { ColumnDef } from "@tanstack/react-table";
import type { CompanyEntity } from "./admin-setting-company.response";

export type AdminSettingCompanyPageProps = {
  canManage: boolean;
  data: CompanyEntity[];
  columns: ColumnDef<CompanyEntity>[];
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
