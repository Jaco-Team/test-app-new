import { morskoiSetItems } from '@stories/fixtures/product-modal';
import { ModalItemValue } from './ModalItemValue';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Сущности / Товар / БЖУ',
  component: ModalItemValue,
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
    kkal: {
      type: 'string',
      description: 'Количестов каллорий в товаре',
    },
    tmp_desc: {
      type: 'string',
      description: 'Состав товара',
    },
    protein: {
      type: 'string',
      description: 'Количество протеина в товаре',
    },
    fat: {
      type: 'string',
      description: 'Количество жиров в товаре',
    },
    carbohydrates: {
      type: 'string',
      description: 'Количество углеводов в товаре',
    },
  },
};

const Template = (args) => <ModalItemValue {...args} />;
export const Default = Template.bind({});
export const LongText = Template.bind({});

Default.args = {
  ...morskoiSetItems[0],
  tmp_desc: morskoiSetItems[0].marc_desc,
};

LongText.args = {
  ...morskoiSetItems[3],
  tmp_desc: morskoiSetItems[3].marc_desc,
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
