import { TableOrdersPC } from './TableOrdersPC';
import * as OrderItemPC from '@stories/entities/order/ui/order-item/OrderItemPC.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
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
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
