import { ZakazyPagePC } from './ZakazyPagePC';
import * as TableOrdersPC from '@stories/widgets/orders/ui/orders-table/TableOrdersPC.stories';
import * as BreadCrumbsStories from '@stories/shared/ui/breadcrumbs/BreadСrumbs.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Профиль / Заказы / Страница заказы',
  component: ZakazyPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки ПК',
    },
    orders: {
      control: 'object',
      description: 'Список заказов клиента на ПК',
    },
    data: {
      control: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <ZakazyPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  orders: TableOrdersPC.Default.args,
  data: { ...BreadCrumbsStories.Profile.args, activePage: 'zakazy' },
};

ArrowUp.args = {
  orders: TableOrdersPC.Default.args,
  data: { ...BreadCrumbsStories.Profile.args, activePage: 'zakazy' },
};

// Cookie.args = {
////   actia: BannerFullPC.Page.args,
//
// };

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
