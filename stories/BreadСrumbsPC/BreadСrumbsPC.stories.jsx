import { BreadСrumbsPC } from './BreadСrumbsPC';

export default {
  title: 'Элементы / BreadСrumbs',
  component: BreadСrumbsPC,
  tags: ['autodocs'],
  argTypes: {
    activePage: {
      type: 'string',
      description: 'Активная страница сайта',
    },
    title: {
      type: 'string',
      description: 'Заголовок списка',
    },
    list: {
      type: 'array',
      description: 'Данные для списка ссылок',
    },
  },
};

const listDocs = [
  {
    link: 'publichnaya-oferta',
    text: 'Публичная оферта',
  },
  {
    link: 'company-details',
    text: 'Реквизиты',
  },
  {
    link: 'politika-konfidencialnosti',
    text: 'Политика конфиденциальности',
  },
  {
    link: 'instpayorders',
    text: 'Правила оплаты',
  },
  {
    link: 'legal',
    text: 'Согласие на обработку персональных данных',
  },
  {
    link: '',
    text: 'Калорийность, состав, БЖУ',
  },
];

const listProfile = [
  {
    link: 'zakazy',
    text: 'История заказов',
  },
  {
    link: 'profile',
    text: 'Личные данные',
  },
  {
    link: 'promokody',
    text: 'Мои промокоды',
  },
];

const listAbout = [
  {
    text: 'Превосходные блюда',
  },
  {
    text: 'Доступные цены',
  },
  {
    text: 'Как выглядит кафе',
  },
  {
    text: 'Время приготовления заказа',
  },
  {
    text: 'Заряжаем оптимизмом!',
  },
  {
    text: 'Социальная и экологическая ответственность',
  },
  {
    text: 'Обратная связь',
  },
  {
    text: 'Сотрудничество',
  },
];

const Template = (args) => <BreadСrumbsPC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Profile = Template.bind({});
export const About = Template.bind({});

Default.args = {
  activePage: ' ',
  list: listDocs,
  title: 'Документы',
};

Active.args = {
  activePage: 'publichnaya-oferta',
  list: listDocs,
  title: 'Документы',
};

Profile.args = {
  activePage: '',
  list: listProfile,
  title: 'Личный кабинет',
};

About.args = {
  activePage: 'about',
  list: listAbout,
  title: 'О Компании',
};
