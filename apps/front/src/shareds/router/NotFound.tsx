import { Box, Heading, Text } from "@chakra-ui/react";

export const NotFoundComponent = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading fontSize="5xl" margin={"32px"}>
        404 Not Found
      </Heading>
      <Text>ページが見つかりませんでした。</Text>
    </Box>
  );
};
