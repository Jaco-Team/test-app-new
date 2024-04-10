import { BannerListPC } from './BannerListPC';

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
