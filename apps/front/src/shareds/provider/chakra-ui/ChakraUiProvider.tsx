import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

const customConfig = defineConfig({
  globalCss: {
    html: {
      fontFamily: "Noto Sans JP Barlow",
      colorPalette: "blue",
      backgroundColor: "gray.100",
    },
  },
});

const chakraCustomSystem = createSystem(defaultConfig, customConfig);

export const ChakraUiProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ChakraProvider value={chakraCustomSystem}>{children}</ChakraProvider>;
};
