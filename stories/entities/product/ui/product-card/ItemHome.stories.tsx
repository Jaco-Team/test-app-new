import React from 'react';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { ItemHome } from './ItemHome';

export default {
  title: 'Сущности / Товар / Карточка',
  component: ItemHome,
  tags: ['autodocs'],
  argTypes: {
    name: {
      type: 'string',
      description: 'Название товара',
    },
    img_app: {
      type: 'string',
      description: 'Название картинки',
    },
    weight: {
      type: 'string',
      description: 'Объемы',
    },
    marc_desc: {
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

Default.args = {
  name: 'Водопад сет',
  img_app: 'Vodopad_set',
  count_part: '40',
  weight: '1 311',
  marc_desc:
    'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
  price: '1129',
  count: '0',
  is_new: '0',
  is_hit: '0',
};
Active.args = {
  ...Default.args,
  count: '1',
};
PlaceholderImgActive.args = {
  ...Default.args,
  img_app: '',
  count: '1',
};
PlaceholderImg.args = {
  ...Default.args,
  img_app: '',
};
LongText.args = {
  ...Default.args,
  name: 'Цезарь с курицей запечённый унаги',
  img_app: 'Cezar_s_kuricei_zapechionnyi_unagi',
  count_part: '8',
  weight: '287',
  marc_desc:
    'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и еще текст и еще какой-то текст',
  price: '229',
};
Badge.args = {
  ...Default.args,
  is_new: '1',
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
