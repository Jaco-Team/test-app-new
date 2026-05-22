import { ModalCityPC } from './ModalCityPC';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Город и адрес / Выбор города',
  component: ModalCityPC,
  tags: ['autodocs'],
  argTypes: {
    city: {
      type: 'string',
      description: 'Название города',
    },
  },
};

const Template = (args) => <ModalCityPC {...args} />;
export const Default = Template.bind({});
export const Long_title_city = Template.bind({});

Default.args = {
  city: 'Тольятти',
};

Long_title_city.args = {
  city: 'Комсомольск-на-Амуре',
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
