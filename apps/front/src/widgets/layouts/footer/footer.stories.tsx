import type { Meta, StoryObj } from "@storybook/react";
import { TheFooter } from "./index";

type ComponentType = typeof TheFooter;
type Story = StoryObj<ComponentType>;

export default {
  title: "Widgets/Footer",
  component: TheFooter,
} satisfies Meta<ComponentType>;

export const Default: Story = {};
