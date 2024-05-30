import { OrderItemPC } from './OrderItemPC';

export default {
  title: 'Профиль / Заказы / Заказ',
  component: OrderItemPC,
  tags: ['autodocs'],
  argTypes: {
    order: {
      type: 'object',
      description: 'Данные заказа',
    },
  },
};

const order_check = {
  base: 'jaco_rolls_1',
  point_id: '1',
  order_id: '649373',
  year: '2024',
  date: '2024-04-25',
  time: '18:07:10',
  date_time: '2024-04-25 18:07:10',
  is_pred: '0',
  is_delete: '0',
  status_order: 'Доставлен',
  status_order_: '6',
  sum: '1005',
  type_order: '1',
  unix_time_to_client: '35-65',
  type_status: 5,
};

const order_delete = {
  base: 'jaco_rolls_1',
  point_id: '1',
  order_id: '649373',
  year: '2024',
  date: '2024-04-25',
  time: '18:07:10',
  date_time: '2024-04-25 18:07:10',
  is_pred: '0',
  is_delete: '1',
  status_order: 'Отменен',
  status_order_: '6',
  sum: '1005',
  type_order: '1',
  unix_time_to_client: '35-65',
  type_status: 5,
};

const order_reload = {
  base: 'jaco_rolls_1',
  point_id: '1',
  order_id: '649373',
  year: '2024',
  date: '2024-04-25',
  time: '18:07:10',
  date_time: '2024-04-25 18:07:10',
  is_pred: '0',
  is_delete: '0',
  status_order: 'Получен',
  status_order_: '6',
  sum: '1005',
  type_order: '1',
  unix_time_to_client: '35-65',
  type_status: 1,
};

const Template = (args) => <OrderItemPC {...args} />;
export const Check = Template.bind({});
export const Delete = Template.bind({});
export const Reload = Template.bind({});

Check.args = {
  order: order_check,
};

Delete.args = {
  order: order_delete,
};

Reload.args = {
  order: order_reload,
};
