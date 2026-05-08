// @ts-nocheck
import MySelect from './MySelect';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
export default {
  title: 'Элементы / Select',
  component: MySelect,
  tags: ['autodocs'],
  argTypes: {},
};

const Template = (args) => <MySelect {...args} />;

export const Default = Template.bind({});

Default.args = {};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
