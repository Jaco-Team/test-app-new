// Один наблюдатель на блок; отложенный callback не переживает размонтирование.
export function observeScrollSections(ids, onChange, offset = 65) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  let frame = null;
  let disposed = false;
  let previous = null;
  const update = () => {
    frame = null;
    if (disposed) return;
    let active = null;
    for (const id of ids) {
      const element = document.getElementById(id);
      if (!element) continue;
      if (active === null || element.getBoundingClientRect().top <= offset + 1) active = id;
    }
    if (active !== null && active !== previous) {
      previous = active;
      onChange(active);
    }
  };
  const schedule = () => {
    if (!disposed && frame === null) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  return () => {
    disposed = true;
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (frame !== null) window.cancelAnimationFrame(frame);
  };
}
