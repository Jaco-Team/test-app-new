import { ModalItemPClist } from './ModalItemPClist';
import * as ModalItemPCset from '@stories/entities/product/ui/set-item/ModalItemPCset.stories';
import * as ModalItemPCvalue from '@stories/entities/product/ui/nutrition/ModalItemPCvalue.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Модалка товара / Список товаров',
  component: ModalItemPClist,
  tags: ['autodocs'],
  argTypes: {
    set: {
      type: 'object',
      description: 'Список товаров сета',
    },
    value: {
      type: 'object',
      description: 'Список товаров сета',
    },
    type: {
      type: 'string',
      description: 'Тип списка товаров',
    },
    link_allergens: {
      type: 'string',
      description: 'Ссылка на скачивание',
    }
  },
};

const Template = (args) => <ModalItemPClist {...args} />;
export const Set = Template.bind({});
export const Value = Template.bind({});

Set.args = {
  value: {},
  set: ModalItemPCset.Default.args,
  type: 'set',
  link_allergens: ''
};

Value.args = {
  value: ModalItemPCvalue.Default.args,
  set: {},
  type: 'value',
  link_allergens: "https://storage.yandexcloud.net/site-other-data/jaco_2024_03_23.pdf"
};

export const Mobile = Template.bind({});
Mobile.args = Set.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Set.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Set.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
