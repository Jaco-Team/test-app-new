import { AkciiPagePC } from './AkciiPagePC';
import * as HeaderPC from '../HeaderPC/HeaderPC.stories';
import * as BannerFullPC from '../BannerFullPC/BannerFullPC.stories';
import * as FooterPC from '../FooterPC/FooterPC.stories';

export default {
  title: 'Акции / Страница Акции',
  component: AkciiPagePC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    actia: {
      type: 'object',
      description: 'Данные для акции на ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
};

const Template = (args) => <AkciiPagePC {...args} />;
export const Default = Template.bind({});
export const ArrowUp = Template.bind({});
export const Cookie = Template.bind({});

Default.args = {
  header: HeaderPC.Default.args,
  actia: BannerFullPC.Page.args,
  footer: FooterPC.Default.args,
};

ArrowUp.args = {
  header: HeaderPC.Default.args,
  actia: BannerFullPC.Page.args,
  footer: { ...FooterPC.Default.args, arrow: true },
};

Cookie.args = {
  header: HeaderPC.Default.args,
  actia: BannerFullPC.Page.args,
  footer: { ...FooterPC.Default.args, cookie: false },
};
