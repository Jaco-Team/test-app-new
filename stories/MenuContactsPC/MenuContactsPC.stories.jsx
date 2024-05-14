import { MenuContactsPC } from './MenuContactsPC';

export default {
  title: 'Страница Контакты / Меню',
  component: MenuContactsPC,
  tags: ['autodocs'],
  argTypes: {
    city: {
      type: 'string',
      description: 'Название города',
    },
    phone: {
      type: 'string',
      description: 'Номер телефона в выбранном городе',
    },
    points: {
      type: 'array',
      description: 'Все точки выбранного города',
    },
    disable: {
      type: 'boolean',
      description: 'Показать зону доставки',
    },
    active: {
      type: 'boolean',
      description: 'Активный адрес точки',
    },
  },
};

const points = [
  { addr: 'Ленинградская 47' },
  { addr: 'Ворошилова 12а' },
  { addr: 'Цветной 1' },
  { addr: 'Матросова 32' },
];

const Template = (args) => <MenuContactsPC {...args} />;
export const Default = Template.bind({});
export const Long_title_city = Template.bind({});
export const Active = Template.bind({});
export const Disable = Template.bind({});

Default.args = {
  city: 'тольятти',
  points,
  phone: '8 (8482) 90-30-52',
  disable: true,
  active: false,
};

Long_title_city.args = {
  city: 'Комсомольск-на-Амуре',
  points,
  phone: '8 (4217) 90-30-52',
  disable: true,
  active: false,
};

Active.args = {
  city: 'Самара',
  points,
  phone: '8 (4217) 90-30-52',
  disable: true,
  active: true,
};

Disable.args = {
  city: 'тольятти',
  points,
  phone: '8 (4217) 90-30-52',
  disable: false,
  active: true,
};
