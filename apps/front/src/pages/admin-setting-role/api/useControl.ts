import { debounce } from "es-toolkit";
import { useCallback, useEffect, useState } from "react";

/**
 * ロール設定ページの検索・ソート制御を管理します。
 */
export const useTableControls = () => {
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<{
    field: string;
    order: "asc" | "desc";
  }>({
    field: "role",
    order: "asc",
  });
  const [page, setPage] = useState(1);

  const handleDebounce = debounce((value: string) => {
    setSearchText(value);
  }, 700);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleDebounce(e.target.value);
      setPage(1);
    },
    [handleDebounce],
  );

  const onSortChange = useCallback(
    (nextSort: { field: string; order: "asc" | "desc" }) => {
      setSortBy(nextSort);
      setPage(1);
    },
    [],
  );

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  useEffect(() => {
    return () => {
      handleDebounce.cancel();
    };
  }, [handleDebounce]);

  return {
    queryParams: {
      searchText,
      sortBy,
      page,
    },
    onSearch,
    onSortChange,
    onPageChange,
  };
};
