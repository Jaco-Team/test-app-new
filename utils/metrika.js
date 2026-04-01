import { useCitiesStore } from '@/components/store.js';
import { getLocalStorageItem, setLocalStorageItem } from './browserStorage';

const MAIN_COUNTER_ID = 47085879;
const PURCHASE_STORAGE_PREFIX = 'ym_purchase_';
const PURCHASE_PENDING_TTL_MS = 30 * 1000;
const YM_READY_RETRY_DELAY_MS = 250;
const YM_READY_MAX_RETRIES = 40;
const USER_ID_SYNC_DELAY_MS = 400;

function getCityCounterId(city) {
  if (!city) return null;
  const c = String(city).toLowerCase();

  if (c === 'samara') return 100325084;
  if (c === 'togliatti') return 100601350;

  return null;
}

function getActiveCounterIds(cityOverride) {
  const ids = [MAIN_COUNTER_ID];
  const city = cityOverride ?? useCitiesStore.getState().thisCity;
  const cityCounterId = getCityCounterId(city);

  if (cityCounterId && !ids.includes(cityCounterId)) {
    ids.push(cityCounterId);
  }

  return ids;
}

function runWhenYmReady(callback, attempt = 0) {
  if (typeof window === 'undefined') return false;

  if (typeof window.ym === 'function') {
    callback();
    return true;
  }

  if (attempt >= YM_READY_MAX_RETRIES) {
    return false;
  }

  window.setTimeout(() => {
    runWhenYmReady(callback, attempt + 1);
  }, YM_READY_RETRY_DELAY_MS);

  return false;
}

