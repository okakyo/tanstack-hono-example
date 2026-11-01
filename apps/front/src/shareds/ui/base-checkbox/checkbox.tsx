import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import * as React from "react";

/**
 * Checkboxコンポーネントのプロパティ
 * @extends ChakraCheckbox.RootProps - Chakra UIのCheckbox.RootPropsを拡張
 */
export interface CheckboxProps extends ChakraCheckbox.RootProps {
  /** カスタムアイコン */
  icon?: React.ReactNode;
  /** 入力要素に渡すプロパティ */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** ルート要素の参照 */
  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * Checkboxコンポーネント
 * Chakra UI v3のCheckboxをラップした再利用可能なコンポーネント
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { icon, children, inputProps, rootRef, ...rest } = props;
    return (
      <ChakraCheckbox.Root ref={rootRef} {...rest}>
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control>
          {icon || <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>
        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  },
);
