import { ModalOrderDeletePC } from './ModalOrderDeletePC';

export default {
  title: 'Профиль / Заказы / Модалка Отмены заказа',
  component: ModalOrderDeletePC,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      type: 'string',
      description: 'Выбранный вариант отмены заказа',
    },
    text: {
      type: 'string',
      description: 'Текст отказа',
    },
  },
};

const Template = (args) => <ModalOrderDeletePC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Text_Active = Template.bind({});

Default.args = {
  variant: '',
  text: '',
};

Active.args = {
  variant: '1',
  text: '',
};

Text_Active.args = {
  variant: '6',
  text: 'Передумал',
};