function normalizeMoney(value) {
  if (value === null || value === undefined || value === '') return 0;

  const parsed = Number(String(value).replace(/\s+/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeId(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeUrl(url) {
  if (typeof window === 'undefined') return String(url || '/');

  try {
    return new URL(url || window.location.href, window.location.origin).toString();
  } catch {
    return window.location.href;
  }
}

function getPurchaseStorageKey(orderId) {
  return `${PURCHASE_STORAGE_PREFIX}${orderId}`;
}

function readPurchaseState(orderId) {
  if (typeof window === 'undefined' || !orderId) return null;

  try {
    const raw = getLocalStorageItem(getPurchaseStorageKey(orderId));
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
    setLocalStorageItem(
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

export function hitAll(url, options = {}) {
  if (typeof window === 'undefined') return false;

  const hitUrl = normalizeUrl(url);
  const hitOptions = {
    title: options.title || document.title,
  };

  if (options.referer) {
    hitOptions.referer = options.referer;
  }

  if (isObj(options.params)) {
    hitOptions.params = options.params;
  }

  return runWhenYmReady(() => {
    getActiveCounterIds(options.city).forEach((counterId) => {
      window.ym(counterId, 'hit', hitUrl, hitOptions);
    });
  });
}

/**
 * Шлёт цель в основной счётчик (всегда) + в городской (если определён город)
 */
export function reachGoal(goal, params) {
  if (typeof window === 'undefined') return;

  try {
    runWhenYmReady(() => {
      getActiveCounterIds().forEach((counterId) => {
        window.ym(counterId, 'reachGoal', goal, params);
      });
    });
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

  const safeMain = isObj(paramsMain) ? paramsMain : {};
  const safeCity = isObj(paramsCity) ? paramsCity : safeMain;

  try {
    runWhenYmReady(() => {
      window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, safeMain);

      const city = useCitiesStore.getState().thisCity;
      const cityCounterId = getCityCounterId(city);

      if (cityCounterId) {
        window.ym(cityCounterId, 'reachGoal', goal, safeCity);
      }
    });
  } catch (e) {
    console.warn('YM reachGoalSplit error:', e);
  }
}

// новое событие "Покупка" только в основной счетчик 47085879
export function reachGoalMain(goal, params, cb) {
  if (typeof window === 'undefined') return;

  try {
    runWhenYmReady(() => {
      if (typeof cb === 'function') {
        window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, params, cb);
      } else {
        window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, params);
      }
    });
  } catch (e) {
    console.warn('YM reachGoalMain error:', e);
  }
}

export function buildPurchasePayload({ order, items, goalParams = {} }) {
  const orderId = normalizeId(order?.order_id ?? order?.id);
  const revenue = normalizeMoney(order?.sum_order ?? order?.revenue);
  const coupon = order?.promo_name ? String(order.promo_name).trim() : '';

  const products = (Array.isArray(items) ? items : []).map((item, index) => ({
    id: normalizeId(item?.id ?? index + 1),
    name: item?.name ? String(item.name) : '',
    price: normalizeMoney(item?.price),
    category: item?.category ? String(item.category) : '',
    quantity: normalizeMoney(item?.quantity ?? item?.count),
    position: index,
  }));

  return {
    orderId: orderId || null,
    goalParams: {
      ...(isObj(goalParams) ? goalParams : {}),
      ...(orderId ? { id: orderId, order_id: orderId } : {}),
      revenue,
      ...(coupon ? { coupon } : {}),
    },
    ecommerceData: {
      currencyCode: 'RUB',
      purchase: {
        actionField: {
          ...(orderId ? { id: orderId } : {}),
          ...(coupon ? { coupon } : {}),
          revenue,
        },
        products,
      },
    },
  };
}

export function trackPurchase({ orderId, goalParams, ecommerceData }) {
  if (typeof window === 'undefined') return false;

  const normalizedOrderId = normalizeId(orderId || ecommerceData?.purchase?.actionField?.id);
  const normalizedRevenue = normalizeMoney(
    ecommerceData?.purchase?.actionField?.revenue ?? goalParams?.revenue
  );
  const safeGoalParams = isObj(goalParams) ? goalParams : {};
  const safeEcommerceData = isObj(ecommerceData) ? ecommerceData : null;
  const finalGoalParams = {
    ...safeGoalParams,
    ...(normalizedOrderId ? { id: normalizedOrderId, order_id: normalizedOrderId } : {}),
    revenue: normalizedRevenue,
  };
  const finalEcommerceData = safeEcommerceData
    ? {
        ...safeEcommerceData,
        purchase: {
          ...(isObj(safeEcommerceData.purchase) ? safeEcommerceData.purchase : {}),
          actionField: {
            ...(isObj(safeEcommerceData?.purchase?.actionField) ? safeEcommerceData.purchase.actionField : {}),
            ...(normalizedOrderId ? { id: normalizedOrderId } : {}),
            revenue: normalizedRevenue,
          },
        },
      }
    : null;

  if (normalizedOrderId && shouldSkipPurchase(normalizedOrderId)) {
    return false;
  }

  if (normalizedOrderId) {
    writePurchaseState(normalizedOrderId, 'pending');
  }

  let finalized = false;
  const finalize = () => {
    if (finalized) return;
    finalized = true;
    if (normalizedOrderId) {
      writePurchaseState(normalizedOrderId, 'sent');
    }
  };

  try {
    runWhenYmReady(() => {
      window.ym(MAIN_COUNTER_ID, 'reachGoal', 'purchase', finalGoalParams, finalize);

      const city = useCitiesStore.getState().thisCity;
      const cityCounterId = getCityCounterId(city);
      if (cityCounterId) {
        window.ym(cityCounterId, 'reachGoal', 'purchase', finalGoalParams);
      }
    });

    const dataLayer = getDataLayer();
    if (dataLayer && finalEcommerceData) {
      dataLayer.push({ ecommerce: finalEcommerceData });
    }

    // Fallback: в некоторых браузерах callback Метрики приходит нестабильно.
    window.setTimeout(finalize, 5000);
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

  const uid = userId === null || userId === undefined ? '' : String(userId).trim();
  if (!uid) return;

  try {
    runWhenYmReady(() => {
      const counters = getActiveCounterIds();
      const userParams = { UserID: uid };

      counters.forEach((counterId) => {
        window.ym(counterId, 'userParams', userParams);
      });

      if (window.__JACO_YM_USER_ID_TIMER) {
        window.clearTimeout(window.__JACO_YM_USER_ID_TIMER);
      }

      window.__JACO_YM_USER_ID_TIMER = window.setTimeout(() => {
        counters.forEach((counterId) => {
          window.ym(counterId, 'setUserID', uid);
        });
      }, USER_ID_SYNC_DELAY_MS);
    });
  } catch (e) {
    console.warn('YM setUserID error:', e);
  }
}
