import { HomePage } from './HomePage';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import * as BannerListPC from '@stories/widgets/home/ui/banner-list/BannerListPC.stories';
import * as BoxItemHomePC from '@stories/widgets/home/ui/product-grid/BoxItemHomePC.stories';

export default {
  title: 'Страницы / Главная',
  component: HomePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные по умолчанию для шапки ПК',
    },
    banners: {
      type: 'array',
      description: 'Данные по умолчанию для баннера ПК',
    },
    container: {
      type: 'object',
      description: 'Данные по умолчанию для контейнера карточек товара ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные по умолчанию для футера ПК',
    },
  },
};

const Template = (args) => <HomePage {...args} />;
export const Default = Template.bind({});
export const Cookie = Template.bind({});
export const ArrowUp = Template.bind({});

Default.args = {
  banners: BannerListPC.TwoImg.args,
  container: BoxItemHomePC.Default.args,
};

Cookie.args = {
  banners: BannerListPC.TwoImg.args,
  container: BoxItemHomePC.Default.args,
};

ArrowUp.args = {
  banners: BannerListPC.TwoImg.args,
  container: BoxItemHomePC.Default.args,
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
