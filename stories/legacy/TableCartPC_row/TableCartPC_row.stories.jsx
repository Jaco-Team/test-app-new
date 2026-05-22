import { TableCartPC_row } from './TableCartPC_row';

export default {
  title: 'Cart / ПК / Корзина / Table / Row',
  component: TableCartPC_row,
  tags: ['autodocs'],
  argTypes: {
    last: {
      type: 'string',
      description: 'Последний товар в таблице корзины',
    },
    title: {
      type: 'string',
      description: 'Наименование товара',
    },
    img_app: {
      type: 'string',
      description: 'Картинка товара',
    },
    status_promo: {
      type: 'boolean',
      description: 'Статус промокода',
    },
    new_one_price: {
      type: 'string',
      description: 'Измененная цена товара',
    },
    disabled: {
      type: 'boolean',
      description: 'Отключение изменений в товаре',
    },
    one_price: {
      type: 'string',
      description: 'Цена товара',
    },
    all_price: {
      type: 'string',
      description: 'Цена товара в зависимости от количества Товара',
    },
    count: {
      type: 'string',
      description: 'Количество товара',
    },
  },
};

const Template = (args) => <TableCartPC_row {...args} />;
export const Item = Template.bind({});
export const Dop = Template.bind({});
export const Promo = Template.bind({});
export const Count = Template.bind({});

Item.args = {
  last: '',
  title: 'Мадейра сет',
  img_app: 'Madeira_set',
  status_promo: false,
  new_one_price: '',
  disabled: false,
  one_price: '909',
  all_price: '',
  count: '1',
};

Dop.args = {
  last: '',
  title: 'Соевый соус',
  img_app: 'Soevyi_sous_',
  status_promo: false,
  new_one_price: '',
  disabled: false,
  one_price: '14',
  all_price: '',
  count: '0',
};

Promo.args = {
  last: '',
  title: 'Мадейра сет',
  img_app: 'Madeira_set',
  status_promo: true,
  new_one_price: '',
  disabled: true,
  one_price: '909',
  all_price: '890',
  count: '1',
};

Count.args = {
  last: '',
  title: 'Соевый соус',
  img_app: 'Soevyi_sous_',
  status_promo: false,
  new_one_price: '',
  disabled: false,
  one_price: '14',
  all_price: '',
  count: '99',
};
