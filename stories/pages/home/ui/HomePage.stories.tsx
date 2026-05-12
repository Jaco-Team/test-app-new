import { HomePage } from './HomePage';

import { responsiveStoryParameters } from '../../../shared/lib/storybook/responsive';
import * as BannerListPC from '../../../widgets/home/ui/banner-list/BannerListPC.stories';
import * as BoxItemHomePC from '../../../widgets/home/ui/product-grid/BoxItemHomePC.stories';

export default {
  title: 'Главная страница / Главная',
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
