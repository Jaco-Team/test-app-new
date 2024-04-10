import { BannerItemPC } from './BannerItemPC';

export default {
  title: 'Акции / Товар акции',
  component: BannerItemPC,
  tags: ['autodocs'],
  argTypes: {
    number: {
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
    desc: {
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
    typePrice: {
      type: 'string',
      description: 'Тип кнопки цены',
      control: {
        type: 'radio',
      },
      options: ['text', 'active']
    },
  },
};

const Template = (args) => <BannerItemPC {...args} />;

export const Default = Template.bind({});
export const Promo = Template.bind({});
export const Active = Template.bind({});
export const LongText = Template.bind({});

Default.args = {
  number: 1,
  title: 'Водопад сет',
  img_app: 'Vodopad_set',
  desc: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  typePrice: 'text',
  count: 0,
};
Promo.args = {
  number: 1,
  title: 'Водопад сет',
  img_app: 'Vodopad_set',
  desc: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  typePrice: 'active',
  count: 0,
};
Active.args = {
  number: 1,
  title: 'Водопад сет',
  img_app: 'Vodopad_set',
  desc: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  typePrice: 'active',
  count: 3,
};
LongText.args = {
  number: 1,
  title: 'Цезарь с курицей запечённый унаги',
  img_app: 'Cezar_s_kuricei_zapechionnyi_unagi',
  desc: 'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и куриное филе, запечённое со специями, салат айсберг творожный сыр, румяная сырная шапочка с унаги и кунжутом',
  price: '229',
  typePrice: 'text',
  count: 0,
};
