import { BoxItemHomePC } from './BoxItemHomePC';
import * as ItemHomePc from '../../../../entities/product/ui/product-card/ItemHomePc.stories';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Главная страница / Товар / Список',
  component: BoxItemHomePC,
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

const Template = (args) => <BoxItemHomePC {...args} />;
export const Default = Template.bind({});

Default.args = {
  cardItem: ItemHomePc.Default.args,
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
