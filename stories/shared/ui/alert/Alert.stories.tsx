import { Alert } from './Alert';

import { responsiveStoryGlobals } from '../../lib/storybook/responsive';
export default {
  title: 'Общие элементы / Уведомления',
  component: Alert,
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

const Template = (args) => <Alert {...args} />;
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
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Basic.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Basic.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
