import { reachGoal } from '@/utils/metrika';

function useYandexMetrika(city) {
  const trackEvent = (event, params = {}) => {
    switch (event) {
      // открытие карточки товара
      case 'open_item': {
        // было: ym(counterId/100601350...) -> стало: через хелпер (47085879 + город)
        reachGoal('open_item', { tovar: params.productId });

        // _tmr оставляем как было (только самара)
        if (typeof window !== 'undefined') {
          if (city === 'samara') {
            _tmr.push({
              type: 'reachGoal',
              id: 3621394,
              value: params?.price ?? 0,
              goal: 'product',
              params: { product_id: params.item_id },
            });
          }
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
        // было: ym(...) только в город -> стало: 47085879 + город
        reachGoal('open_card');

        if (typeof window !== 'undefined') {
          if (city === 'samara') {
            _tmr.push({ type: 'reachGoal', id: 3621394, goal: 'zakaz_on' });
          }
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
        // ВАЖНО: у тебя цель называется confirm_card, это оставляем
        reachGoal('confirm_card');

        if (typeof window !== 'undefined') {
          if (city === 'samara') {
            _tmr.push({ type: 'reachGoal', id: 3621394, goal: 'zakaz_off' });
          }
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
        // ym у тебя тут и раньше был выключен — НЕ трогаем, чтобы не словить дубль с другой логикой оплаты
        if (typeof window !== 'undefined') {
          if (city === 'samara') {
            _tmr.push({
              type: 'reachGoal',
              id: 3621394,
              value: params?.price ?? 0,
              goal: 'zakaz_oplata',
            });
          }
        }
        break;
      }

      // добавление товара в корзину (у тебя это только _tmr, ym не было — оставляем)
      case 'add_item': {
        if (typeof window !== 'undefined') {
          if (city === 'samara') {
            _tmr.push({
              type: 'reachGoal',
              id: 3621394,
              value: params?.price ?? 0,
              goal: 'korzina',
              params: { product_id: params.item_id },
            });
          }
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
