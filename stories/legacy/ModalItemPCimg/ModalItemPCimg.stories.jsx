import { ModalItemPCimg } from './ModalItemPCimg';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Изображение',
  component: ModalItemPCimg,
  tags: ['autodocs'],
  argTypes: {
    img_name: {
      type: 'string',
      description: 'Картинка'
    },
    title: {
      type: 'string',
      description: 'Название картинки'
    },
  },
};

const Template = (args) => <ModalItemPCimg {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
};
