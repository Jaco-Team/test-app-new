// @ts-nocheck
import { BannerPCImg } from './BannerPCImg';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Акции / Изображение',
  component: BannerPCImg,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Название акции',
    },
    img: {
      type: 'string',
      description: 'Ссылка на картинку акции',
    },
    type: {
      type: 'string',
      description: 'Компонент где находится акция',
    },
  },
};

const Template = (args) => <BannerPCImg {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
  img: 'https://storage.yandexcloud.net/site-home-img/Kombo1_Tlt_3700x1000.jpg',
  type: 'banner',
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
