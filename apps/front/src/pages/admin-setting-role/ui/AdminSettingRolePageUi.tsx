import { Box, Flex, Heading } from "@chakra-ui/react";
import { BaseTable } from "@/shareds/ui/base-table";
import type { AdminSettingRolePageProps } from "../model";
import type { MemberRoleEntity } from "../model/admin-setting-role.response";

/**
 * ロール設定一覧ページUIを描画します。
 */
export const AdminSettingRolePageUi = (props: AdminSettingRolePageProps) => {
  const RoleTable = BaseTable<MemberRoleEntity>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8} width="100%">
        <Heading as="h1" size="2xl">
          ロール設定
        </Heading>
      </Flex>
      <RoleTable
        data={props.data}
        columns={props.columns}
        totalCount={props.totalCount}
        isLoading={props.isLoading}
        error={props.error}
        onSortChange={props.onSortChange}
        sortState={props.sortState}
        disableRowHover
      />
    </Box>
  );
};
