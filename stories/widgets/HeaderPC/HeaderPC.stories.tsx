import React from 'react';

import { HeaderPC } from './HeaderPC';

export default {
  title: 'Header / ПК / Header',
  component: HeaderPC,
  tags: ['autodocs'],
  argTypes: {
    scroll: {
      type: 'boolean',
      description: 'Активация тени при скролле станиц сайта',
    },
    count: {
      type: 'string',
      description: 'Количество товара в корзине',
    },
  },
};

const Template = (args) => <HeaderPC {...args} />;
export const Default = Template.bind({});
export const Shadow = Template.bind({});

Default.args = {
  scroll: false,
  count: ''
};

Shadow.args = {
  scroll: true,
  count: ''
};
