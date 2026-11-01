import { Button, type ButtonProps } from "@chakra-ui/react";

export type BaseButtonProps = ButtonProps;

export const BaseButton = (props: BaseButtonProps) => {
  const { ...rest } = props;
  return (
    <Button rounded="lg" fontWeight="bold" {...rest}>
      {props.children}
    </Button>
  );
};
