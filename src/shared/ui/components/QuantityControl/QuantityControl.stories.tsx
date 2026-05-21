import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { QuantityControl } from './QuantityControl';

const meta = {
  title: 'UI/Компоненты/Счётчик',
  component: QuantityControl,
  parameters: { layout: 'centered' },
  args: { value: 2 },
} satisfies Meta<typeof QuantityControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {
  name: 'По умолчанию',
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 1);
    return <QuantityControl {...args} value={value} onChange={setValue} />;
  },
};
export const Компактный: Story = {
  name: 'Компактный',
  args: { size: 'sm', value: 1 },
};
export const Большой: Story = {
  name: 'Большой',
  args: { size: 'lg', value: 4 },
};
