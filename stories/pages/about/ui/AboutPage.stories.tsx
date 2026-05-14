import { AboutPage } from './AboutPage';
import * as BreadСrumbsPC from '@stories/shared/ui/breadcrumbs/BreadСrumbsPC.stories';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

export default {
  title: 'Страницы / О компании',
  component: AboutPage,
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
      description: 'Данные для оглавления страницы',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
    cityName: {
      type: 'string',
      description: 'Город в URL (для мобильной ссылки «назад»)',
    },
    viewport: {
      control: 'inline-radio',
      options: ['mobile', 'tablet', 'desktop'],
      description: 'Вариант вёрстки (как на странице акций)',
    },
  },
};

const Template = (args) => <AboutPage {...args} />;

export const Default = Template.bind({});
export const ArrowUp = Template.bind({});

Default.args = {
  data: BreadСrumbsPC.About.args,
  cityName: 'togliatti',
  viewport: 'desktop',
};

ArrowUp.args = {
  data: BreadСrumbsPC.About.args,
  cityName: 'togliatti',
  viewport: 'desktop',
};

export const Mobile = Template.bind({});
Mobile.args = {
  ...Default.args,
  viewport: 'mobile',
};
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = {
  ...Default.args,
  viewport: 'tablet',
};
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = {
  ...Default.args,
  viewport: 'desktop',
};
Desktop.globals = responsiveStoryGlobals.Desktop;
