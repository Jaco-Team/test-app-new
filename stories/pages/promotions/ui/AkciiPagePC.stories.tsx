import { AkciiPagePC } from './AkciiPagePC';
import * as BannerFullPC from '@stories/widgets/promotions/ui/promotion-detail/BannerFullPC.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Страницы / Акции',
  component: AkciiPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    actia: {
      type: 'object',
      description: 'Данные для акции на ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <AkciiPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
export const Cookie = Template.bind({});

Default.args = {
  actia: BannerFullPC.Page.args,
};

ArrowUp.args = {
  actia: BannerFullPC.Page.args
};

Cookie.args = {
  actia: BannerFullPC.Page.args
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
