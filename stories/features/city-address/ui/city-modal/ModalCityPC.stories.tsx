import { ModalCityPC } from './ModalCityPC';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Header / ПК / Модалка выбора города',
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
