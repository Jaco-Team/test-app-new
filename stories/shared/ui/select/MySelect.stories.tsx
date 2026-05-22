import MySelect from './MySelect';

import { responsiveStoryGlobals } from '../../lib/storybook/responsive';
export default {
  title: 'Общие элементы / Select',
  component: MySelect,
  tags: ['autodocs'],
  argTypes: {},
};

const Template = (args) => <MySelect {...args} />;

export const Default = Template.bind({});

Default.args = {};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
