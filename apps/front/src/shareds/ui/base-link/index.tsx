import { Button, type ButtonProps } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export type BaseLinkProps = {
  to: string;
  children: React.ReactNode;
};

export const BaseLink = ({
  to,
  children,
  ...rest
}: BaseLinkProps & ButtonProps) => {
  return (
    <Button asChild as={Link} {...rest}>
      <Link to={to}>{children}</Link>
    </Button>
  );
};
