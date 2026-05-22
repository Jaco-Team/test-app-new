import { AboutPagePC } from './AboutPagePC';
import * as BreadСrumbs from '@stories/shared/ui/breadcrumbs/BreadСrumbs.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Страницы / О компании',
  component: AboutPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки ПК',
    },
    data: {
      control: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <AboutPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  data: BreadСrumbs.About.args,
};

ArrowUp.args = {
  data: BreadСrumbs.About.args,
};

// Cookie.args = {
////   actia: BannerFullPC.Page.args,
//
// };

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
