import { Box } from "@chakra-ui/react";
import { TheHeader } from "./header";
import { TheSidebar } from "./sidebar";

export const TheLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <TheHeader />
      <Box display="flex" marginTop="60px">
        <TheSidebar />
        <Box
          flex={1}
          marginLeft={{ base: 0, md: "240px" }}
          paddingX={6}
          paddingY={10}
          width="100%"
          backgroundColor="white"
          borderRadius="16px"
          minHeight="calc(100vh - 60px)"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
