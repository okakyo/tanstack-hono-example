import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { ChakraUiProvider } from "../src/shared/provider/chakra-ui/ChakraUiProvider";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Docs",
          "Pages",
          "Widgets",
          ["Header", "Sidebar", "Footer", "*"],
          "Features",
          "Ui",
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: { light: "", dark: "dark" },
    }),
    (Story) => {
      const WithFullScreen = () => <Story />;
      return (
        <ChakraUiProvider>
          <RouterProvider
            router={createRouter({
              history: createMemoryHistory(),
              routeTree: createRootRoute({
                component: WithFullScreen,
              }),
            })}
          />
        </ChakraUiProvider>
      );
    },
  ],
};

export default preview;
