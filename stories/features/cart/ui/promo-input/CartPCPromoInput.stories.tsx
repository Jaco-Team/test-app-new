import { CartPCPromoInput } from './CartPCPromoInput';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Корзина / Ввод промокода',
  component: CartPCPromoInput,
  tags: ['autodocs'],
  argTypes: {
    itemsCount: {
      type: 'number',
      description: 'Количество позиций товара в корзине',
    },
    items_on_price: {
      type: 'array',
      description: 'Массив товаров в корзине',
    },
    promoItemsFind: {
      type: 'boolean',
      description: 'Наличие в корзине промо товаров',
    },
    status_promo: {
      type: 'boolean',
      description: 'Статус промокода',
    },
    allPrice: {
      type: 'string',
      description: 'Полная цена за все товары в корзине',
    },
    promo: {
      type: 'string',
      description: 'Название промокода',
    },
    checkPromo: {
      type: 'boolean',
      description: 'Проверка промокода',
    },
  },
};

const Template = (args) => <CartPCPromoInput {...args} />;
export const Default = Template.bind({});
export const Promo_True = Template.bind({});
export const Promo_False = Template.bind({});

Default.args = {
  itemsCount: 0,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  allPrice: '0',
  promo: '',
  checkPromo: false,
};

Promo_True.args = {
  itemsCount: 0,
  items_on_price: ['item'],
  promoItemsFind: true,
  status_promo: false,
  allPrice: '1000',
  promo: 'КОКОДЖАМБО',
  checkPromo: { st: true },
};

Promo_False.args = {
  itemsCount: 0,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  allPrice: '',
  promo: 'КОКО',
  checkPromo: { st: false },
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
