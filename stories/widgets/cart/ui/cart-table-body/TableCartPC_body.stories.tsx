import { TableCartPC_body } from './TableCartPC_body';
import * as TableCartPC_row from '@stories/entities/cart/ui/cart-row/TableCartPC_row.stories';
import * as TableCartPC_foot from '../cart-table-footer/TableCartPC_foot.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Виджеты / Корзина / Тело таблицы',
  component: TableCartPC_body,
  tags: ['autodocs'],
  argTypes: {
    items: {
      type: 'array',
      description: 'Товары в корзине за исключением допов',
    },
    itemsCount: {
      type: 'number',
      description: 'Число товаров в корзине без допов',
    },
    dopItems: {
      type: 'array',
      description: 'Дополнительные товары в корзине',
    },
    dopItemsCount: {
      type: 'number',
      description: 'Число доп товаров в корзине',
    },
    footerData: {
      type: 'object',
      description: 'Данные для футера таблицы',
    }
  },
};

const Template = (args) => <TableCartPC_body {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Promo = Template.bind({});

Default.args = {
  items: [],
  itemsCount: 0,
  dopItems: TableCartPC_row.Dop.args,
  dopItemsCount: 5,
  footerData: TableCartPC_foot.Default.args
};

Active.args = {
  items: TableCartPC_row.Item.args,
  itemsCount: 3,
  dopItems: TableCartPC_row.Dop.args,
  dopItemsCount: 5,
  footerData: TableCartPC_foot.Active.args
};

Promo.args = {
  items: TableCartPC_row.Promo.args,
  itemsCount: 3,
  dopItems: TableCartPC_row.Dop.args,
  dopItemsCount: 5,
  footerData: TableCartPC_foot.Promo.args
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
