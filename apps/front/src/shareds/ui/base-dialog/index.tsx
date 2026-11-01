import { Box, Dialog, Flex, Portal, Stack } from "@chakra-ui/react";
import type * as React from "react";
import { BaseButton } from "../base-button";

type BaseDialogRootProps = React.ComponentProps<typeof Dialog.Root>;

export type BaseDialogProps = Omit<
  BaseDialogRootProps,
  "children" | "open" | "onOpenChange"
> & {
  open: boolean;
  onOpenChange: NonNullable<BaseDialogRootProps["onOpenChange"]>;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  contentProps?: Omit<React.ComponentProps<typeof Dialog.Content>, "children">;
};

/**
 * フォームや確認操作で使う共通ダイアログです。
 */
export const BaseDialog = (props: BaseDialogProps) => {
  const {
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    contentProps,
    ...rootProps
  } = props;

  const handleClose = () => {
    onOpenChange({ open: false });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} {...rootProps}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="100dvh"
          px={4}
        >
          <Dialog.Content width="full" maxW="lg" {...contentProps}>
            <Stack gap={6} padding={6}>
              <Stack gap={2}>
                <Dialog.Title>{title}</Dialog.Title>
                {description ? (
                  <Dialog.Description>{description}</Dialog.Description>
                ) : null}
              </Stack>

              {children ? <Box>{children}</Box> : null}

              <Flex justify="flex-end" gap={3}>
                {footer ?? (
                  <BaseButton variant="outline" onClick={handleClose}>
                    閉じる
                  </BaseButton>
                )}
              </Flex>
            </Stack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
