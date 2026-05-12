import type { Meta, StoryObj } from '@storybook/react';

import { BreadСrumbsPC } from './BreadСrumbsPC';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
const meta = {
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
      control: 'object',
      description: 'Данные для списка ссылок',
    },
  },
} satisfies Meta<typeof BreadСrumbsPC>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
  args: {
    activePage: ' ',
    list: listDocs,
    title: 'Документы',
  },
};

export const Active: Story = {
  args: {
    activePage: 'publichnaya-oferta',
    list: listDocs,
    title: 'Документы',
  },
};

export const Profile: Story = {
  args: {
    activePage: '',
    list: listProfile,
    title: 'Личный кабинет',
  },
};

export const About: Story = {
  args: {
    activePage: 'about',
    list: listAbout,
    title: 'О Компании',
  },
};

export const Mobile: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Mobile,
};

export const Tablet: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Tablet,
};

export const Desktop: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Desktop,
};
