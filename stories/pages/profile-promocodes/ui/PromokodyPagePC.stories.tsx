import { PromokodyPagePC } from './PromokodyPagePC';
import * as PromokodyPC from '../../../entities/profile/ui/promo-code-list/PromokodyPC.stories';
import * as BreadСrumbsPC from '../../../shared/ui/breadcrumbs/BreadСrumbsPC.stories';

import { responsiveStoryParameters } from '../../../shared/lib/storybook/responsive';
export default {
  title: 'Профиль / Промокоды / Страница Промокоды',
  component: PromokodyPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    promokod: {
      type: 'object',
      description: 'Данные для Промокода',
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

const Template = (args) => <PromokodyPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  promokod: PromokodyPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'promokody' },
};

ArrowUp.args = {
  promokod: PromokodyPC.Default.args,
  data: { ...BreadСrumbsPC.Profile.args, activePage: 'promokody' }
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
