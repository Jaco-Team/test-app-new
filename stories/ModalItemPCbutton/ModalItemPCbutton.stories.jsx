import { ModalItemPCbutton } from './ModalItemPCbutton';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Кнопка',
  component: ModalItemPCbutton,
  tags: ['autodocs'],
  argTypes: {
    price: {
      type: 'string',
      description: 'Цена товара',
    },
    count: {
      type: 'number',
      description: 'Количество товара',
    },
    typeModal: {
      type: 'string',
      description: 'Тип модального окна',
    },
  },
};

const Template = (args) => <ModalItemPCbutton {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});

Default.args = {
  price: '500',
  count: 0,
  typeModal: 'start',
};

Active.args = {
  price: '500',
  count: 1,
  typeModal: 'start',
};
