import { HStack, IconButton } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { formatDate } from "@/shareds/lib/formatter";
import { BaseButton } from "@/shareds/ui/base-button";
import { BaseDialog } from "@/shareds/ui/base-dialog";
import type { CompanyEntity } from "../model/admin-setting-company.response";

type CompanyDeleteButtonProps = {
  companyId: string;
  onDelete: (id: string) => void;
};

const CompanyDeleteButton = ({
  companyId,
  onDelete,
}: CompanyDeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label="delete-company"
        variant="outline"
        size="sm"
        colorPalette="red"
        onClick={() => setOpen(true)}
      >
        <MdDelete />
      </IconButton>
      <BaseDialog
        open={open}
        onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
        title="この企業を削除しますか？"
        description="この操作は取り消せません。"
        footer={
          <HStack gap={3}>
            <BaseButton variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </BaseButton>
            <BaseButton
              colorPalette="red"
              onClick={() => {
                onDelete(companyId);
                setOpen(false);
              }}
            >
              削除
            </BaseButton>
          </HStack>
        }
      />
    </>
  );
};

/**
 * 企業設定一覧テーブルのカラム定義を生成します。
 */
export const createCompanyColumns = (
  onDelete: (id: string) => void,
  canManage: boolean,
): ColumnDef<CompanyEntity>[] => {
  const columns: ColumnDef<CompanyEntity>[] = [
    {
      header: "企業名",
      accessorKey: "name",
    },
    {
      header: "電話番号",
      accessorKey: "phone",
      enableSorting: false,
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      header: "住所",
      accessorKey: "address",
      enableSorting: false,
      cell: ({ row }) => row.original.address || "-",
    },
    {
      header: "更新日",
      accessorKey: "updatedAt",
      cell: ({ row }) => {
        const updatedAt = row.original.updatedAt;
        if (!updatedAt) {
          return "-";
        }
        return formatDate(new Date(updatedAt));
      },
    },
  ];

  if (canManage) {
    columns.push({
      header: "",
      accessorKey: "id",
      enableSorting: false,
      meta: {
        disableRowClick: true,
      },
      cell: ({ row }) => {
        return (
          <CompanyDeleteButton
            companyId={row.original.id}
            onDelete={onDelete}
          />
        );
      },
    });
  }

  return columns;
};
