import { HStack, IconButton } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { formatDate } from "@/shareds/lib/formatter";
import { BaseButton } from "@/shareds/ui/base-button";
import { BaseDialog } from "@/shareds/ui/base-dialog";
import type { MemberListItemEntity } from "../model/admin-setting-member.response";

type MemberDeleteButtonProps = {
  memberId: string;
  onDelete: (id: string) => void;
};

const MemberDeleteButton = ({
  memberId,
  onDelete,
}: MemberDeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label="delete-member"
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
        title="このメンバーを削除しますか？"
        description="この操作は取り消せません。"
        footer={
          <HStack gap={3}>
            <BaseButton variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </BaseButton>
            <BaseButton
              colorPalette="red"
              onClick={() => {
                onDelete(memberId);
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
 * メンバー設定一覧テーブルのカラム定義を生成します。
 */
export const createMemberColumns = (
  onDelete: (id: string) => void,
  canManage: boolean,
  inviteStatusLookup: Record<string, string>,
): ColumnDef<MemberListItemEntity>[] => {
  const columns: ColumnDef<MemberListItemEntity>[] = [
    {
      header: "ユーザー名",
      accessorFn: (row) => row.user?.name ?? "-",
      id: "userName",
      enableSorting: false,
    },
    {
      header: "メールアドレス",
      accessorFn: (row) => row.user?.email ?? "-",
      id: "userEmail",
      enableSorting: false,
    },
    {
      header: "ロール名",
      accessorFn: (row) => row.memberRole?.role ?? "-",
      id: "memberRoleName",
      enableSorting: false,
    },
    {
      header: "招待状態",
      accessorKey: "inviteStatusId",
      cell: ({ row }) => {
        const inviteStatusId = row.original.inviteStatusId;
        const label = inviteStatusLookup[inviteStatusId];
        return label ?? `不明(${inviteStatusId})`;
      },
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
          <MemberDeleteButton memberId={row.original.id} onDelete={onDelete} />
        );
      },
    });
  }

  return columns;
};
