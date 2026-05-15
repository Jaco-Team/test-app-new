import { ContactsPage } from './ContactsPage';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import * as MenuContacts from '@stories/features/contacts/ui/contacts-menu/MenuContacts.stories';
import * as Map from '@stories/widgets/contacts/ui/map/Map.stories';

export default {
  title: 'Страницы / Контакты',
  component: ContactsPage,
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

const Template = (args) => <ContactsPage {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
export const Cookie = Template.bind({});

Default.args = {
  menu: MenuContacts.Default.args,
  map: Map.Default.args,
};

ArrowUp.args = {
  menu: MenuContacts.Default.args,
  map: Map.Default.args,
};

Cookie.args = {
  menu: MenuContacts.Default.args,
  map: Map.Default.args,
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
