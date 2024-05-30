import { ProfilePagePC } from './ProfilePagePC';
import * as HeaderPC from '../HeaderPC/HeaderPC.stories';
import * as ProfileAddrPC from '../ProfileAddrPC/ProfileAddrPC.stories';
import * as BreadСrumbsPC from '../BreadСrumbsPC/BreadСrumbsPC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

export default {
  title: 'Профиль / Личные данные / Страница Личные данные',
  component: ProfilePagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    data: {
      type: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    user: {
      type: 'object',
      description: 'Личные данные пользователя',
    },
    address: {
      type: 'object',
      description: 'Данные адреса клиента',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const user = {
  id: '242066',
  name: 'Икс',
  fam: '',
  login: '89000000007',
  date_bir: '30 Августа',
  spam: '0',
  mail: '',
  date_bir_m: 0,
  date_bir_d: 0,
};

const user_active = {
  id: '242066',
  name: 'Икс',
  fam: 'Иксович',
  login: '89000000007',
  date_bir: '30 Августа',
  spam: '0',
  mail: 'example@ya.ru',
  date_bir_m: 8,
  date_bir_d: 30,
};

const Template = (args) => <ProfilePagePC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  user,
  header: HeaderPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
  footer: FooterPC.Default.args,
  address: null,
};

Active.args = {
  user: user_active,
  header: HeaderPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
  footer: { ...FooterPC.Default.args, arrow: true },
  address: ProfileAddrPC.Default.args,
};

ArrowUp.args = {
  user: user_active,
  header: HeaderPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
  footer: { ...FooterPC.Default.args, arrow: true },
  address: ProfileAddrPC.Default.args,
};

// Cookie.args = {
//   user: user_active,
//   header: HeaderPC.Default.args,
//   data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
//   footer: { ...FooterPC.Default.args, cookie: false },
//   address: ProfileAddrPC.Default.args,
// };
