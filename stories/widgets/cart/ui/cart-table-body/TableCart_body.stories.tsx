import type { Meta, StoryObj } from '@storybook/react';
import { TableCart_body } from './TableCart_body';
import {
  tableCartBodyActiveArgs,
  tableCartBodyDefaultArgs,
  tableCartBodyPromoArgs,
} from '@stories/fixtures/cart';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
const meta = {
  title: 'Виджеты / Корзина / Тело таблицы',
  component: TableCart_body,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Товары в корзине за исключением допов',
    },
    itemsCount: {
      type: 'number',
      description: 'Число товаров в корзине без допов',
    },
    dopItems: {
      control: 'object',
      description: 'Дополнительные товары в корзине',
    },
    dopItemsCount: {
      type: 'number',
      description: 'Число доп товаров в корзине',
    },
    footerData: {
      control: 'object',
      description: 'Данные для футера таблицы',
    },
  },
} satisfies Meta<typeof TableCart_body>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...tableCartBodyDefaultArgs,
  },
};

export const Active: Story = {
  args: {
    ...tableCartBodyActiveArgs,
  },
};

export const Promo: Story = {
  args: {
    ...tableCartBodyPromoArgs,
  },
};

export const Mobile: Story = {
  args: {
    ...tableCartBodyDefaultArgs,
  },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: {
    ...tableCartBodyDefaultArgs,
  },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: {
    ...tableCartBodyDefaultArgs,
  },
  globals: responsiveStoryGlobals.Desktop,
};
