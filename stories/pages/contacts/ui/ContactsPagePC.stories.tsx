import { ContactsPagePC } from './ContactsPagePC';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import * as MenuContactsPC from '@stories/features/contacts/ui/contacts-menu/MenuContactsPC.stories';
import * as MapPC from '@stories/widgets/contacts/ui/map/MapPC.stories';

export default {
  title: 'Страницы / Контакты',
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
  menu: MenuContactsPC.Default.args,
  map: MapPC.Default.args
};

ArrowUp.args = {
  menu: MenuContactsPC.Default.args,
  map: MapPC.Default.args
};

Cookie.args = {
  menu: MenuContactsPC.Default.args,
  map: MapPC.Default.args
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
