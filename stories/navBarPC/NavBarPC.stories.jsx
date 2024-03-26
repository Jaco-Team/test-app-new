import React from 'react';

import { NavBarPC } from './NavBarPC';

export default {
  title: 'HeaderPC',
  component: NavBarPC,
  tags: ['autodocs'],
  // parameters: {
  //   layout: 'fullscreen',
  // },
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

const Template = (args) => <NavBarPC {...args} />;
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
