import { useCitiesStore } from '@/components/store.js';

const MAIN_COUNTER_ID = 47085879;

function getCityCounterId(city) {
  if (!city) return null;
  const c = String(city).toLowerCase();

  if (c === 'samara') return 100325084;
  if (c === 'togliatti') return 100601350;

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
export function reachGoalMain(goal, params) {
  if (typeof window === 'undefined') return;
  if (typeof window.ym !== 'function') return;

  try {
    window.ym(MAIN_COUNTER_ID, 'reachGoal', goal, params);
  } catch (e) {
    console.warn('YM reachGoalMain error:', e);
  }
}
