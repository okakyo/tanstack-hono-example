import { Tabs } from "@chakra-ui/react";

export type BaseTabValueProps = {
  value: string;
  children: React.ReactNode;
  label?: string;
};

export type BaseTabsProps = {
  values: BaseTabValueProps[];
} & Tabs.RootProps;

export const BaseTabs = (props: BaseTabsProps) => {
  const { values, ...rest } = props;
  return (
    <Tabs.Root {...rest}>
      <Tabs.List>
        {values.map((value) => (
          <Tabs.Trigger value={value.value} key={value.value}>
            {value.label ?? value.value}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {values.map((value) => (
        <Tabs.Content value={value.value} key={value.value}>
          {value.children}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
