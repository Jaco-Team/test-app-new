import { ModalItemPCdesc } from './ModalItemPCdesc';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Описание',
  component: ModalItemPCdesc,
  tags: ['autodocs'],
  argTypes: {
    title_desk: {
      type: 'string',
      description: 'Наименование товара',
    },
    cat_id: {
      type: 'string',
      description: 'Категория товара',
    },
    typeModal: {
      type: 'string',
      description: 'Тип модального окна',
    },
    count_part_new: {
      type: 'string',
      description: 'Количество роллов в сете',
    },
    size_pizza: {
      type: 'string',
      description: 'Размер пиццы',
    },
    count_part: {
      type: 'string',
      description: 'Общее количество ролл в сете',
    },
    weight: {
      type: 'string',
      description: 'Общий вес товара',
    },
    id: {
      type: 'string',
      description: 'ИД номер товара в БД',
    },
    foodValue: {
      type: 'boolean',
      description: 'Тип модального окна: БЖУ или нет',
    },
    marc_desc: {
      type: 'string',
      description: 'Описание или состав товара',
    },
    tmp_desc: {
      type: 'string',
      description: 'Описание или состав товара',
    },
  },
};

const Template = (args) => <ModalItemPCdesc {...args} />;
export const Variant_1 = Template.bind({});
export const Variant_2 = Template.bind({});
export const Variant_3 = Template.bind({});
export const Variant_4 = Template.bind({});

Variant_1.args = {
  title_desk: 'Атлантида сет',
  cat_id: '4',
  typeModal: 'start',
  count_part_new: '4 ролла',
  size_pizza: '35',
  count_part: '32',
  weight: '1129',
  id: '4',
  foodValue: false,
  marc_desc: 'Цезарь с курицей запечённый унаги, Филадельфия Лайт, Акваланг запечённый унаги, Калифорния с лососем Люкс',
  tmp_desc: ''
};

Variant_2.args = {
  title_desk: 'Пепперони',
  cat_id: '14',
  typeModal: 'start',
  count_part_new: '',
  size_pizza: '35',
  count_part: '32',
  weight: '640',
  id: '4',
  foodValue: false,
  marc_desc: 'Остренькие колбаски пепперони, сыр моцарелла с нежным сливочным вкусом, томатный соус с базиликом',
  tmp_desc: ''
};

Variant_3.args = {
  title_desk: 'Frustyle Апельсин',
  cat_id: '6',
  typeModal: 'start',
  count_part_new: '',
  size_pizza: '35',
  count_part: '1',
  weight: '0.5',
  id: '4',
  foodValue: false,
  marc_desc: 'Газированный напиток с бодрящим цитрусовым вкусом прекрасно дополнит любое блюдо',
  tmp_desc: ''
};

Variant_4.args = {
  title_desk: 'Вилка',
  cat_id: '7',
  typeModal: 'start',
  count_part_new: '',
  size_pizza: '0',
  count_part: '1',
  weight: '1',
  id: '237',
  foodValue: false,
  marc_desc: '',
  tmp_desc: ''
};
