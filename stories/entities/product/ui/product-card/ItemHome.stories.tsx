import React from 'react';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { homeProductCards } from '@stories/fixtures/home';
import { ItemHome } from './ItemHome';

export default {
  title: 'Сущности / Товар / Карточка',
  component: ItemHome,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Название товара',
    },
    img: {
      type: 'string',
      description: 'Название картинки',
    },
    weight: {
      type: 'string',
      description: 'Объемы',
    },
    description: {
      type: 'string',
      description: 'Описание или состав товара',
    },
    price: {
      type: 'string',
      description: 'Стоимость товара',
    },
    count: {
      type: 'string',
      description: 'Количество в корзине',
    },
    is_new: {
      type: 'string',
      description: 'Значение бейджа Новинка',
    },
    is_hit: {
      type: 'string',
      description: 'Значение бейджа Хит',
    },
  },
};

const Template = (args) => <ItemHome {...args} />;

export const Default = Template.bind({});
export const PlaceholderImg = Template.bind({});
export const Active = Template.bind({});
export const PlaceholderImgActive = Template.bind({});
export const LongText = Template.bind({});
export const Badge = Template.bind({});

const defaultProduct = homeProductCards[0];
const activeProduct = { ...defaultProduct, count: '1' };
const placeholderProduct = { ...defaultProduct, img_app: '' };
const longTextProduct = {
  ...defaultProduct,
  name: 'Цезарь с курицей запечённый унаги',
  img_app: 'Cezar_s_kuricei_zapechionnyi_unagi',
  count_part: '8',
  weight: '287',
  marc_desc:
    'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и еще текст и еще какой-то текст',
  price: '229',
};

Default.args = defaultProduct;
Active.args = activeProduct;
PlaceholderImg.args = placeholderProduct;
PlaceholderImgActive.args = { ...placeholderProduct, count: '1' };
LongText.args = longTextProduct;
Badge.args = { ...defaultProduct, is_new: '1', is_hit: '0' };

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
