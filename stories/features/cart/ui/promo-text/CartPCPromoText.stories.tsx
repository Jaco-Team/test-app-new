import { CartPCPromoText } from './CartPCPromoText';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Cart / ПК / Корзина / Promo_Desc',
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Promo_True.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Promo_True.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
