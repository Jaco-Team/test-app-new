import { BannerPCImg } from './BannerPCImg';

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
