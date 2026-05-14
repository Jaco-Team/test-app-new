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
      type: 'array',
      description: 'Товары в корзине за исключением допов',
    },
    itemsCount: {
      type: 'number',
      description: 'Число товаров в корзине без допов',
    },
    dopItems: {
      type: 'array',
      description: 'Дополнительные товары в корзине',
    },
    dopItemsCount: {
      type: 'number',
      description: 'Число доп товаров в корзине',
    },
    footerData: {
      type: 'object',
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
