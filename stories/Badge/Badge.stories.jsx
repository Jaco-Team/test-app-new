import { Badge } from './Badge';

export default {
  title: 'Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      type: 'string',
      description: 'Размер бейджа',
    },
    view: {
      type: 'string',
      description: 'Тип устройства',
    },
    type: {
      type: 'string',
      description: 'Значение бейджа',
    },
  },
};

const Template = (args) => <Badge {...args} />;
export const Hit = Template.bind({});
export const New = Template.bind({});
export const Sale = Template.bind({});

Hit.args = {
  size: 'big',
  view: 'pc',
  type: 'hit',
};

New.args = {
  size: 'big',
  view: 'pc',
  type: 'new',
};

Sale.args = {
  size: 'big',
  view: 'pc',
  type: 'sale',
};
