import { Input, type InputProps } from "@chakra-ui/react";

export type BaseInputProps = InputProps;

export const BaseInput = (props: BaseInputProps) => {
  return <Input {...props} />;
};
