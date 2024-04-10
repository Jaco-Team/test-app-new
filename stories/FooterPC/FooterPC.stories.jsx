import { FooterPC } from './FooterPC';

export default {
  title: 'Footer / Footer',
  component: FooterPC,
  tags: ['autodocs'],
  argTypes: {
    cookie: {
      type: 'boolean',
      description: 'Активность cookie',
    },
    arrow: {
      type: 'boolean',
      description: 'Активность стрелки навигации',
    },
    cityName: {
      type: 'string',
      description: 'Ссылка на выбранный город',
    },
    links: {
      type: 'object',
      description: 'Ссылки для перехода на другие страницы',
    }
  },
  parameters: {
    layout: 'fullscreen',
  },
};

const links = {
  "link_vk": "https://vk.com/jacofood_tlt",
  "link_inst": "",
  "link_fb": "",
  "link_ok": "https://ok.ru/group/54671948841166",
  "link_tg": "https://t.me/jacofood",
  "link_allergens": "https://storage.yandexcloud.net/site-other-data/jaco_2024_03_23.pdf"
}

const Template = (args) => <FooterPC {...args} />;
export const Default = Template.bind({});
export const Cookie = Template.bind({});
export const Arrow = Template.bind({});

Default.args = {
  cookie: true,
  arrow: false,
  cityName: 'samara',
  links,
};

Cookie.args = {
  cookie: false,
  arrow: false,
  cityName: 'samara',
  links
};

Arrow.args = {
  cookie: true,
  arrow: true,
  cityName: 'samara',
  links
};
