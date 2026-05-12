import React from 'react';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
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

export const Mobile = Template.bind({});
Mobile.args = Auth.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Auth.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Auth.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
