import { ConfirmForm } from './ConfirmForm';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Оформление заказа / Подтверждение десктоп',
  component: ConfirmForm,
  tags: ['autodocs'],
  argTypes: {
    city: {
      type: 'string',
      description: 'Город доставки',
    },
    address: {
      type: 'string',
      description: 'Адрес доставки',
    },
    data: {
      type: 'string',
      description: 'Дата доставки',
    },
    time: {
      type: 'string',
      description: 'Время доставки',
    },
    items: {
      type: 'array',
      description: 'Товары в корзине',
    },
    itemsCount: {
      type: 'string',
      description: 'Количество позиций товара',
    },
    allPrice: {
      type: 'string',
      description: 'Общая сумма заказа',
    },
    promo: {
      type: 'string',
      description: 'Промик',
    },
    sdacha: {
      type: 'string',
      description: 'Сдача',
    },
  },
};

const items = [
  {
    name: 'Мадейра сет',
    count: 1,
    one_price: '949',
  },
  {
    name: 'Вулкан сет',
    count: 1,
    one_price: '1045',
  },
  {
    name: 'Морской сет',
    count: 1,
    one_price: '1069',
  },
  {
    name: 'Сицилия сет',
    count: 1,
    one_price: '1239',
  },
  {
    name: 'Ямайка сет',
    count: 1,
    one_price: '1355',
  },
  {
    count: 1,
    one_price: '401',
    name: 'Ветчина и сыр',
  },
  {
    count: 1,
    one_price: '535',
    name: 'Гавайская',
  },
  {
    count: 1,
    one_price: '1775',
    name: 'Мадагаскар сет',
  },
];

const Template = (args) => <ConfirmForm {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});

Default.args = {
  city: 'Тольятти',
  address: 'улица Голосова, 87, кв 22',
  data: '19 июня',
  time: '10:30 - 11:00',
  items,
  itemsCount: '10',
  allPrice: '8389',
  promo: '',
  sdacha: '',
};

Active.args = {
  city: 'Тольятти',
  address: 'улица Голосова, 87, кв 22',
  data: '19 июня',
  time: '10:30 - 11:00',
  items,
  itemsCount: '10',
  allPrice: '8389',
  promo: 'КОКОДЖАМБО',
  sdacha: '5000',
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
