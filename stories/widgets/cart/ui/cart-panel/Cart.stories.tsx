import type { Meta, StoryObj } from '@storybook/react';
import { Cart } from './Cart';
import {
  cartPanelActiveArgs,
  cartPanelDefaultArgs,
  cartPanelPromoFalseArgs,
  cartPanelPromoTrueArgs,
} from '@stories/fixtures/cart';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
const meta = {
  title: 'Виджеты / Корзина / Панель',
  component: Cart,
  tags: ['autodocs'],
  argTypes: {
    data: {
      type: 'object',
      description: 'Данные для коризны',
    },
    openBasket: {
      type: 'boolean',
      description: 'Открытие корзины',
    },
    promo: {
      type: 'object',
      description: 'Данные промокода',
    },
    desk: {
      type: 'object',
      description: 'Данные промокода',
    },
  },
} satisfies Meta<typeof Cart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...cartPanelDefaultArgs,
  },
};

export const Active: Story = {
  args: {
    ...cartPanelActiveArgs,
  },
};

export const Promo_True: Story = {
  args: {
    ...cartPanelPromoTrueArgs,
  },
};

export const Promo_False: Story = {
  args: {
    ...cartPanelPromoFalseArgs,
  },
};

export const Mobile: Story = {
  args: {
    ...cartPanelDefaultArgs,
  },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: {
    ...cartPanelDefaultArgs,
  },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: {
    ...cartPanelDefaultArgs,
  },
  globals: responsiveStoryGlobals.Desktop,
};
