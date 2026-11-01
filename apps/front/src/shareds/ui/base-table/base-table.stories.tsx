import type { Meta, StoryObj } from "@storybook/react";
import { BaseTable } from ".";
import {
  TEMPLATE_COLUMNS,
  TEMPLATE_DATA,
  type TEMPLATE_DATA_TYPE,
} from "./mock";

type ComponentType = typeof BaseTable<TEMPLATE_DATA_TYPE>;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI/BaseTable",
  component: BaseTable<TEMPLATE_DATA_TYPE>,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<ComponentType>;

export const Default: Story = {
  args: {
    columns: TEMPLATE_COLUMNS,
    data: TEMPLATE_DATA,
  },
};
