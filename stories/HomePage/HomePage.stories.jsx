import { HomePage } from './HomePage';

import * as NavBarPC from '../navBarPC/NavBarPC.stories';
import * as BannerPC from '../BannerPC/BannerPC.stories';
import * as BoxItemHomePC from '../BoxItemHomePC/BoxItemHomePC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

export default {
  title: 'HomePage',
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
    banner: {
      type: 'object',
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

Default.args = {
  header: NavBarPC.Default.args,
  banner: BannerPC.Default.args,
  container: BoxItemHomePC.Default.args,
  footer: FooterPC.Default.args,
};
