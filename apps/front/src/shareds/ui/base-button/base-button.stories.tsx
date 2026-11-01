import type { ColorPalette } from "@chakra-ui/react";
import { HStack, Icon, Stack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { BaseButton } from "./index";

type ComponentType = typeof BaseButton;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI/BaseButton",
  component: BaseButton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<ComponentType>;

export const Default: Story = {
  args: {
    colorPalette: "blue",
    children: "Click me",
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    expect(button).toHaveTextContent("Click me");
  },
};

export const WithIcon: Story = {
  args: {
    colorPalette: "blue",
    children: "Click me",
  },
  render: (props) => (
    <Stack alignItems={"flex-start"} gap={4}>
      <BaseButton {...props}>
        <Icon data-testid="plus-icon" as={FaPlus} size="xs" />
        Plus
      </BaseButton>
    </Stack>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    expect(button).toHaveTextContent("Plus");

    const icon = canvas.getByTestId("plus-icon");
    expect(icon).toBeVisible();
  },
};

export const Color: Story = {
  args: {
    children: "Click me",
  },
  render: (props) => {
    const colorPalette: ColorPalette[] = [
      "teal",
      "red",
      "blue",
      "green",
      "purple",
      "pink",
      "cyan",
      "orange",
      "yellow",
      "gray",
    ];
    return (
      <Stack gap="2" align="flex-start">
        {colorPalette.map((colorPalette, index) => (
          <Stack align="center" key={colorPalette} direction="row" gap="10">
            <BaseButton
              data-testid={`button-${index}`}
              {...props}
              colorPalette={colorPalette}
            >
              Button
            </BaseButton>
            <BaseButton
              {...props}
              data-testid={`button-outline-${index}`}
              colorPalette={colorPalette}
              variant="outline"
            >
              Button
            </BaseButton>
            <BaseButton
              data-testid={`button-ghost-${index}`}
              {...props}
              colorPalette={colorPalette}
              variant="ghost"
            >
              Button
            </BaseButton>
            <BaseButton
              {...props}
              data-testid={`button-surface-${index}`}
              colorPalette={colorPalette}
              variant="surface"
            >
              Button
            </BaseButton>
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const Size: Story = {
  args: {
    children: "Click me",
  },
  render: (props) => {
    const sizes: Array<"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"> = [
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
    ];
    return (
      <HStack>
        {sizes.map((size) => (
          <BaseButton colorPalette="blue" {...props} size={size} key={size}>
            {size.toUpperCase()}
          </BaseButton>
        ))}
      </HStack>
    );
  },
};

export const Loading: Story = {
  args: {
    children: "Click me",
    loadingText: "Loading...",
  },
  render: (props) => {
    const [loading, setLoading] = useState(false);

    return (
      <BaseButton {...props} loading={loading} onClick={() => setLoading(true)}>
        {props.children}
      </BaseButton>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    expect(button).toHaveTextContent("Click me");

    userEvent.click(button);
    await canvas.findByText("Loading...");

    expect(button).toHaveTextContent("Loading...");
  },
};

export const Disabled: Story = {
  args: {
    children: "Click me",
    disabled: true,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    expect(button).toBeDisabled();
  },
};
