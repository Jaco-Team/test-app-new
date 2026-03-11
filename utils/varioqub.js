import { useEffect, useState } from 'react';

const VARIOQUB_COUNTER_ID = 47085879;
const VARIOQUB_CLIENT_ID = `metrika.${VARIOQUB_COUNTER_ID}`;
const VARIOQUB_EVENT = 'varioqub:flags';

function normalizeFlags(rawFlags) {
  if (!rawFlags || typeof rawFlags !== 'object') {
    return {};
  }

  return Object.entries(rawFlags).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value[0];
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}

function emitFlags(flags) {
  if (typeof window === 'undefined') return;

  window.__varioqubFlags = flags;
  window.dispatchEvent(new CustomEvent(VARIOQUB_EVENT, { detail: flags }));
}

export function initVarioqub() {
  if (typeof window === 'undefined') return;
  if (typeof window.ymab !== 'function') return;

  try {
    window.ymab(VARIOQUB_CLIENT_ID, 'getFlags', (rawFlags) => {
      emitFlags(normalizeFlags(rawFlags));
    });
  } catch (error) {
    console.warn('Varioqub init error:', error);
  }
}

export function getVarioqubFlag(flagKey, fallback = 'control') {
  if (typeof window === 'undefined') return fallback;

  const flags = window.__varioqubFlags;
  if (!flags || typeof flags !== 'object') return fallback;

  const value = flags[flagKey];
  return value == null || value === '' ? fallback : value;
}

export function useVarioqubFlag(flagKey, fallback = 'control') {
  const [value, setValue] = useState(() => getVarioqubFlag(flagKey, fallback));

  useEffect(() => {
    const updateValue = (event) => {
      const flags = event?.detail;

      if (!flags || typeof flags !== 'object') {
        setValue(fallback);
        return;
      }

      const nextValue = flags[flagKey];
      setValue(nextValue == null || nextValue === '' ? fallback : nextValue);
    };

    window.addEventListener(VARIOQUB_EVENT, updateValue);
    setValue(getVarioqubFlag(flagKey, fallback));

    return () => {
      window.removeEventListener(VARIOQUB_EVENT, updateValue);
    };
  }, [fallback, flagKey]);

  return value;
}
