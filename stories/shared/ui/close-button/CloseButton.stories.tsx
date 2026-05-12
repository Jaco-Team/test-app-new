import { CloseButton } from './CloseButton';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
export default {
  title: 'Элементы / IconClose',
  component: CloseButton,
  tags: ['autodocs'],
};

const Template = (args) => <CloseButton {...args} />;
export const Default = Template.bind({});

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
