function getBrowserStorage(type) {
  if (typeof window === 'undefined') return null;

  try {
    return window?.[type] ?? null;
  } catch {
    return null;
  }
}

function getStorageItem(type, key) {
  const storage = getBrowserStorage(type);
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(type, key, value) {
  const storage = getBrowserStorage(type);
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStorageItem(type, key) {
  const storage = getBrowserStorage(type);
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function getStorageJson(type, key, fallback = null) {
  const raw = getStorageItem(type, key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function getLocalStorageItem(key) {
  return getStorageItem('localStorage', key);
}

export function setLocalStorageItem(key, value) {
  return setStorageItem('localStorage', key, value);
}

export function removeLocalStorageItem(key) {
  return removeStorageItem('localStorage', key);
}

export function getLocalStorageJson(key, fallback = null) {
  return getStorageJson('localStorage', key, fallback);
}

export function getSessionStorageItem(key) {
  return getStorageItem('sessionStorage', key);
}

export function setSessionStorageItem(key, value) {
  return setStorageItem('sessionStorage', key, value);
}

export function removeSessionStorageItem(key) {
  return removeStorageItem('sessionStorage', key);
}

export function getSessionStorageJson(key, fallback = null) {
  return getStorageJson('sessionStorage', key, fallback);
}
