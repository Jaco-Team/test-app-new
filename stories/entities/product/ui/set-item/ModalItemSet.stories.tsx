import { morskoiSetItems } from '@stories/fixtures/product-modal';
import { ModalItemSet } from './ModalItemSet';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Сущности / Товар / Товар из сета',
  component: ModalItemSet,
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

const Template = (args) => <ModalItemSet {...args} />;
export const Default = Template.bind({});
export const LongText = Template.bind({});

Default.args = morskoiSetItems[0];

LongText.args = morskoiSetItems[3];

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
