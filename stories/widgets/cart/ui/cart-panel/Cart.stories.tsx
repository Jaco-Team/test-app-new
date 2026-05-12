import { CartPC } from './CartPC';
import * as TableCartPC from '../cart-table/TableCartPC.stories';
import * as CartPCPromoInput from '@stories/features/cart/ui/promo-input/CartPCPromoInput.stories';
import * as CartPCPromoText from '@stories/features/cart/ui/promo-text/CartPCPromoText.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Виджеты / Корзина / Панель',
  component: CartPC,
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
};

const Template = (args) => <CartPC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Promo_True = Template.bind({});
export const Promo_False = Template.bind({});

Default.args = {
  data: TableCartPC.Default.args,
  promo: CartPCPromoInput.Default.args,
  openBasket: true,
  desc: {}
};

Active.args = {
  data: TableCartPC.Active.args,
  promo: CartPCPromoInput.Default.args,
  openBasket: true,
  desc: {}
};

Promo_True.args = {
  data: TableCartPC.Promo.args,
  promo: CartPCPromoInput.Promo_True.args,
  openBasket: true,
  desc: CartPCPromoText.Promo_True.args,
};

Promo_False.args = {
  data: TableCartPC.Active.args,
  promo: CartPCPromoInput.Promo_False.args,
  openBasket: true,
  desc: CartPCPromoText.Promo_False.args,
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
