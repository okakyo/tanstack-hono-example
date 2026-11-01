import {
  Avatar,
  Flex,
  IconButton,
  MenuItem,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/shareds/provider";
import { BaseMenu } from "@/shareds/ui/base-menu";
import { toaster } from "@/shareds/ui/base-toaster";
import { signoutServerFn } from "./api/signout";
import { TenantSelector } from "./ui/TenantSelector";

const triggerButton = (
  <IconButton variant="ghost" rounded="full" aria-label="User menu">
    <Avatar.Root size="md">
      {/* Fallbackのみを使用し、空のsrc属性をもつImageは削除 */}
      <Avatar.Fallback />
    </Avatar.Root>
  </IconButton>
);

export const TheHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const signoutMutation = useMutation({
    mutationFn: signoutServerFn,
    onSuccess: async () => {
      // ログアウト成功時はログインページに遷移
      navigate({ to: "/signin" });
      toaster.create({
        type: "success",
        description: "ログアウトしました。",
      });
    },
    onError: (error: Error) => {
      toaster.create({
        type: "error",
        description:
          error.message || "ログアウト中に予期せぬエラーが発生しました。",
      });
    },
  });

  const handleSignOut = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    signoutMutation.mutate({});
  };
  return (
    <Flex
      backgroundColor="gray.100"
      justifyContent="space-between"
      alignItems="center"
      paddingY={3}
      paddingX={5}
      color="gray.500"
      width="100%"
      height="60px"
      position="fixed"
      zIndex={10}
    >
      <Link to="/">
        <Text fontSize="xl" fontWeight="bold">
          Header
        </Text>
      </Link>
      <Flex gap={4} alignItems="center">
        <TenantSelector />
        <Stack>
          <BaseMenu
            triggerButton={triggerButton}
            menuContentProps={{ minWidth: "240px", paddingX: "12px" }}
          >
            <VStack
              align="start"
              paddingY={2}
              paddingX={3}
              borderBottom="1px solid"
            >
              <Text fontSize="lg">{user?.name}</Text>
              <Text fontSize="sm" color="gray.400">
                {user?.companyName}
              </Text>
            </VStack>
            <MenuItem
              asChild
              value="profile"
              color="black"
              cursor="pointer"
              fontSize="md"
              marginY={2}
              padding={"8px"}
            >
              <Link to="/profile">プロフィール</Link>
            </MenuItem>
            <MenuItem
              value="setting"
              color="red.600"
              cursor="pointer"
              fontSize="md"
              marginY={2}
              padding="8px"
              onClick={handleSignOut}
            >
              <Text>ログアウト</Text>
            </MenuItem>
          </BaseMenu>
        </Stack>
      </Flex>
    </Flex>
  );
};
