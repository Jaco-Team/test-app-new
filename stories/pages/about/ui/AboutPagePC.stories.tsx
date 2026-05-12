// @ts-nocheck
import { AboutPagePC } from './AboutPagePC';
import * as BreadСrumbsPC from '../../../shared/ui/breadcrumbs/BreadСrumbsPC.stories';

import { responsiveStoryParameters } from '../../../shared/lib/storybook/responsive';
export default {
  title: 'Страница О компании / О компании',
  component: AboutPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    data: {
      type: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <AboutPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  data: BreadСrumbsPC.About.args,
};

ArrowUp.args = {
  data: BreadСrumbsPC.About.args
};

// Cookie.args = {
////   actia: BannerFullPC.Page.args,
//
// };

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
