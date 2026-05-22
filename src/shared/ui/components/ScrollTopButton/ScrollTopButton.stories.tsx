import type { Meta, StoryObj } from '@storybook/react';
import { ScrollTopButton } from './ScrollTopButton';
const meta = {
  title: 'UI/Компоненты/Кнопка наверх',
  component: ScrollTopButton,
  args: { visible: true },
} satisfies Meta<typeof ScrollTopButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const Скрыта: Story = { args: { visible: false } };
