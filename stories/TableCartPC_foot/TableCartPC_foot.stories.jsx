import { TableCartPC_foot } from './TableCartPC_foot';

export default {
  title: 'Cart / Корзина / Table / Footer',
  component: TableCartPC_foot,
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
    itemsOffDops: {
      type: 'array',
      description: 'Массив товаров в корзине без приминения промика',
    },
    price1: {
      type: 'string',
      description: 'Цена товара',
    },
    price2: {
      type: 'string',
      description: 'Цена товара',
    },
  },
};

const Template = (args) => <TableCartPC_foot {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Promo = Template.bind({});

Default.args = {
  itemsCount: 0,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  itemsOffDops: [],
  price1: '0',
  price2: '0',
};

Active.args = {
  itemsCount: 10,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  itemsOffDops: [],
  price1: '1110',
  price2: '2220',
};

Promo.args = {
  itemsCount: 2,
  items_on_price: ['item', 'item'],
  promoItemsFind: true,
  status_promo: false,
  itemsOffDops: [],
  price1: '500',
  price2: '600',
};
