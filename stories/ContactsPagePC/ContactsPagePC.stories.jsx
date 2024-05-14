import { ContactsPagePC } from './ContactsPagePC';

import * as HeaderPC from '../HeaderPC/HeaderPC.stories';
import * as MenuContactsPC from '../MenuContactsPC/MenuContactsPC.stories';
import * as MapPC from '../MapPC/MapPC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

export default {
  title: 'Страница Контакты / Контакты',
  component: ContactsPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    menu: {
      type: 'object',
      description: 'Данные для меню на странице Контакты ПК',
    },
    map: {
      type: 'object',
      description: 'Данные для карты на странице Контакты ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <ContactsPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
export const Cookie = Template.bind({});

Default.args = {
  header: HeaderPC.Default.args,
  menu: MenuContactsPC.Default.args,
  map: MapPC.Default.args,
  footer: { ...FooterPC.Default.args, page: 'contacts' },
};

ArrowUp.args = {
  header: HeaderPC.Default.args,
  menu: MenuContactsPC.Default.args,
  map: MapPC.Default.args,
  footer: { ...FooterPC.Default.args, arrow: true, page: 'contacts' },
};

Cookie.args = {
  header: HeaderPC.Default.args,
  menu: MenuContactsPC.Default.args,
  map: MapPC.Default.args,
  footer: { ...FooterPC.Default.args, cookie: false, page: 'contacts' },
};
