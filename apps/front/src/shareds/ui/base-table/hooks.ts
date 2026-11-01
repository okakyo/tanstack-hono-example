import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

export const useBaseTableHooks = <TData>({
  columns,
  data,
  pageCount,
  page = 1,
  sortState,
  filterState,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageCount?: number;
  page?: number;
  sortState?: { field: string; order: "asc" | "desc" } | null;
  filterState?: { field: string; value: string }[];
}) => {
  // props から直接 sorting state を構築
  const sorting: SortingState = sortState
    ? [{ id: sortState.field, desc: sortState.order === "desc" }]
    : [];

  // props から直接 columnFilters state を構築
  const columnFilters: ColumnFiltersState =
    filterState?.map((filter) => ({
      id: filter.field,
      value: filter.value,
    })) ?? [];

  // ページネーション state を props から構築
  const pagination = {
    pageIndex: page - 1, // UIは1始まり、tableは0始まり
    pageSize: 10,
  };

  const table = useReactTable({
    columns,
    data,
    pageCount: pageCount ?? -1,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection: {},
    },
    // onXxxChange は不要（manual mode で外部制御のため）
  });

  return {
    table,
  };
};
