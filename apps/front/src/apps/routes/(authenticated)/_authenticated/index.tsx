import { Box, Heading } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box>
      <Heading as="h1" size="2xl" mb={8}>
        ホーム
      </Heading>
      <Box>作成中...</Box>
    </Box>
  );
}
