import { DataTimePicker } from './DataTimePicker';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Оформление заказа / Дата и время',
  component: DataTimePicker,
  tags: ['autodocs'],
  argTypes: {
    slidesTime: {
      type: 'object',
      description: 'Возможное время для заказа',
    },
    slidesDate: {
      type: 'object',
      description: 'Возможные даты для заказа',
    },
  },
};

let slidesTime = [
  {
    name: '14:00 - 14:30',
    id: '14:00',
  },
  {
    name: '14:15 - 14:45',
    id: '14:15',
  },
  {
    name: '14:30 - 15:00',
    id: '14:30',
  },
  {
    name: '14:45 - 15:15',
    id: '14:45',
  },
  {
    name: '15:00 - 15:30',
    id: '15:00',
  },
  {
    name: '15:15 - 15:45',
    id: '15:15',
  },
  {
    name: '15:30 - 16:00',
    id: '15:30',
  },
  {
    name: '15:45 - 16:15',
    id: '15:45',
  },
  {
    name: '16:15 - 16:45',
    id: '16:15',
  },
  {
    name: '16:30 - 17:00',
    id: '16:30',
  },
  {
    name: '16:45 - 17:15',
    id: '16:45',
  },
  {
    name: '17:00 - 17:30',
    id: '17:00',
  },
  {
    name: '17:15 - 17:45',
    id: '17:15',
  },
  {
    name: '17:30 - 18:00',
    id: '17:30',
  },
  {
    name: '17:45 - 18:15',
    id: '17:45',
  },
  {
    name: '18:00 - 18:30',
    id: '18:00',
  },
  {
    name: '18:15 - 18:45',
    id: '18:15',
  },
  {
    name: '18:30 - 19:00',
    id: '18:30',
  },
  {
    name: '18:45 - 19:15',
    id: '18:45',
  },
  {
    name: '19:00 - 19:30',
    id: '19:00',
  },
  {
    name: '19:15 - 19:45',
    id: '19:15',
  },
  {
    name: '19:30 - 20:00',
    id: '19:30',
  },
  {
    name: '19:45 - 20:15',
    id: '19:45',
  },
  {
    name: '20:00 - 20:30',
    id: '20:00',
  },
  {
    name: '20:15 - 20:45',
    id: '20:15',
  },
  {
    name: '20:30 - 21:00',
    id: '20:30',
  },
  {
    name: '20:45 - 21:15',
    id: '20:45',
  },
];

const slidesDate = [
  {
    date: '2024-05-05',
    text: 'Сегодня',
    dow: 'Вс',
  },
  {
    date: '2024-05-06',
    text: 'Завтра',
    dow: 'Пн',
  },
  {
    date: '2024-05-07',
    text: '07 мая',
    dow: 'Вт',
  },
  {
    date: '2024-05-08',
    text: '08 мая',
    dow: 'Ср',
  },
  {
    date: '2024-05-09',
    text: '09 мая',
    dow: 'Чт',
  },
  {
    date: '2024-05-10',
    text: '10 мая',
    dow: 'Пт',
  },
  {
    date: '2024-05-11',
    text: '11 мая',
    dow: 'Сб',
  },
  {
    date: '2024-05-12',
    text: '12 мая',
    dow: 'Вс',
  },
  {
    date: '2024-05-13',
    text: '13 мая',
    dow: 'Пн',
  },
  {
    date: '2024-05-14',
    text: '14 мая',
    dow: 'Вт',
  },
  {
    date: '2024-05-15',
    text: '15 мая',
    dow: 'Ср',
  },
  {
    date: '2024-05-16',
    text: '16 мая',
    dow: 'Чт',
  },
  {
    date: '2024-05-17',
    text: '17 мая',
    dow: 'Пт',
  },
  {
    date: '2024-05-18',
    text: '18 мая',
    dow: 'Сб',
  },
  {
    date: '2024-05-19',
    text: '19 мая',
    dow: 'Вс',
  },
  {
    date: '2024-05-20',
    text: '20 мая',
    dow: 'Пн',
  },
];

const Template = (args) => <DataTimePicker {...args} />;
export const Default = Template.bind({});
export const Time = Template.bind({});

Default.args = {
  slidesTime,
  slidesDate,
};

Time.args = {
  slidesDate,
  slidesTime: slidesTime.slice(0, 3),
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
