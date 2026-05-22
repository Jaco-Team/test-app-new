import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
const meta = {
  title: 'UI/Паттерны/Хлебные крошки',
  component: Breadcrumbs,
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Акции', href: '/promo' },
      { label: 'Филадельфия опаленная' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const ДлинныйТекст: Story = {
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Очень длинный раздел каталога', href: '/long' },
      { label: 'Очень длинная текущая страница для проверки переполнения' },
    ],
  },
};
