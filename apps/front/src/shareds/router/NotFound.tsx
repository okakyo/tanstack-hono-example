import {  Button, Heading, Stack, Text } from "@chakra-ui/react";

export const NotFoundComponent = () => {
  return (
    <Stack
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="32px"
    >
      <Heading fontSize="5xl">
        404 Not Found
      </Heading>
      <Text>ページが見つかりませんでした。</Text>
      <Button onClick={() => (window.location.href = "/")}>トップに戻る</Button>
    </Stack>
  );
};
