import { HomePage } from './HomePage';

import * as HeaderPC from '../HeaderPC/HeaderPC.stories';
import * as BannerListPC from '../BannerListPC/BannerListPC.stories';
import * as BoxItemHomePC from '../BoxItemHomePC/BoxItemHomePC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

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
  header: HeaderPC.Default.args,
  banners: BannerListPC.TwoImg.args,
  container: BoxItemHomePC.Default.args,
  footer: FooterPC.Default.args,
};

Cookie.args = {
  header: HeaderPC.Default.args,
  banners: BannerListPC.TwoImg.args,
  container: BoxItemHomePC.Default.args,
  footer: {...FooterPC.Default.args, cookie: false}
};

ArrowUp.args = {
  header: HeaderPC.Default.args,
  banners: BannerListPC.TwoImg.args,
  container: BoxItemHomePC.Default.args,
  footer: {...FooterPC.Default.args, arrow: true}
};