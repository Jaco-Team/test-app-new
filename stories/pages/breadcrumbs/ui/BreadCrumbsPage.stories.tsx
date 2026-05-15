import BreadCrumbsPage from './BreadCrumbsPage';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

export default {
  title: 'Страницы / ХлебныеКрошки',
  component: BreadCrumbsPage,
  tags: ['autodocs'],
  argTypes: {
    links: {
      type: 'array',
      description: 'Массив ссылок для отображения',
    },
  },
};

const Template = (args) => <BreadCrumbsPage {...args} />;

export const Default = Template.bind({});

Default.args = {
  links: [
    {
      text: 'О компании',
      href: '/about',
    },
    {
      text: 'Вакансии',
      href: '/vacancies',
    },
    {
      text: 'Публичная оферта',
      href: '/offer',
    },
    {
      text: 'Политика конфиденциальности',
      href: '/privacy',
    },
    {
      text: 'Правила оплаты',
      href: '/payment-rules',
    },
    {
      text: 'Согласие на обработку персональных данных',
      href: '/personal-data',
    },
    {
      text: 'Политика в отношении обработки метрических данных',
      href: '/metrics-policy',
    },
    {
      text: 'Калорийность, состав, БЖУ',
      href: '/nutrition',
    },
    {
      text: 'Памятка по сохранению здоровья',
      href: '/health',
    },
  ],
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
