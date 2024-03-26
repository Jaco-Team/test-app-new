import { ItemBannerPC } from './ItemBannerPC';

export default {
  title: 'ItemBannerPC',
  component: ItemBannerPC,
  tags: ['autodocs'],
  argTypes: {
    data_key: {
      type: 'number',
      description: 'Порядковый номер товара',
    },
    title: {
      type: 'string',
      description: 'Название товара',
    },
    img_app: {
      type: 'string',
      description: 'Название картинки',
    },
    marc_desc: {
      type: 'string',
      description: 'Описание или состав товара',
    },
    tmp_desc: {
      type: 'string',
      description: 'Описание или состав товара',
    },
    price: {
      type: 'string',
      description: 'Стоимость товара',
    },
    count: {
      type: 'number',
      description: 'Количество в корзине',
    },
    typePromo: {
      type: 'string',
      description: 'Тип промика',
    },
  },
};

const Template = (args) => <ItemBannerPC {...args} />;

export const Default = Template.bind({});
export const Promo = Template.bind({});
export const Active = Template.bind({});
export const LongText = Template.bind({});

Default.args = {
  data_key: 0,
  title: 'Водопад сет',
  img_app: 'Vodopad_set',
  marc_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  tmp_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  typePromo: '2',
  count: 0,
};
Promo.args = {
  data_key: 0,
  title: 'Водопад сет',
  img_app: 'Vodopad_set',
  marc_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  tmp_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  typePromo: '1',
  count: 0,
};
Active.args = {
  data_key: 0,
  title: 'Водопад сет',
  img_app: 'Vodopad_set',
  marc_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  tmp_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  typePromo: '1',
  count: 1,
};
LongText.args = {
  data_key: 0,
  title: 'Цезарь с курицей запечённый унаги',
  img_app: 'Cezar_s_kuricei_zapechionnyi_unagi',
  marc_desc:
    'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и куриное филе, запечённое со специями, салат айсберг творожный сыр, румяная сырная шапочка с унаги и кунжутом',
  tmp_desc:
    'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и еще текст и еще какой-то текст',
  price: '229',
  typePromo: '2',
  count: 0,
};
