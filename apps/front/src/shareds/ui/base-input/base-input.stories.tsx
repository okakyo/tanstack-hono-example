import { Field } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { BaseInput } from "./index";

type ComponentType = typeof BaseInput;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI/BaseInput",
  component: BaseInput,
  parameters: {
    layout: "padded",
  },
  args: {
    placeholder: "Placeholder",
  },
  tags: ["autodocs"],
} satisfies Meta<ComponentType>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (props) => (
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <BaseInput {...props} />
    </Field.Root>
  ),
};

export const WithError: Story = {
  args: {},
  render: (props) => (
    <Field.Root invalid>
      <Field.Label>Label</Field.Label>
      <BaseInput {...props} />
      <Field.ErrorText>Error Message</Field.ErrorText>
    </Field.Root>
  ),
};
