// @ts-nocheck
import { BoxItemHomePC } from './BoxItemHomePC';
import * as ItemHomePc from '../../../../entities/product/ui/product-card/ItemHomePc.stories';

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
