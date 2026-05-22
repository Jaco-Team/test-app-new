import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from './Header';

const meta = {
  title: 'UI/Виджеты/Шапка',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    city: 'Самара',
    cartLabel: '2 818 ₽',
    navItems: [
      { label: 'Роллы', active: true },
      { label: 'Пицца' },
      { label: 'Блюда' },
      { label: 'Акции' },
    ],
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = {
  name: 'По умолчанию',
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Header
        {...args}
        compactMenuOpen={open}
        onMenuClick={() => setOpen((value) => !value)}
      />
    );
  },
};

export const ОткрытоеМеню: Story = {
  name: 'Открытое меню',
  args: { compactMenuOpen: true },
};

export const ПустаяКорзина: Story = {
  name: 'Пустая корзина',
  args: { cartLabel: 'Корзина' },
};
