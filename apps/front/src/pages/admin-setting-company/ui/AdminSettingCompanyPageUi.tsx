import {
  Box,
  Flex,
  Heading,
  Icon,
  InputGroup,
  Link,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import { MdSearch } from "react-icons/md";
import { BaseInput } from "@/shareds/ui/base-input";
import { BaseTable } from "@/shareds/ui/base-table";
import type { AdminSettingCompanyPageProps } from "../model";
import type { CompanyEntity } from "../model/admin-setting-company.response";

/**
 * 企業設定一覧ページUIを描画します。
 */
export const AdminSettingCompanyPageUi = (
  props: AdminSettingCompanyPageProps,
) => {
  const CompanyTable = BaseTable<CompanyEntity>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8} width="100%">
        <Flex align="center" gapX={6}>
          <Heading as="h1" size="2xl">
            企業設定
          </Heading>
          {props.canManage && (
            <Link asChild>
              <RouterLink to="/settings/companies/create">
                <Text fontWeight="bold" fontSize="lg">
                  新規作成
                </Text>
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
            placeholder="企業名（部分一致）"
            aria-label="企業名検索"
            value={props.searchText}
            onChange={props.onSearch}
          />
        </InputGroup>
      </Flex>
      <CompanyTable {...props} />
    </Box>
  );
};
