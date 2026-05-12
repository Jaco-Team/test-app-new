import { ModalActiveVK_PC } from './ModalActiveVK_PC';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Социальные сети / VK',
  component: ModalActiveVK_PC,
  tags: ['autodocs'],
  argTypes: {
    link: {
      type: 'string',
      description: 'Ссылка на группу в ВК',
    },
  },
};

const Template = (args) => <ModalActiveVK_PC {...args} />;
export const Default = Template.bind({});

Default.args = {
  link: 'https://vk.com/jacofood_tlt',
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
