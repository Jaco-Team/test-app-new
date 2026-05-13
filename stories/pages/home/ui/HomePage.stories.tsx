// @ts-nocheck
import { HomePage } from './HomePage';

import {
  responsiveStoryGlobals,
  responsiveStoryParameters,
} from '@stories/shared/lib/storybook/responsive';
import * as BannerList from '@stories/widgets/home/ui/banner-list/BannerList.stories';
import * as BoxItemHome from '@stories/widgets/home/ui/product-grid/BoxItemHome.stories';

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

Default.args = {
  banners: BannerList.TwoImg.args,
  container: BoxItemHome.Default.args,
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Desktop;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
