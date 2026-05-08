// @ts-nocheck
import { Badge } from './Badge';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Главная страница / Товар / Тэг',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      type: 'string',
      description: 'Размер бейджа',
      control: {
        type: 'radio',
      },
      options: ['big', 'small']
    },
    view: {
      type: 'string',
      description: 'Тип устройства',
    },
    type: {
      type: 'string',
      description: 'Значение бейджа',
      control: {
        type: 'radio',
      },
      options: ['hit', 'new', 'sale']
    },
  },
};

const Template = (args) => <><Badge {...args} size={'small'} /><Badge {...args} size={'big'} /></>;
export const Hit = Template.bind({});
export const New = Template.bind({});
export const Sale = Template.bind({});

Hit.args = {
  //size: 'big',
  view: 'pc',
  type: 'hit',
};

New.args = {
  //size: 'big',
  view: 'pc',
  type: 'new',
};

Sale.args = {
  //size: 'big',
  view: 'pc',
  type: 'sale',
};

export const Mobile = Template.bind({});
Mobile.args = Hit.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Hit.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Hit.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
