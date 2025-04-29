//import { useCallback } from 'react';
import React, { useState, useCallback, useMemo } from 'react';

/**
 * Кастомный хук для отправки событий в Яндекс Метрику
 * @param {number} counterId - номер счётчика
 * @param {string} eventName - название события, например, 'reachGoal'
 * @param {string} goalName - имя цели (или другое значение)
 * @param {object} params - объект с дополнительными параметрами
 * @returns {function} - функция для отправки события
 */

//ym(get().ya_metrik[city], 'reachGoal', 'call_from_site', ym_data);
/**
 * Кастомный хук для отправки событий в Яндекс Метрику
 * @param {string} city - Город (напр. 'moscow', 'spb', ...)
 * @param {string} eventName - Название события (например, 'reachGoal')
 * @param {string} goalName - Имя цели (или другое значение)
 * @param {object} params - Объект с дополнительными параметрами
 * @returns {function} - Функция для отправки события
 */
function useYandexMetrika_(city, eventName, goalName, params = {}) {
  // Функция для определения ID счётчика по городу
  const getCounterIdByCity = (cityName) => {
    switch (cityName.toLowerCase()) {
      case 'togliatti':
        return 47085879;
      case 'samara':
        return 47085879;
      // Добавьте другие города или логику
      default:
        return 0; // "город по умолчанию" или 0
    }
  };

  const sendMetrikaEvent = useCallback(() => {
    // Получаем ID счётчика по городу
    const counterId = getCounterIdByCity(city);

    // Проверяем, что мы в браузере и объект ym доступен
    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
      window.ym(counterId, eventName, goalName, params);
    } else {
      console.warn('Яндекс Метрика не инициализирована или недоступна.');
    }
  }, [city, eventName, goalName, params]);

  return sendMetrikaEvent;
}

//export default useYandexMetrika;



function useYandexMetrika(city) {
  const getCounterIdByCity = (cityName) => {
    switch (cityName.toLowerCase()) {
      case 'togliatti':
        return 47085879;
      case 'samara':
        return 100325084;
      // Добавьте другие города или логику
      default:
        return 0; // "город по умолчанию" или 0
    }
  };

  // Получаем номер счётчика по городу (или фиксированный, если не нужен динамический)
  const counterId = getCounterIdByCity(city);

  const trackEvent = (event, params = {}) => {
    // Пример, когда "Purchase" требует особых данных
    switch (event) {
      //открытие карточки товара
      case 'open_item':
        // Допустим, хотим для Metрики отдельно "purchaseGoal", а для Pixel — "Purchase"
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            ym(counterId, 'reachGoal', 'open_item', { tovar: params.productId })
          }

          if( city == 'togliatti' ){
            ym(100601350, 'reachGoal', 'open_item', { tovar: params.productId })
          }
        }
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            //console.log('Отправка события в Яндекс Метрика для события:', { type: 'reachGoal', id: 3621394, value: params?.price ?? 0, goal: 'product', params: { product_id: params.item_id}});
            _tmr.push({ type: 'reachGoal', id: 3621394, value: params?.price ?? 0, goal: 'product', params: { product_id: params.item_id}});;
          }
        }
        break;
        
      //перешел в корзину
      case 'open_cart':
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            ym(counterId, 'reachGoal', 'open_card'); 
          }

          if( city == 'togliatti' ){
            ym(100601350, 'reachGoal', 'open_card'); 
          }
        }
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            _tmr.push({ type: 'reachGoal', id: 3621394, goal: 'zakaz_on'});
          }
        }
        break;

      //подтверждение корзины, переход к оплате
      case 'cart_confirm':
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            ym(counterId, 'reachGoal', 'confirm_card'); 
          }
          if( city == 'togliatti' ){
            ym(100601350, 'reachGoal', 'confirm_card'); 
          }
        }
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            _tmr.push({ type: 'reachGoal', id: 3621394, goal: 'zakaz_off'});
          }
        }
        break;

      //успешная онлайн оплата
      case 'true_pay_online_order':
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            //ym(counterId,'reachGoal','pay_order')
          }
        }
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            _tmr.push({ type: 'reachGoal', id: 3621394, value: params?.price ?? 0, goal: 'zakaz_oplata'});
          }
        }
        break;

      //добавление товара в корзину
      case 'add_item':
        if (typeof window.ym === 'function') {
          // window.ym(counterId, 'reachGoal', 'addToCart', {
          //   ...params,
          //   city
          // });
        }
        if (typeof window !== 'undefined') {
          if( city == 'samara' ){
            //console.log('Отправка события в Яндекс Метрика для события:', { type: 'reachGoal', id: 3621394, value: params?.price ?? 0, goal: 'korzina', params: { product_id: params.item_id }});
            _tmr.push({ type: 'reachGoal', id: 3621394, value: params?.price ?? 0, goal: 'korzina', params: { product_id: params.item_id }});
          }
        }
        break;
    }
  };

  return trackEvent;
}

export default useYandexMetrika;