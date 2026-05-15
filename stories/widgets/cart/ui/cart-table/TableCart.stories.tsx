import { TableCart } from './TableCart';
import * as TableCart_body from '../cart-table-body/TableCart_body.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Виджеты / Корзина / Таблица',
  component: TableCart,
  tags: ['autodocs'],
  argTypes: {
    data: {
      type: 'array',
      description: 'Данные для коризны',
    },
  },
};

const Template = (args) => <TableCart {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Promo = Template.bind({});

Default.args = {
  data: TableCart_body.Default.args,
};

Active.args = {
  data: TableCart_body.Active.args,
};

Promo.args = {
  data: TableCart_body.Promo.args,
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
