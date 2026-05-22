import { PromokodyPagePC } from './PromokodyPagePC';
import * as PromokodyPC from '@stories/entities/profile/ui/promo-code-list/PromokodyPC.stories';
import * as BreadCrumbsStories from '@stories/shared/ui/breadcrumbs/BreadСrumbs.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Профиль / Промокоды / Страница Промокоды',
  component: PromokodyPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки ПК',
    },
    promokod: {
      control: 'object',
      description: 'Данные для Промокода',
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

const Template = (args) => <PromokodyPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  promokod: PromokodyPC.Default.args,
  data: { ...BreadCrumbsStories.Profile.args, activePage: 'promokody' },
};

ArrowUp.args = {
  promokod: PromokodyPC.Default.args,
  data: { ...BreadCrumbsStories.Profile.args, activePage: 'promokody' },
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
