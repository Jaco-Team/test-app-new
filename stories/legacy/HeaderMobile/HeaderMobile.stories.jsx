import { HeaderMobile } from './HeaderMobile';
import * as NavBarMobile from '../NavBarMobile/NavBarMobile.stories';

export default {
  title: 'Header / Мобильное устройство / Header',
  component: HeaderMobile,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    activeMenu: {
      type: 'boolean',
      description: 'Активация меню навигации',
    },
    menu: {
      type: 'object',
      description: 'Данные для меню навигации',
    },
  },
};

const Template = (args) => <HeaderMobile {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});

Default.args = {
  activeMenu: false,
  menu: null,
};

Active.args = {
  activeMenu: true,
  menu: NavBarMobile.Default.args,
};
