import { CloseButton } from './CloseButton';

import { responsiveStoryGlobals } from '../../lib/storybook/responsive';
export default {
  title: 'Общие элементы / Закрытие',
  component: CloseButton,
  tags: ['autodocs'],
};

const Template = (args) => <CloseButton {...args} />;
export const Default = Template.bind({});

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
