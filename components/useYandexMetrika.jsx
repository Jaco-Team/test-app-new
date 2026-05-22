import { reachGoal, vkTmrReachGoal } from '@/utils/metrika';

function useYandexMetrika(city) {
  const trackEvent = (event, params = {}) => {
    switch (event) {
      // открытие карточки товара
      case 'open_item': {
        reachGoal('open_item', { tovar: params.productId });

        if (city === 'samara') {
          vkTmrReachGoal('product', {
            city,
            value: params?.price ?? 0,
            params: { product_id: params.item_id },
          });
        }

        try {
          // roistat.event.send('open_item');
        } catch (e) {
          console.log(e);
        }

        break;
      }

      // перешел в корзину
      case 'open_card': {
        reachGoal('open_card');

        if (city === 'samara') {
          vkTmrReachGoal('zakaz_on', { city });
        }

        try {
          // roistat.event.send('open_card');
        } catch (e) {
          console.log(e);
        }

        break;
      }

      // подтверждение корзины, переход к оплате
      case 'cart_confirm': {
        reachGoal('confirm_card');

        if (city === 'samara') {
          vkTmrReachGoal('zakaz_off', { city });
        }

        try {
          // roistat.event.send('confirm_card');
        } catch (e) {
          console.log(e);
        }

        break;
      }

      // успешная онлайн оплата
      case 'true_pay_online_order': {
        if (city === 'samara') {
          vkTmrReachGoal('zakaz_oplata', {
            city,
            value: params?.price ?? 0,
          });
        }

        if (city === 'togliatti') {
          vkTmrReachGoal('zakaz_oplata', { city });
        }

        break;
      }

      // добавление товара в корзину
      case 'add_item': {
        if (city === 'samara') {
          vkTmrReachGoal('korzina', {
            city,
            value: params?.price ?? 0,
            params: { product_id: params.item_id },
          });
        }

        if (city === 'togliatti') {
          vkTmrReachGoal('korzina', { city });
        }

        break;
      }

      default:
        break;
    }
  };

  return trackEvent;
}

export default useYandexMetrika;
