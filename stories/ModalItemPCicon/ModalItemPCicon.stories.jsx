import { ModalItemPCicon } from './ModalItemPCicon';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Иконка',
  component: ModalItemPCicon,
  tags: ['autodocs'],
  argTypes: {
    foodValue: {
      type: 'boolean',
      description: 'Тип модального окна: БЖУ или нет',
    },
  },
};

const Template = (args) => <ModalItemPCicon {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});

Default.args = {
  foodValue: false,
};

Active.args = {
  foodValue: true,
};
