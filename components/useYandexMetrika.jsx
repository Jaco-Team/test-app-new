import { useCallback } from 'react';

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
function useYandexMetrika(city, eventName, goalName, params = {}) {
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

export default useYandexMetrika;