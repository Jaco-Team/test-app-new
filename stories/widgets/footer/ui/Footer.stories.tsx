import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from './Footer';

const links = {
  link_vk: 'https://vk.com/jacofood_tlt',
  link_ok: 'https://ok.ru/group/54671948841166',
  link_tg: 'https://t.me/jacofood',
  link_allergens: 'https://storage.yandexcloud.net/site-other-data/jaco_2024_03_23.pdf',
};

const meta = {
  title: 'Widgets/Footer/New',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cookie: true,
    arrow: false,
    cityName: 'samara',
    links,
    page: 'default',
  },
};

export const Cookie: Story = {
  args: {
    ...Default.args,
    cookie: false,
  },
};

export const Arrow: Story = {
  args: {
    ...Default.args,
    arrow: true,
  },
};
