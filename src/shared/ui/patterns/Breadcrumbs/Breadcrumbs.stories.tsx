import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
const meta = {
  title: 'UI/Patterns/Breadcrumbs',
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
export const Default: Story = {};
export const LongText: Story = {
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Очень длинный раздел каталога', href: '/long' },
      { label: 'Очень длинная текущая страница для проверки переполнения' },
    ],
  },
};
