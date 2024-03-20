import React from 'react';

import { ItemHomePc } from './ItemHomePc';

export default {
  title: 'ItemHomePc',
  component: ItemHomePc,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Название товара',
    },
    img: {
      type: 'string',
      description: 'Название картинки'
    },
    weight: {
      type: 'string',
      description: 'Объемы'
    },
    description: {
      type: 'string',
      description: 'Описание или состав товара'
    },
    price: {
      type: 'string',
      description: 'Стоимость товара'
    },
    count: {
      type: 'string',
      description: 'Количество в корзине'
    }
  }
};

const Template = (args) => <ItemHomePc {...args} />;

export const Default = Template.bind({});
export const PlaceholderImg = Template.bind({});
export const Active = Template.bind({});
export const PlaceholderImgActive = Template.bind({});
export const LongText = Template.bind({});

Default.args = {
  title: 'Водопад сет', 
  img: 'Vodopad_set', 
  weight: '5 роллов | 40 шт. | 1 311 г', 
  description: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако', 
  price: '1129',
  count: '0'
};
Active.args = {
  title: 'Водопад сет', 
  img: 'Vodopad_set', 
  weight: '5 роллов | 40 шт. | 1 311 г', 
  description: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако', 
  price: '1129',
  count: '1'
};
PlaceholderImgActive.args = {
  title: 'Водопад сет', 
  img: '', 
  weight: '5 роллов | 40 шт. | 1 311 г', 
  description: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако', 
  price: '1129',
  count: '1'
};
PlaceholderImg.args = {
  title: 'Водопад сет', 
  img: '', 
  weight: '5 роллов | 40 шт. | 1 311 г', 
  description: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако', 
  price: '1129',
  count: '0'
};
LongText.args = {
  title: 'Цезарь с курицей запечённый унаги', 
  img: 'Cezar_s_kuricei_zapechionnyi_unagi', 
  weight: '8 шт. | 287 г', 
  description: 'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и еще текст и еще какой-то текст', 
  price: '229',
  count: '0'
};