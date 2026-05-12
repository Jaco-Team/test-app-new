import { AlertPC } from './AlertPC';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
export default {
  title: 'Header / ПК / Уведомление клиента',
  component: AlertPC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    status: {
      type: 'boolean',
      description: 'Статус уведомления',
    },
    text: {
      type: 'string',
      description: 'Текст уведомления',
    },
  },
};

const Template = (args) => <AlertPC {...args} />;
export const Basic = Template.bind({});
export const Error = Template.bind({});

Basic.args = {
  status: true,
  text: 'Промокод активирован',
};

Error.args = {
  status: false,
  text: 'Необходимо выбрать Адрес доставки',
};

export const Mobile = Template.bind({});
Mobile.args = Basic.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Basic.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Basic.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
