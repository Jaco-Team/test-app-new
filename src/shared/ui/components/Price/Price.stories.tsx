import type { Meta, StoryObj } from '@storybook/react';
import { Price } from './Price';

const meta = {
  title: 'UI/Компоненты/Цена',
  component: Price,
  parameters: { layout: 'centered' },
  args: { value: 520 },
} satisfies Meta<typeof Price>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = { name: 'По умолчанию' };
export const Скидка: Story = { args: { value: 390, oldValue: 520 } };
export const Большой: Story = { args: { size: 'lg', value: 1290 } };
