import { SelectAddress } from './SelectAddress';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Город и адрес / Выбор адреса',
  component: SelectAddress,
  tags: ['autodocs'],
  argTypes: {
    list: {
      type: 'array',
      description: 'Список адресов',
    },
  },
};

const Template = (args) => <SelectAddress {...args} />;
export const Default = Template.bind({});

Default.args = {
  list: [
    { addressLine: 'Россия, Самара, посёлок Соцгород, Зелёная улица, 5, подъезд 1' },
    { addressLine: 'Россия, Самара, посёлок Сорокины Хутора, Зелёная улица, 5' },
  ],
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
