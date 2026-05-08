import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './Header';
import headerData from '../../../fixtures/header.togliatti.json';

const categories = headerData.main_cat.map((item) => ({
  id: item.id,
  name: item.name,
  link: item.link,
  cats: (item.cats ?? []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    link: cat.link,
  })),
}));

const meta = {
  title: 'Widgets/Header/New',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  args: {
    viewport: 'mobile',
    categories,
    activeMenu: false,
    mobileMenu: {
      activePage: 'home',
      itemsCount: 0,
      isAuth: 'auth',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobileMin',
    },
  },
};

export const Tablet: Story = {
  args: {
    viewport: 'tablet',
    categories,
    basketTotal: '1250',
    mobileMenu: {
      activePage: 'cart',
      itemsCount: 5,
      isAuth: 'none',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tabletMin',
    },
  },
};

export const Desktop: Story = {
  args: {
    viewport: 'desktop',
    categories,
    basketTotal: '0',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktopMin',
    },
  },
};

export const DesktopScrolled: Story = {
  args: {
    ...Desktop.args,
    scroll: true,
  },
  parameters: Desktop.parameters,
};
