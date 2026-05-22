import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../primitives';
import { Switch } from './Switch';
const meta = {
  title: 'UI/Компоненты/Переключатель',
  component: Switch,
  parameters: { layout: 'centered' },
  args: { label: 'Самовывоз' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const Включен: Story = { args: { checked: true } };
export const Компактный: Story = { args: { size: 'sm', checked: true } };
export const Обычный: Story = { args: { size: 'md', checked: true } };
export const Крупный: Story = { args: { size: 'lg', checked: true } };
export const Недоступный: Story = { args: { disabled: true } };
export const Состояния: Story = {
  render: () => (
    <Stack>
      <Switch label="Выключено" />
      <Switch label="Включено" checked />
      <Switch label="Нейтральный" checked tone="neutral" />
    </Stack>
  ),
};
