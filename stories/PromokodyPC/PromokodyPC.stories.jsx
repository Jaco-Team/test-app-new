import { PromokodyPC } from './PromokodyPC';

export default {
  title: 'Профиль / Промокоды / Промокод',
  component: PromokodyPC,
  tags: ['autodocs'],
  argTypes: {
    promokody: {
      type: 'object',
      description: 'Данные промокода',
    },
  },
};

const promokody = {
  id: '1560546',
  promo_name: 'ЦЮ7ЮЮТШ4',
  date_end: '2024-06-03',
  promo_text: 'бесплатный ролл Жако. С днём рождения! ;)',
  city_id: '0',
  promo_action: '2',
  promo_action_text: 'Блюдо в подарок',
  diff_days: 16,
  diff_days_text: '16 дней',
  date_end_text: '03 Июня 2024',
};

const Template = (args) => <PromokodyPC {...args} />;
export const Default = Template.bind({});

Default.args = {
  promokody,
};
