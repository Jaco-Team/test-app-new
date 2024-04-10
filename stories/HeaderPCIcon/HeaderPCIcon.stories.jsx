import { HeaderPCIcon } from './HeaderPCIcon';

export default {
  title: 'Header / Иконки',
  component: HeaderPCIcon,
  tags: ['autodocs'],
  argTypes: {
    count: {
      type: 'string',
      description: 'Сумма товара в корзине',
    },
    icon: {
      type: 'string',
      description: 'Тип иконки',
      control: {
        type: 'radio',
      },
      options: ['location', 'profile', 'docs', 'basket']
    },
  },
};

const Template = (args) => <HeaderPCIcon {...args} />;
export const Location = Template.bind({});
export const Profile = Template.bind({});
export const Docs = Template.bind({});
export const Basket = Template.bind({});
export const BasketActive = Template.bind({});
export const BasketActiveLong = Template.bind({});

Location.args = {
  count: 0,
  icon: 'location'
};

Profile.args = {
  count: 0,
  icon: 'profile'
};

Docs.args = {
  count: 0,
  icon: 'docs'
};

Basket.args = {
  count: 0,
  icon: 'basket'
};

BasketActive.args = {
  count: 245,
  icon: 'basket'
};

BasketActiveLong.args = {
  count: 10666,
  icon: 'basket'
};