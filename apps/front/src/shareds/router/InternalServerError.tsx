import { Box, Button, Heading, Text } from "@chakra-ui/react";

/**
 * 予期しないエラー発生時に表示する共通 500 画面です。
 */
export const InternalServerErrorComponent = () => {
  return (
    <Box
      width="100%"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="4"
      px="6"
      textAlign="center"
    >
      <Heading fontSize="5xl">500 Internal Server Error</Heading>
      <Text>サーバーとの通信中に問題が発生しました。</Text>
      <Text>時間をおいて再度お試しください。</Text>
      <Button
        colorScheme="blue"
        mt="4"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.location.assign("/");
          }
        }}
      >
        トップページへ戻る
      </Button>
    </Box>
  );
};
