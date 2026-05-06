import { ZakazyPagePC } from './ZakazyPagePC';
import * as HeaderPC from '../HeaderPC/HeaderPC.stories';
import * as TableOrdersPC from '../TableOrdersPC/TableOrdersPC.stories';
import * as BreadСrumbsPC from '../BreadСrumbsPC/BreadСrumbsPC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

export default {
  title: 'Профиль / Заказы / Страница заказы',
  component: ZakazyPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    orders: {
      type: 'object',
      description: 'Список заказов клиента на ПК',
    },
    data: {
      type: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <ZakazyPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  header: HeaderPC.Default.args,
  orders: TableOrdersPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'zakazy' },
  footer: FooterPC.Default.args,
};

ArrowUp.args = {
  header: HeaderPC.Default.args,
  orders: TableOrdersPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'zakazy' },
  footer: { ...FooterPC.Default.args, arrow: true },
};

// Cookie.args = {
//   header: HeaderPC.Default.args,
//   actia: BannerFullPC.Page.args,
//   footer: { ...FooterPC.Default.args, cookie: false },
// };
