import { CartPCPromoText } from './CartPCPromoText';

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
