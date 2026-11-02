import { useLocation, useNavigate } from "@tanstack/react-router";
import { debounce } from "es-toolkit";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TableSortState = {
  field: string;
  order: "asc" | "desc";
};

export type TableQueryState = {
  searchText: string;
  sortBy: TableSortState;
  page: number;
};

const DEFAULT_TABLE_SORT: TableSortState = {
  field: "updatedAt",
  order: "desc",
};

export const parseTableSearchParams = (
  search: string | URLSearchParams | Record<string, unknown>,
  defaultSort: TableSortState = DEFAULT_TABLE_SORT,
): TableQueryState => {
  const urlSearchParams =
    typeof search === "string"
      ? new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
      : search instanceof URLSearchParams
        ? search
        : new URLSearchParams(
            Object.entries(search).flatMap(([key, value]) => {
              if (value === undefined || value === null) {
                return [];
              }

              return [[key, String(value)]];
            }),
          );

  const rawPage = Number.parseInt(urlSearchParams.get("page") ?? "1", 10);
  const rawSortBy = urlSearchParams.get("sortBy") ?? defaultSort.field;
  const rawOrder = urlSearchParams.get("order") ?? defaultSort.order;

  return {
    searchText: urlSearchParams.get("q") ?? "",
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    sortBy: {
      field: rawSortBy || defaultSort.field,
      order:
        rawOrder === "asc" || rawOrder === "desc"
          ? rawOrder
          : defaultSort.order,
    },
  };
};

export const buildTableSearchParams = (
  queryState: Partial<TableQueryState>,
  defaultSort: TableSortState = DEFAULT_TABLE_SORT,
): Record<string, string | number> => {
  const nextSearch: Record<string, string | number> = {};

  if (queryState.searchText?.trim()) {
    nextSearch.q = queryState.searchText.trim();
  }

  const page = queryState.page ?? 1;
  if (page > 1) {
    nextSearch.page = page;
  }

  const sortBy = queryState.sortBy ?? defaultSort;
  if (
    sortBy.field !== defaultSort.field ||
    sortBy.order !== defaultSort.order
  ) {
    nextSearch.sortBy = sortBy.field;
    nextSearch.order = sortBy.order;
  }

  return nextSearch;
};

export const mergeTableSearchParams = (
  previousSearch: Record<string, string | undefined>,
  nextState: Partial<TableQueryState>,
  defaultSort: TableSortState,
): Record<string, string | number | undefined> => {
  const clearedSearch = { ...previousSearch };
  delete clearedSearch.q;
  delete clearedSearch.page;
  delete clearedSearch.sortBy;
  delete clearedSearch.order;

  return {
    ...clearedSearch,
    ...buildTableSearchParams(nextState, defaultSort),
  };
};

export const useTableControls = (options?: {
  defaultSort?: TableSortState;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultSort = options?.defaultSort ?? DEFAULT_TABLE_SORT;
  const queryParams = useMemo(
    () => parseTableSearchParams(location.search, defaultSort),
    [defaultSort, location.search],
  );
  const [searchText, setSearchText] = useState(queryParams.searchText);

  useEffect(() => {
    setSearchText(queryParams.searchText);
  }, [queryParams.searchText]);

  const syncSearchParams = useCallback(
    (nextState: Partial<TableQueryState>) => {
      const currentSearch = Object.fromEntries(
        new URLSearchParams(location.search),
      );
      const nextSearch = { ...currentSearch };
      delete nextSearch.q;
      delete nextSearch.page;
      delete nextSearch.sortBy;
      delete nextSearch.order;

      navigate({
        search: ((prev: Record<string, string | undefined> | undefined) => {
          const previousSearch = prev ?? {};
          return mergeTableSearchParams(
            previousSearch,
            {
              searchText: nextState.searchText ?? queryParams.searchText,
              page: nextState.page ?? queryParams.page,
              sortBy: nextState.sortBy ?? queryParams.sortBy,
            },
            defaultSort,
          );
        }) as any,
        replace: true,
      });
    },
    [
      defaultSort,
      navigate,
      queryParams.page,
      queryParams.searchText,
      queryParams.sortBy,
      location.search,
    ],
  );

  const handleDebounce = useMemo(
    () =>
      debounce((value: string) => {
        syncSearchParams({
          searchText: value,
          page: 1,
        });
      }, 500),
    [syncSearchParams],
  );

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;
      setSearchText(nextValue);
      handleDebounce(nextValue);
    },
    [handleDebounce],
  );

  const onSortChange = useCallback(
    (nextSort: { field: string; order: "asc" | "desc" }) => {
      syncSearchParams({
        sortBy: nextSort,
        page: 1,
      });
    },
    [syncSearchParams],
  );

  const onPageChange = useCallback(
    (nextPage: number) => {
      syncSearchParams({
        page: nextPage,
      });
    },
    [syncSearchParams],
  );

  useEffect(() => {
    return () => {
      handleDebounce.cancel();
    };
  }, [handleDebounce]);

  return {
    queryParams,
    searchText,
    onSearch,
    onSortChange,
    onPageChange,
  };
};
