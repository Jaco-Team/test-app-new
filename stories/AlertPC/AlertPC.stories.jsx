import { AlertPC } from './AlertPC';

export default {
  title: 'Header / Уведомление клиента',
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
