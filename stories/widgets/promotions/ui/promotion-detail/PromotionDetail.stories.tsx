import { PromotionDetail } from './PromotionDetail';
import akciiSamara from '@stories/fixtures/akcii.samara.json';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Акции / Акция',
  component: PromotionDetail,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Имя для картинки',
    },
    img: {
      type: 'string',
      description: 'Название картинки',
    },
    text: {
      type: 'string',
      description: 'Описание акции',
    },
    typePromo: {
      type: 'string',
      description: 'Тип промика',
    },
    count: {
      type: 'number',
      description: 'Количество товара',
    },
    type: {
      type: 'string',
      description: 'Компонент сайта где размещена акция',
    },
  },
};

const Template = (args) => <PromotionDetail {...args} />;
export const Banner = Template.bind({});
export const Page = Template.bind({});

Banner.args = {
  ...akciiSamara,
  type: 'banner',
};

Page.args = {
  ...akciiSamara,
  type: 'page',
};

export const Mobile = Template.bind({});
Mobile.args = Banner.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Banner.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Banner.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
