import { ModalItemPC } from './ModalItemPC';
import * as ModalItemPCdesc from '../ModalItemPCdesc/ModalItemPCdesc.stories';
import * as MyButton from '../MyButton/MyButton.stories';
import * as ModalItemPClist from '../ModalItemPClist/ModalItemPClist.stories';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Варианты модальных окон',
  component: ModalItemPC,
  tags: ['autodocs'],
  argTypes: {
    img_name: {
      type: 'string',
      description: 'Картинка',
    },
    title: {
      type: 'string',
      description: 'Название картинки',
    },
    is_new: {
      type: 'string',
      description: 'Значение бейджа Новинка',
    },
    is_hit: {
      type: 'string',
      description: 'Значение бейджа Хит',
    },
    desc: {
      type: 'object',
      description: 'Описание товара для сетов',
    },
    count: {
      type: 'object',
      description: 'Данные для кнопки',
    },
    list: {
      type: 'object',
      description: 'Список товаров',
    },
    typeModal: {
      type: 'string',
      description: 'Тип модального окна',
    },
  },
};

const Template = (args) => <ModalItemPC {...args} />;
export const Start_1 = Template.bind({});
export const Start_2 = Template.bind({});
export const Start_3 = Template.bind({});
export const Start_4 = Template.bind({});
export const Start_count = Template.bind({});
export const Set = Template.bind({});
export const Set_count = Template.bind({});
export const Value_1 = Template.bind({});
export const Value_2 = Template.bind({});
export const Value_3 = Template.bind({});
export const Value_count = Template.bind({});
export const Badge = Template.bind({});

Start_1.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: ModalItemPCdesc.Variant_1.args,
  count: MyButton.Modal.args,
  list: {},
  typeModal: 'start',
};

Start_2.args = {
  title: 'Пепперони',
  img_name: 'Pepperoni',
  is_new: '0',
  is_hit: '0',
  desc: ModalItemPCdesc.Variant_2.args,
  count: MyButton.Modal.args,
  list: {},
  typeModal: 'start',
};

Start_3.args = {
  title: 'Frustyle Апельсин',
  img_name: 'Frustyle_Apelsin',
  is_new: '0',
  is_hit: '0',
  desc: ModalItemPCdesc.Variant_3.args,
  count: MyButton.Modal.args,
  list: {},
  typeModal: 'start',
};

Start_4.args = {
  title: 'Вилка',
  img_name: 'Vilka',
  is_new: '0',
  is_hit: '0',
  desc: ModalItemPCdesc.Variant_4.args,
  count: MyButton.Modal.args,
  list: {},
  typeModal: 'start',
};

Start_count.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: ModalItemPCdesc.Variant_1.args,
  count: MyButton.Modal_Active.args,
  list: {},
  typeModal: 'start',
};

Set.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: {...ModalItemPCdesc.Variant_1.args, typeModal: 'set'},
  count: {...MyButton.Modal.args, typeModal: 'set'},
  list: ModalItemPClist.Set.args,
  typeModal: 'set',
};

Set_count.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: {...ModalItemPCdesc.Variant_1.args, typeModal: 'set'},
  count: {...MyButton.Modal_Active.args, typeModal: 'set'},
  list: ModalItemPClist.Set.args,
  typeModal: 'set',
};

Value_1.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: {...ModalItemPCdesc.Variant_1.args, typeModal: 'set', foodValue: true},
  count: {...MyButton.Modal.args, typeModal: 'set'},
  list: ModalItemPClist.Value.args,
  typeModal: 'value',
};

Value_2.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: {...ModalItemPCdesc.Variant_2.args, typeModal: 'set', foodValue: true},
  count: {...MyButton.Modal.args, typeModal: 'set'},
  list: ModalItemPClist.Value.args,
  typeModal: 'value',
};

Value_3.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: {...ModalItemPCdesc.Variant_3.args, typeModal: 'set', foodValue: true},
  count: {...MyButton.Modal.args, typeModal: 'set'},
  list: ModalItemPClist.Value.args,
  typeModal: 'value',
};

Value_count.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '0',
  is_hit: '0',
  desc: {...ModalItemPCdesc.Variant_1.args, typeModal: 'set', foodValue: true},
  count: {...MyButton.Modal_Active.args, typeModal: 'set'},
  list: ModalItemPClist.Value.args,
  typeModal: 'value',
};

Badge.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
  is_new: '1',
  is_hit: '0',
  desc: ModalItemPCdesc.Variant_1.args,
  count: MyButton.Modal.args,
  list: {},
  typeModal: 'start',
};
