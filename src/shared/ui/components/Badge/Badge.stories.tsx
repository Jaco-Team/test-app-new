import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Компоненты/Метка',
  component: Badge,
  parameters: { layout: 'centered' },
  args: { tone: 'new', size: 'md' },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = { name: 'По умолчанию' };
export const Хит: Story = { name: 'Хит', args: { tone: 'hit' } };
export const Скидка: Story = { name: 'Скидка', args: { tone: 'sale' } };
export const Большой: Story = { name: 'Большая', args: { size: 'lg' } };
export const НаКарточке: Story = {
  name: 'На карточке',
  args: { tone: 'new', size: 'sm' },
  parameters: { viewport: { defaultViewport: 'mobileMin' } },
};
