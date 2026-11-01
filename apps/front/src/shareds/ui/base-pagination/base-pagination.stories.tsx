import type { Meta, StoryObj } from "@storybook/react";
import { BasePagination } from ".";

type ComponentType = typeof BasePagination;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI/BasePagination",
  component: BasePagination,
  parameters: {
    layout: "padded",
  },
  args: {
    count: 100,
    page: 1,
    pageSize: 10,
    size: "sm",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<ComponentType>;

export const Default: Story = {};

export const OnMiddlePage: Story = {
  args: {
    count: 100,
    page: 5,
    pageSize: 10,
  },
};

export const OnLastPage: Story = {
  args: {
    count: 100,
    page: 10,
    pageSize: 10,
  },
};
