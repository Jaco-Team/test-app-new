import {
  getLocalStorageItem,
  getLocalStorageJson,
  setLocalStorageItem,
} from '@/utils/browserStorage';

export const SAMARA_ENTRANCE_WORKS_MODAL_KEY =
  'samara_entrance_works_modal_2026';
export const SAMARA_ENTRANCE_WORKS_PERIOD_START = '2026-05-22';
export const SAMARA_ENTRANCE_WORKS_PERIOD_END = '2026-05-28';
export const SAMARA_ENTRANCE_WORKS_PHOTO =
  '/images/samara-kuybysheva-entrance.jpg';
export const SAMARA_ENTRANCE_WORKS_PHOTO_WIDTH = 880;
export const SAMARA_ENTRANCE_WORKS_PHOTO_HEIGHT = 500;

export const SAMARA_ENTRANCE_WORKS_MODAL_TITLE = 'Важная информация';
export const SAMARA_ENTRANCE_WORKS_MODAL_TEXT =
  '27 и 28 мая зал на Куйбышева и самовывоз временно недоступны — на входной зоне ведутся строительные работы. Доставка и остальные кафе работают в обычном режиме. Приносим извинения за неудобства.';

export function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isSamaraCityLink(link) {
  return String(link || '').toLowerCase() === 'samara';
}

export function resolveSamaraCityLink(cityProp) {
  if (isSamaraCityLink(cityProp)) return 'samara';

  const stored = getLocalStorageJson('setCity');
  if (stored?.link && isSamaraCityLink(stored.link)) return stored.link;

  return null;
}

export function isWithinSamaraEntranceWorksPeriod(
  dateStr = getLocalDateString()
) {
  return (
    dateStr >= SAMARA_ENTRANCE_WORKS_PERIOD_START &&
    dateStr <= SAMARA_ENTRANCE_WORKS_PERIOD_END
  );
}

export function shouldShowSamaraEntranceWorksModal(cityProp) {
  if (typeof window === 'undefined') return false;
  if (!resolveSamaraCityLink(cityProp)) return false;
  if (!isWithinSamaraEntranceWorksPeriod()) return false;

  const today = getLocalDateString();
  const lastShown = getLocalStorageItem(SAMARA_ENTRANCE_WORKS_MODAL_KEY);

  return lastShown !== today;
}

export function markSamaraEntranceWorksModalShown() {
  setLocalStorageItem(SAMARA_ENTRANCE_WORKS_MODAL_KEY, getLocalDateString());
}
