import { BoxItemHome } from './BoxItemHome';
import * as ItemHome from '@stories/entities/product/ui/product-card/ItemHome.stories';
import banner from '../../../../fixtures/banners.togliatti.json';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Виджеты / Главная / Список товаров',
  component: BoxItemHome,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    cardItem: {
      type: 'object',
      description: 'Данные по умолчанию для карточки товара ПК',
    },
  },
};

const Template = (args) => <BoxItemHome {...args} />;
export const Default = Template.bind({});

Default.args = {
  cardItem: banner.itemsList,
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
