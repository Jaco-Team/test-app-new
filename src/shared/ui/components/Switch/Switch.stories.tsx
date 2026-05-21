import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../primitives';
import { Switch } from './Switch';
const meta = {
  title: 'UI/Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  args: { label: 'Самовывоз' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Compact: Story = { args: { size: 'sm', checked: true } };
export const Regular: Story = { args: { size: 'md', checked: true } };
export const Expanded: Story = { args: { size: 'lg', checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const States: Story = {
  render: () => (
    <Stack>
      <Switch label="Выключено" />
      <Switch label="Включено" checked />
      <Switch label="Нейтральный" checked tone="neutral" />
    </Stack>
  ),
};
