import { TableCartPC } from './TableCartPC';
import * as TableCartPC_body from '../cart-table-body/TableCartPC_body.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Виджеты / Корзина / Таблица',
  component: TableCartPC,
  tags: ['autodocs'],
  argTypes: {
    data: {
      type: 'array',
      description: 'Данные для коризны',
    },
  },
};

const Template = (args) => <TableCartPC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Promo = Template.bind({});

Default.args = {
  data: TableCartPC_body.Default.args,
};

Active.args = {
  data: TableCartPC_body.Active.args,
};

Promo.args = {
  data: TableCartPC_body.Promo.args,
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
