import { BannerPC } from './BannerPC';

export default {
  title: 'BannerPC',
  component: BannerPC,
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
  },
};

const Template = (args) => <BannerPC {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
  img: 'Kombo1_Tlt',
};
