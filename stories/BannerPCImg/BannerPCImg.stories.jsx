import { BannerPCImg } from './BannerPCImg';

export default {
  title: 'Акции / Изображение',
  component: BannerPCImg,
  tags: ['autodocs'],
  argTypes: {
    
  },
};

const Template = (args) => <BannerPCImg {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
  img: "https://storage.yandexcloud.net/site-home-img/Kombo1_Tlt_3700x1000.jpg",
};