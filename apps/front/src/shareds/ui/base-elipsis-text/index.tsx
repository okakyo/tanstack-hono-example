import { Text, type TextProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BaseTooltip, type BaseTooltipProps } from "../base-tooltip";

export type BaseEllipsisTextProps = {
  children: ReactNode;
  tooltip?: Omit<BaseTooltipProps, "children">;
} & TextProps;

export const BaseEllipsisText = ({
  children,
  tooltip,
  ...rest
}: BaseEllipsisTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, []);

  return (
    <BaseTooltip {...tooltip} disabled={!isTruncated} content={children}>
      <Text ref={textRef} {...rest}>
        {children}
      </Text>
    </BaseTooltip>
  );
};
