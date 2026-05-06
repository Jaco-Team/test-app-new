import { ModalItemPClist } from './ModalItemPClist';
import * as ModalItemPCset from '../ModalItemPCset/ModalItemPCset.stories';
import * as ModalItemPCvalue from '../ModalItemPCvalue/ModalItemPCvalue.stories';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Список товаров',
  component: ModalItemPClist,
  tags: ['autodocs'],
  argTypes: {
    set: {
      type: 'object',
      description: 'Список товаров сета',
    },
    value: {
      type: 'object',
      description: 'Список товаров сета',
    },
    type: {
      type: 'string',
      description: 'Тип списка товаров',
    },
    link_allergens: {
      type: 'string',
      description: 'Ссылка на скачивание',
    }
  },
};

const Template = (args) => <ModalItemPClist {...args} />;
export const Set = Template.bind({});
export const Value = Template.bind({});

Set.args = {
  value: {},
  set: ModalItemPCset.Default.args,
  type: 'set',
  link_allergens: ''
};

Value.args = {
  value: ModalItemPCvalue.Default.args,
  set: {},
  type: 'value',
  link_allergens: "https://storage.yandexcloud.net/site-other-data/jaco_2024_03_23.pdf"
};
