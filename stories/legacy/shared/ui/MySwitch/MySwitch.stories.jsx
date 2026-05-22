import React from 'react';

import { MySwitch } from './MySwitch';

export default {
  title: 'Элементы / Switch',
  component: MySwitch,
  tags: ['autodocs'],
  argTypes: {
    type: {
      type: 'string',
      description: 'Тип свитча',
    },
  },
};

const Template = (args) => <MySwitch {...args} />;

export const Auth = Template.bind({});
export const Cart = Template.bind({});
export const IOS = Template.bind({});

Auth.args = {
  type: 'auth',
};

Cart.args = {
  type: 'cart',
};

IOS.args = {
  type: 'ios',
};
