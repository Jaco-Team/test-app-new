import { CartPCPromoText } from './CartPCPromoText';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Корзина / Описание промокода',
  component: CartPCPromoText,
  tags: ['autodocs'],
  argTypes: {
    status_promo: {
      type: 'boolean',
      description: 'Статус промокода',
    },
    text: {
      type: 'string',
      description: 'Описание промокода',
    },
  },
};

const Template = (args) => <CartPCPromoText {...args} />;
export const Promo_True = Template.bind({});
export const Promo_False = Template.bind({});

Promo_True.args = {
  status_promo: true,
  text: 'позиции Ветчина и сыр 1шт. за 381руб., Мадагаскар сет 1шт. за 1632руб., Гавайская 1шт. за 432руб.',
};

Promo_False.args = {
  status_promo: false,
  text: 'Данный промокод не найден или уже активирован',
};

export const Mobile = Template.bind({});
Mobile.args = Promo_True.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Promo_True.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Promo_True.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
