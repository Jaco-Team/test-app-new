import { AkciiPagePC } from './AkciiPagePC';
import * as BannerFullPC from '../../../widgets/promotions/ui/promotion-detail/BannerFullPC.stories';

import { responsiveStoryParameters } from '../../../shared/lib/storybook/responsive';
export default {
  title: 'Акции / Страница Акции',
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
