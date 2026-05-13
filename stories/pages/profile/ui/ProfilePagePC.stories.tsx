import { ProfilePagePC } from './ProfilePagePC';
import * as ProfileAddrPC from '@stories/entities/profile/ui/address-card/ProfileAddrPC.stories';
import * as BreadСrumbsPC from '@stories/shared/ui/breadcrumbs/BreadСrumbsPC.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
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
  //fam: '',
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
  //fam: 'Иксович',
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
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
  address: null,
};

Active.args = {
  user: user_active,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
  address: ProfileAddrPC.Default.args,
};

ArrowUp.args = {
  user: user_active,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
  address: ProfileAddrPC.Default.args,
};

// Cookie.args = {
//   user: user_active,
////   data: { ...BreadСrumbsPC.Profile.args, activePage: 'profile' },
//
//   address: ProfileAddrPC.Default.args,
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
