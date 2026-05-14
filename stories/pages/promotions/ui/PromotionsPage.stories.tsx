import { PromotionsPage } from './PromotionsPage';
import * as PromotionDetail from '@stories/widgets/promotions/ui/promotion-detail/PromotionDetail.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Страницы / Акции',
  component: PromotionsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки',
    },
    actia: {
      type: 'object',
      description: 'Данные для акции',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера',
    },
  },
};

const Template = (args) => <PromotionsPage {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
export const Cookie = Template.bind({});

Default.args = {
  actia: PromotionDetail.Page.args,
  viewport: 'desktop',
};

ArrowUp.args = {
  actia: PromotionDetail.Page.args,
  viewport: 'desktop',
};

Cookie.args = {
  actia: PromotionDetail.Page.args,
  viewport: 'desktop',
};

export const Mobile = Template.bind({});
Mobile.args = {
  ...Default.args,
  viewport: 'mobile',
};
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = {
  ...Default.args,
  viewport: 'tablet',
};
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = {
  ...Default.args,
  viewport: 'desktop',
};
Desktop.globals = responsiveStoryGlobals.Desktop;
