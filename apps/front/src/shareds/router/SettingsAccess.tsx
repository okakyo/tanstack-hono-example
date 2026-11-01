import { Center, Spinner } from "@chakra-ui/react";
import { notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/shareds/provider";
import {
  isAdminRole,
  isGuestRole,
} from "@/shareds/provider/auth/authorization";

export const SettingsAccess = ({ children }: { children: ReactNode }) => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isGuestRole(user?.role)) {
    throw notFound();
  }

  return <>{children}</>;
};

export const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAdminRole(user?.role)) {
    throw notFound();
  }

  return <>{children}</>;
};
