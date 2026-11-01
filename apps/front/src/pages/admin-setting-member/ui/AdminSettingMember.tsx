import { Box, Flex, Heading, Icon, InputGroup, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import { MdSearch } from "react-icons/md";
import { BaseInput } from "@/shareds/ui/base-input";
import { BaseTable } from "@/shareds/ui/base-table";
import type { AdminSettingMemberPageProps } from "../model";
import type { MemberListItemEntity } from "../model/admin-setting-member.response";

/**
 * メンバー設定一覧ページUIを描画します。
 */
export const AdminSettingMemberPageUi = (
  props: AdminSettingMemberPageProps,
) => {
  const MemberTable = BaseTable<MemberListItemEntity>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8} width="100%">
        <Flex align="center" gapX={6}>
          <Heading as="h1" size="2xl">
            メンバー設定
          </Heading>
          {props.canManage && (
            <Link asChild>
              <RouterLink to="/settings/members/create">
                <Box as="span" fontWeight="bold" fontSize="lg">
                  新規作成
                </Box>
              </RouterLink>
            </Link>
          )}
        </Flex>
      </Flex>

      <Flex mb={6}>
        <InputGroup
          startElement={<Icon as={MdSearch} size="md" />}
          width="360px"
        >
          <BaseInput
            rounded="md"
            placeholder="ユーザー検索"
            aria-label="ユーザー検索"
            onChange={props.onSearch}
          />
        </InputGroup>
      </Flex>
      <MemberTable {...props} />
    </Box>
  );
};
