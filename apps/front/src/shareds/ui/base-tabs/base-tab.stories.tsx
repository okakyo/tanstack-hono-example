import type { Meta, StoryObj } from "@storybook/react";
import { BaseTabs } from "./index";

type ComponentType = typeof BaseTabs;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI/BaseTabs",
  component: BaseTabs,
  parameters: {
    layout: "padded",
  },
  args: {
    colorPalette: "blue",
    defaultValue: "tab1",
    variant: "line",
    values: [
      {
        label: "Tab 1",
        value: "tab1",
        children: "Tab 1 content",
      },
      {
        label: "Tab 2",
        value: "tab2",
        children: "Tab 2 content",
      },
      {
        label: "Tab 3",
        value: "tab3",
        children: "Tab 3 content",
      },
    ],
  },
  tags: ["autodocs"],
} satisfies Meta<ComponentType>;

export const Default: Story = {};
