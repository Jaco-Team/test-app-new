export const roistatReady = (cb) => {
  if (typeof window === 'undefined') return;
  window.onRoistatAllModulesLoaded = cb;
};