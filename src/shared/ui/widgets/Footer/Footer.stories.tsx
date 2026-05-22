import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta = {
  title: 'UI/Виджеты/Подвал',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  args: {
    citySlug: 'samara',
    cityLabel: 'Самара',
    linkGroups: [
      {
        title: 'Жако',
        items: [
          { label: 'О компании', href: '/samara/about' },
          { label: 'Контакты', href: '/samara/contacts' },
        ],
      },
      {
        title: 'Документы',
        items: [
          { label: 'Публичная оферта', href: '/samara/publichnaya-oferta' },
        ],
      },
    ],
    socialLinks: [
      { label: 'VK', href: 'https://vk.com' },
      { label: 'Telegram', href: 'https://t.me' },
    ],
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = {
  name: 'По умолчанию',
};

export const Compact: Story = {
  name: 'Компактный',
  parameters: { viewport: { defaultViewport: 'mobileMin' } },
};

export const Regular: Story = {
  name: 'Обычный',
  parameters: { viewport: { defaultViewport: 'tabletMin' } },
};

export const Expanded: Story = {
  name: 'Расширенный',
  parameters: { viewport: { defaultViewport: 'desktopMin' } },
};
