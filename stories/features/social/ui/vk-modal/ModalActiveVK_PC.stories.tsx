import { ModalActiveVK_PC } from './ModalActiveVK_PC';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Header / ПК / Модалка VK',
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
