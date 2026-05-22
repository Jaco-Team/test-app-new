import type { Meta, StoryObj } from '@storybook/react';
import { CategoryMenu } from './CategoryMenu';

const meta = {
  title: 'UI/Виджеты/Меню категорий',
  component: CategoryMenu,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CategoryMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = { name: 'По умолчанию' };

export const ДлинныйСписок: Story = {
  name: 'Длинный список',
  args: {
    secondaryItems: [
      { label: 'Сеты', active: true },
      { label: 'Фирменные' },
      { label: 'Жареные' },
      { label: 'Запечённые' },
      { label: 'Классика' },
      { label: 'Острые' },
    ],
  },
};
