import { MenuItem } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { BaseButton } from "../base-button";
import { BaseMenu } from ".";

type ComponentType = typeof BaseMenu;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI/BaseMenu",
  component: BaseMenu,
  parameters: {
    layout: "padded",
  },
  args: {},
  tags: ["autodocs"],
  render: (args) => (
    <BaseMenu {...args}>
      <MenuItem value="item1">Item 1</MenuItem>
      <MenuItem value="item2">Item 2</MenuItem>
      <MenuItem value="item3">Item 3</MenuItem>
    </BaseMenu>
  ),
} satisfies Meta<ComponentType>;

export const Default: Story = {};
export const CustomButton: Story = {
  args: {
    triggerButton: (
      <BaseButton color="primary" variant="outline">
        Open menu
      </BaseButton>
    ),
  },
  render: (args) => (
    <BaseMenu {...args}>
      <MenuItem value="item1">Item 1</MenuItem>
      <MenuItem value="item2">Item 2</MenuItem>
      <MenuItem value="item3">Item 3</MenuItem>
    </BaseMenu>
  ),
};
