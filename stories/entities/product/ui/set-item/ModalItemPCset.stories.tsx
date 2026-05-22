import { ModalItemPCset } from './ModalItemPCset';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Сущности / Товар / Товар из сета',
  component: ModalItemPCset,
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

const Template = (args) => <ModalItemPCset {...args} />;
export const Default = Template.bind({});
export const LongText = Template.bind({});

Default.args = {
  number: 1,
  title: 'Гавайи жареный',
  img_app: 'Gavaii_zharenyi20220726',
  marc_desc: 'Белое куриное филе, солнечный медовый ананас, лёгкий творожный сыр, белый соус, обжаренные сухарики',
  tmp_desc: '',
};

LongText.args = {
  number: 1,
  title: 'Цезарь с курицей запечённый унаги',
  img_app: 'Cezar_s_kuricei_zapechionnyi_unagi',
  marc_desc: 'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом и куриное филе, запечённое со специями, салат айсберг творожный сыр, румяная сырная шапочка с унаги и кунжутом',
  tmp_desc: '',
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
