// @ts-nocheck
import { BannerListPC } from './BannerListPC';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Акции / Лист баннеров на главной',
  component: BannerListPC,
  tags: ['autodocs'],
  argTypes: {
    
  },
};

const Template = (args) => <BannerListPC {...args} />;
export const OneImg = Template.bind({});
export const TwoImg = Template.bind({});

OneImg.args = {
  bannerList: [{
    title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
    img: 'Kombo1_Tlt',
  }]
};

TwoImg.args = {
  bannerList: [{
    title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
    img: 'Kombo1_Tlt',
  }, {
    title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
    img: 'Kombo1_Tlt',
  }]
};

export const Mobile = Template.bind({});
Mobile.args = OneImg.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = OneImg.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = OneImg.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
