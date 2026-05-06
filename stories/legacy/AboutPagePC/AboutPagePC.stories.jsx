import { AboutPagePC } from './AboutPagePC';
import * as HeaderPC from '../HeaderPC/HeaderPC.stories';
import * as BreadСrumbsPC from '../BreadСrumbsPC/BreadСrumbsPC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

export default {
  title: 'Страница О компании / О компании',
  component: AboutPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    data: {
      type: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <AboutPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
// export const Cookie = Template.bind({});

Default.args = {
  header: HeaderPC.Default.args,
  data: BreadСrumbsPC.About.args,
  footer: FooterPC.Default.args,
};

ArrowUp.args = {
  header: HeaderPC.Default.args,
  data: BreadСrumbsPC.About.args,
  footer: { ...FooterPC.Default.args, arrow: true },
};

// Cookie.args = {
//   header: HeaderPC.Default.args,
//   actia: BannerFullPC.Page.args,
//   footer: { ...FooterPC.Default.args, cookie: false },
// };
