import { BannerList } from './BannerList';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import banner from '../../../../fixtures/banners.togliatti.json';
export default {
  title: 'Акции / Лист баннеров на главной',
  component: BannerList,
  tags: ['autodocs'],
  argTypes: {},
};

const Template = (args) => <BannerList {...args} />;
export const OneImg = Template.bind({});
export const TwoImg = Template.bind({});

OneImg.args = {
  bannerList: banner.bannersList,
};

TwoImg.args = {
  bannerList: banner.bannersList,
};

export const Mobile = Template.bind({});
Mobile.args = OneImg.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = OneImg.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = OneImg.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
