import { TableOrdersPC } from './TableOrdersPC';
import * as OrderItemPC from '../../../../entities/order/ui/order-item/OrderItemPC.stories';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
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

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
