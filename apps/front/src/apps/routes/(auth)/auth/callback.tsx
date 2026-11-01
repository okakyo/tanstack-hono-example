import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth/callback")({
  component: RouteComponent,
  loader: async () => {
    // OAuth のコールバックは main-api (/auth/callback) が処理します。
    // ここに来た場合は、単純にホームへ戻します。
    throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  return (
    <Flex minHeight="100vh" justify="center" align="center">
      <Box textAlign="center">
        <Spinner size="xl" marginX="auto" />
        <Text marginTop="16px" color="gray.600">
          認証処理中...
        </Text>
      </Box>
    </Flex>
  );
}
