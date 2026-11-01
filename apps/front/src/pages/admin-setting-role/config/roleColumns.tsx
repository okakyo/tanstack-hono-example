import type { ColumnDef } from "@tanstack/react-table";
import type { MemberRoleEntity } from "../model/admin-setting-role.response";

/**
 * ロール設定一覧テーブルのカラム定義を生成します。
 */
export const createRoleColumns = (): ColumnDef<MemberRoleEntity>[] => {
  return [
    {
      header: "ロール名",
      accessorKey: "role",
      enableSorting: false,
    },
    {
      header: "説明",
      accessorKey: "description",
      cell: ({ row }) => row.original.description ?? "-",
      enableSorting: false,
    },
  ];
};
