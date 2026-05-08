import type { Meta, StoryObj } from '@storybook/react';

import { responsiveStoryParameters } from '../../../shared/lib/storybook/responsive';
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

export const Mobile: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Mobile,
};

export const Tablet: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Tablet,
};

export const Desktop: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Desktop,
};
