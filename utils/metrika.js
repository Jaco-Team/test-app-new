import { useCitiesStore } from '@/components/store.js';

const MAIN_COUNTER_ID = 47085879;
const PURCHASE_STORAGE_PREFIX = 'ym_purchase_';
const PURCHASE_PENDING_TTL_MS = 30 * 1000;

function getCityCounterId(city) {
  if (!city) return null;
  const c = String(city).toLowerCase();

  if (c === 'samara') return 100325084;
  if (c === 'togliatti') return 100601350;

  return null;
}

function getPurchaseStorageKey(orderId) {
  return `${PURCHASE_STORAGE_PREFIX}${orderId}`;
}

function readPurchaseState(orderId) {
  if (typeof window === 'undefined' || !orderId) return null;

  try {
    const raw = window.localStorage.getItem(getPurchaseStorageKey(orderId));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writePurchaseState(orderId, status) {
  if (typeof window === 'undefined' || !orderId) return;

  try {
    window.localStorage.setItem(
      getPurchaseStorageKey(orderId),
      JSON.stringify({ status, ts: Date.now() })
    );
  } catch (e) {
    console.warn('YM purchase storage error:', e);
  }
}

function shouldSkipPurchase(orderId) {
  if (!orderId) return false;

  const state = readPurchaseState(orderId);
  if (!state?.status) return false;

  if (state.status === 'sent') return true;

  if (state.status === 'pending') {
    const age = Date.now() - Number(state.ts || 0);
    return age < PURCHASE_PENDING_TTL_MS;
  }

  return false;
}

function getDataLayer() {
  if (typeof window === 'undefined') return null;
  if (window.ymDataLayer && typeof window.ymDataLayer.push === 'function') return window.ymDataLayer;
  if (window.dataLayer && typeof window.dataLayer.push === 'function') return window.dataLayer;
  return null;
}

/**
 * Шлёт цель в основной счётчик (всегда) + в городской (если определён город)
 */
export function reachGoal(goal, params) {
  if (typeof window === 'undefined') return;
  if (typeof window.ym !== 'function') return;

  try {
    window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, params);

    const city = useCitiesStore.getState().thisCity;
    const cityCounterId = getCityCounterId(city);

    if (cityCounterId) {
      window.ym(cityCounterId, 'reachGoal', goal, params);
    }
  } catch (e) {
    console.warn('YM reachGoal error:', e);
  }
}

function isObj(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// 2) РАЗДЕЛЬНЫЙ: разные params для основного и городского
export function reachGoalSplit(goal, paramsMain, paramsCity) {
  if (typeof window === 'undefined') return;
  if (typeof window.ym !== 'function') return;

  const safeMain = isObj(paramsMain) ? paramsMain : {};
  const safeCity = isObj(paramsCity) ? paramsCity : safeMain;

  try {
    window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, safeMain);

    const city = useCitiesStore.getState().thisCity; // 'samara' | 'togliatti'
    const cityCounterId = getCityCounterId(city);

    if (cityCounterId) {
      window.ym(cityCounterId, 'reachGoal', goal, safeCity);
    }
  } catch (e) {
    console.warn('YM reachGoalSplit error:', e);
  }
}

// новое событие "Покупка" только в основной счетчик 47085879
export function reachGoalMain(goal, params, cb) {
  if (typeof window === 'undefined') return;
  if (typeof window.ym !== 'function') return;

  try {
    if (typeof cb === 'function') {
      window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, params, cb);
    } else {
      window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, params);
    }
  } catch (e) {
    console.warn('YM reachGoalMain error:', e);
  }
}

export function trackPurchase({ orderId, goalParams, ecommerceData }) {
  if (typeof window === 'undefined') return false;

  if (orderId && shouldSkipPurchase(orderId)) {
    return false;
  }

  if (orderId) {
    writePurchaseState(orderId, 'pending');
  }

  let finalized = false;
  const finalize = () => {
    if (finalized) return;
    finalized = true;
    if (orderId) {
      writePurchaseState(orderId, 'sent');
    }
  };

  try {
    if (typeof window.ym === 'function') {
      window.ym(MAIN_COUNTER_ID, 'reachGoal', 'purchase', goalParams, finalize);

      const city = useCitiesStore.getState().thisCity;
      const cityCounterId = getCityCounterId(city);
      if (cityCounterId) {
        window.ym(cityCounterId, 'reachGoal', 'purchase', goalParams);
      }
    }

    const dataLayer = getDataLayer();
    if (dataLayer && ecommerceData) {
      dataLayer.push({ ecommerce: ecommerceData });
    }

    // Fallback: в некоторых браузерах callback Метрики приходит нестабильно.
    window.setTimeout(finalize, 1500);
  } catch (e) {
    console.warn('YM trackPurchase error:', e);
  }

  return true;
}

// Привязка внутреннего ID пользователя к сессии Метрики.
// Вызывать только когда пользователь авторизован и id реально известен.
// Нужно вызвать для основного и городского счётчика, чтобы события в отчётах связывались с одним id.
export function setUserIdAll(userId) {
  if (typeof window === 'undefined') return;
  if (typeof window.ym !== 'function') return;

  const uid = userId === null || userId === undefined ? '' : String(userId).trim();
  if (!uid) return;

  try {
    window.ym(MAIN_COUNTER_ID, 'setUserID', uid);

    const city = useCitiesStore.getState().thisCity;
    const cityCounterId = getCityCounterId(city);
    if (cityCounterId) {
      window.ym(cityCounterId, 'setUserID', uid);
    }

    // лог для проверки в консоли
    //console.log('[YM] setUserID sent:', uid, 'main:', MAIN_COUNTER_ID, 'city:', cityCounterId || '-');
  } catch (e) {
    console.warn('YM setUserID error:', e);
  }
}
