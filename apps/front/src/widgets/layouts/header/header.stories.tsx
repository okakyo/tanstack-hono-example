import type { Meta, StoryObj } from "@storybook/react";
import { TheHeader } from ".";

type ComponentType = typeof TheHeader;
type Story = StoryObj<ComponentType>;

export default {
  title: "Widgets/Header",
  component: TheHeader,
} satisfies Meta<ComponentType>;

export const Default: Story = {
  render: () => {
    return <TheHeader />;
  },
};
