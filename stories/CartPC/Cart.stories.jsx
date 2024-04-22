import { CartPC } from './CartPC';
import * as TableCartPC from '../TableCartPC/TableCartPC.stories';
import * as CartPCPromoInput from '../CartPCPromoInput/CartPCPromoInput.stories';
import * as CartPCPromoText from '../CartPCPromoText/CartPCPromoText.stories';

export default {
  title: 'Cart / Корзина',
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
