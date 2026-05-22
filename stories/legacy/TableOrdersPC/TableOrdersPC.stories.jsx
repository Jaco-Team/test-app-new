import { TableOrdersPC } from './TableOrdersPC';
import * as OrderItemPC from '../OrderItemPC/OrderItemPC.stories';

export default {
  title: 'Профиль / Заказы / Таблица заказов',
  component: TableOrdersPC,
  tags: ['autodocs'],
  argTypes: {
    order: {
      type: 'array',
      description: 'Заказ клиента',
    },
  },
};

const Template = (args) => <TableOrdersPC {...args} />;
export const Default = Template.bind({});

Default.args = {
  order: OrderItemPC.Check.args,
};
