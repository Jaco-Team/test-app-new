import MyRadioGroup from './MyRadioGroup';

import { responsiveStoryGlobals } from '../../lib/storybook/responsive';

const options = [
  { value: 'sms', label: 'СМС' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'voice', label: 'Звонок' },
];

export default {
  title: 'Общие элементы / Radio group',
  component: MyRadioGroup,
  tags: ['autodocs'],
};

const Template = (args) => <MyRadioGroup {...args} />;

export const Default = Template.bind({});
Default.args = { options };

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
