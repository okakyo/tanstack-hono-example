import {
  Box,
  Flex,
  HStack,
  Icon,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  type ColumnDef,
  flexRender,
  type SortDirection,
  type Table as TableType,
} from "@tanstack/react-table";
import { useCallback } from "react";
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from "react-icons/lu";
import { BasePagination } from "../base-pagination";
import { useBaseTableHooks } from "./hooks";

/**
 * カラムのメタデータ型定義
 * ColumnDef の meta プロパティに設定することで、カラムごとの動作をカスタマイズできます
 */
export interface BaseTableColumnMeta {
  /**
   * このカラムのセルをクリックしても行のonClickRowを発火させない
   * チェックボックスやアクションボタンなど、独自のクリックハンドラーを持つカラムに使用
   * @default false
   */
  disableRowClick?: boolean;
}

export const BaseTable = <TData extends { id: string }>({
  columns,
  data,
  totalCount,
  isLoading,
  error,
  onClickRow,
  onSortChange,
  sortState,
  page = 1,
  pageSize = 10,
  onPageChange,
  onFilterChange,
  filterState,
  disableRowHover = false,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  bodyStyle?: React.CSSProperties;
  onClickRow?: (id: string) => void;
  onSortChange?: (sortBy: { field: string; order: "asc" | "desc" }) => void;
  sortState?: { field: string; order: "asc" | "desc" } | null;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: { field: string; value: string }[]) => void;
  filterState?: { field: string; value: string }[];
  /** データフェッチ中かどうか（初回ロード以外）。trueの場合でもデータは表示されたまま */
  isFetching?: boolean;
  disableRowHover?: boolean;
}) => {
  const { table } = useBaseTableHooks({
    columns,
    data,
    pageCount: Math.ceil(totalCount / pageSize),
    page,
    sortState,
    filterState,
  });

  // Note: onFilterChange は将来的にカラムごとのフィルターUIから呼び出される予定
  // 現在は検索バーで onSearch を使用しているため、ここでは使用していない
  void onFilterChange;

  const SortableIcon = useCallback(
    (canSort: boolean, sortDirection: false | SortDirection) => {
      if (!canSort) {
        return <Box w={"14px"} />;
      }
      if (sortDirection === "asc") {
        return <Icon as={LuArrowUp} />;
      }

      if (sortDirection === "desc") {
        return <Icon as={LuArrowDown} />;
      }

      return <Icon as={LuArrowUpDown} color={"gray.400"} />;
    },
    [],
  );

  const handleClickRow = (id: string) => {
    if (onClickRow) {
      onClickRow(id);
    }
  };

  const BaseTableBody = useCallback(
    ({
      isLoading,
      error,
      table,
      onClickRow,
    }: {
      isLoading: boolean;
      error: Error | null;
      table: TableType<TData>;
      onClickRow: (id: string) => void;
    }) => {
      // 初回ロード時のみSpinnerを表示（データが空の場合）
      if (isLoading && table.getRowModel().rows.length === 0)
        return (
          <Table.Row>
            <Table.Cell justifyItems="center" colSpan={5} rowSpan={3}>
              <Flex width="full" justify="center">
                <Spinner size="xl" />
              </Flex>
            </Table.Cell>
          </Table.Row>
        );
      if (error)
        return (
          <Table.Row>
            <Table.Cell justifyItems="center" colSpan={5} rowSpan={3}>
              <Text>{error.message}</Text>
            </Table.Cell>
          </Table.Row>
        );
      return (
        <>
          {table.getRowModel().rows.map((row) => {
            return (
              <Table.Row
                key={row.id}
                _hover={disableRowHover ? undefined : { bgColor: "gray.100" }}
                onClick={() => {
                  onClickRow(row.original.id || "");
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnMeta = cell.column.columnDef.meta as
                    | BaseTableColumnMeta
                    | undefined;
                  const disableRowClick = columnMeta?.disableRowClick ?? false;

                  return (
                    <Table.Cell
                      key={cell.id}
                      width={cell.column.getSize()}
                      onClick={(e) => {
                        if (disableRowClick) {
                          e.stopPropagation();
                        }
                      }}
                      cursor={
                        disableRowClick || disableRowHover
                          ? "default"
                          : "pointer"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </>
      );
    },
    [disableRowHover],
  );

  return (
    <HStack gap="16px" display="flex" flexDirection="column">
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader
                  key={header.id}
                  onClick={() => {
                    if (onSortChange && header.column.getCanSort()) {
                      const isActive =
                        sortState?.field === header.column.id
                          ? sortState.order
                          : false;
                      const newOrder = isActive === "asc" ? "desc" : "asc";
                      table.setSorting([
                        {
                          id: header.column.id,
                          desc: newOrder === "desc",
                        },
                      ]);
                      onSortChange({
                        field: header.column.id,
                        order: newOrder,
                      });
                    }
                  }}
                  cursor={header.column.getCanSort() ? "pointer" : "default"}
                  fontWeight={"bold"}
                >
                  <Box
                    fontSize="md"
                    lineClamp={1}
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {SortableIcon(
                      header.column.getCanSort(),
                      header.column.getIsSorted(),
                    )}
                  </Box>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          <BaseTableBody
            isLoading={isLoading}
            error={error}
            table={table}
            onClickRow={handleClickRow}
          />
        </Table.Body>
      </Table.Root>
      <Box
        position="sticky"
        bottom={0}
        left={{ base: "24px", md: "calc(240px + 24px)" }}
        right="24px"
        backgroundColor="white"
        zIndex={20}
        paddingY="12px"
        width="100%"
      >
        <BasePagination
          display="flex"
          justifyContent="flex-end"
          py={3}
          size="sm"
          count={totalCount}
          page={page}
          pageSize={pageSize}
          onPageChange={(details) => {
            if (onPageChange) {
              onPageChange(details.page);
            }
          }}
        />
      </Box>
    </HStack>
  );
};
