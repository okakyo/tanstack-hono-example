import type { Meta, StoryObj } from "@storybook/react";
import { TheSidebar } from "./index";

type ComponentType = typeof TheSidebar;
type Story = StoryObj<ComponentType>;

export default {
  title: "Widgets/Sidebar",
  component: TheSidebar,
} satisfies Meta<ComponentType>;

export const Default: Story = {};
