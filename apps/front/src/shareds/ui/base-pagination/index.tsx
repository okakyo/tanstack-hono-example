import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  type PaginationRootProps,
} from "./ui/pagination";

export type BasePaginationProps = PaginationRootProps;

export const BasePagination = (props: BasePaginationProps) => (
  <PaginationRoot variant="solid" colorPalette="blue" {...props}>
    <HStack>
      <PaginationPrevTrigger />
      <PaginationItems />
      <PaginationNextTrigger />
    </HStack>
  </PaginationRoot>
);
