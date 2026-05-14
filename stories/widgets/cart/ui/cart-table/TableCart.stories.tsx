import type { Meta, StoryObj } from '@storybook/react';
import { TableCart } from './TableCart';
import {
  tableCartActiveArgs,
  tableCartDefaultArgs,
  tableCartPromoArgs,
} from '@stories/fixtures/cart';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
const meta = {
  title: 'Виджеты / Корзина / Таблица',
  component: TableCart,
  tags: ['autodocs'],
  argTypes: {
    data: {
      type: 'array',
      description: 'Данные для коризны',
    },
  },
} satisfies Meta<typeof TableCart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...tableCartDefaultArgs,
  },
};

export const Active: Story = {
  args: {
    ...tableCartActiveArgs,
  },
};

export const Promo: Story = {
  args: {
    ...tableCartPromoArgs,
  },
};

export const Mobile: Story = {
  args: {
    ...tableCartDefaultArgs,
  },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: {
    ...tableCartDefaultArgs,
  },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: {
    ...tableCartDefaultArgs,
  },
  globals: responsiveStoryGlobals.Desktop,
};
