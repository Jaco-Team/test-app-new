import { IconCartHeaderPC } from './IconCartHeaderPC';

export default {
  title: 'IconCartHeaderPC',
  component: IconCartHeaderPC,
  tags: ['autodocs'],
  argTypes: {
    active: {
      type: 'boolean',
      description: 'Активная корзина при 0 количестве товара',
      if: { arg: 'count', truthy: false },
    },
    count: {
      type: 'string',
      description: 'Количество товара в корзине',
    },
  },
};

const Template = (args) => <IconCartHeaderPC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Count = Template.bind({});

Default.args = {
  active: false,
  count: '',
};

Active.args = {
  active: true,
  count: '',
};

Count.args = {
  active: false,
  count: '5',
};
