import { isSupportedCity } from '@/utils/cityCart';

// Сохранённый город (кука city) один на все вкладки: страница другого города
// ведёт в сохранённый. Пока города нет, остаёмся там, куда пришли по ссылке.

// Страницы, привязанные к городу заказа: их открывают по ссылке из оплаты или СМС,
// и подменять город в них нельзя.
const CITY_BOUND_PAGES = new Set(['only_pay_page']);
const CITY_BOUND_PARAMS = ['payment_return', 'sbp_return'];

const clean = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

/**
 * Путь той же страницы в сохранённом городе или null, если переходить не нужно:
 * города нет, он тот же, адрес не городской или страница привязана к заказу.
 */
export function savedCityPath(pathname, search, savedCity) {
  const saved = clean(savedCity);
  if (!isSupportedCity(saved)) return null;

  const parts = String(pathname || '')
    .split('/')
    .filter(Boolean);
  const current = clean(parts[0]);
  if (!isSupportedCity(current) || current === saved) return null;
  if (CITY_BOUND_PAGES.has(clean(parts[1]))) return null;

  const params = new URLSearchParams(search || '');
  if (CITY_BOUND_PARAMS.some((name) => params.has(name))) return null;

  parts[0] = saved;
  return `/${parts.join('/')}`;
}

/**
 * Что делать странице города в браузере:
 *   { redirect } — уйти в сохранённый город (его сменили в другой вкладке);
 *   { save: true } — города ещё нет или он совпадает: запомнить город страницы;
 *   {} — страница привязана к заказу, сохранённый город не трогаем.
 */
export function savedCityAction(pageCity, savedCity, location) {
  const saved = clean(savedCity);
  if (!isSupportedCity(saved) || saved === clean(pageCity)) {
    return { save: true };
  }

  const pathname = savedCityPath(location?.pathname, location?.search, saved);
  if (!pathname) return {};
  return {
    redirect: `${pathname}${location?.search || ''}${location?.hash || ''}`,
  };
}
