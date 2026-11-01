import { Box, Icon, Text } from "@chakra-ui/react";
import { useMatchRoute } from "@tanstack/react-router";
import { useAuth } from "@/shareds/provider";
import { isGuestRole } from "@/shareds/provider/auth/authorization";
import { BaseLink } from "@/shareds/ui/base-link";
import {
  ADMIN_SETTING_SIDEBAR_LIST,
  COMMON_SIDEBAR_LIST,
} from "./sidebar.const";

export const TheSidebar = () => {
  const matchRoute = useMatchRoute();
  const { user } = useAuth();
  const isSettingsRoute =
    matchRoute({ to: "/settings/companies", fuzzy: true }) ||
    matchRoute({ to: "/settings/members", fuzzy: true }) ||
    matchRoute({ to: "/settings/roles", fuzzy: true });

  const sidebarList = isGuestRole(user?.role)
    ? isSettingsRoute
      ? []
      : COMMON_SIDEBAR_LIST
    : isSettingsRoute
      ? ADMIN_SETTING_SIDEBAR_LIST
      : COMMON_SIDEBAR_LIST;

  // メインのサイドバー

  // サイドバー

  const isActive = (to: string) => {
    return matchRoute({ to, fuzzy: true });
  };

  return (
    <Box
      py={8}
      px={6}
      width={"240px"}
      height="full"
      position="fixed"
      hideBelow="md"
    >
      <Box spaceY="16px">
        {sidebarList.map((item) => (
          <BaseLink
            key={item.to}
            to={item.to}
            color={!isActive(item.to) ? "gray.700" : "primary"}
            variant="ghost"
            display="flex"
            justifyContent="flex-start"
            px={"12px"}
            py={"24px"}
            width="full"
            cursor="pointer"
          >
            <Icon as={item.icon} fontSize="xl" mr={3} />
            <Text fontSize="md" fontWeight="bold">
              {item.title}
            </Text>
          </BaseLink>
        ))}
      </Box>
    </Box>
  );
};
