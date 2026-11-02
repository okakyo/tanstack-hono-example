import { Box, Icon, Text } from "@chakra-ui/react";
import { useMatchRoute } from "@tanstack/react-router";
import { useAuth } from "@/shareds/provider";
import { BaseLink } from "@/shareds/ui/base-link";
import { getSidebarItems, isSettingsSidebarRoute } from "./sidebar.const";

export const TheSidebar = () => {
  const matchRoute = useMatchRoute();
  const { user } = useAuth();
  const isSettingsRoute = isSettingsSidebarRoute(matchRoute);
  const sidebarList = getSidebarItems(user?.role, isSettingsRoute);
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
