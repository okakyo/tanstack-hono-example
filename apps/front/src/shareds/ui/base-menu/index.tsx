import {
  Icon,
  Menu,
  type MenuContentProps,
  type MenuRootProps,
  Portal,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import { BaseButton } from "../base-button";

export type BaseMenuProps = {
  triggerButton?: React.ReactNode;
  menuContentProps?: MenuContentProps;
  children?: React.ReactNode;
} & MenuRootProps;

export const BaseMenu = (props: BaseMenuProps) => {
  const { children, triggerButton, menuContentProps, ...rest } = props;
  return (
    <Menu.Root {...rest}>
      <Menu.Trigger asChild>
        {triggerButton ?? (
          <BaseButton
            colorPalette="gray"
            size="xs"
            variant="ghost"
            color="gray.600"
          >
            <Icon size="xs" as={FaEllipsisV} />
          </BaseButton>
        )}
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content {...menuContentProps}>{children}</Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
