import { BoxItemHomePC } from './BoxItemHomePC';
import * as ItemHomePc from '../ItemHomePc/ItemHomePc.stories';

export default {
  title: 'BoxItemHomePC',
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
