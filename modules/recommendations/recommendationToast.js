import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  RECOMMENDATION_ADDED_EVENT,
  RECOMMENDATION_FEEDBACK_DURATION_MS,
} from '@/utils/recommendationFeedback';

function toastPosition() {
  if (window.innerWidth <= 667) return undefined;
  const column = [...document.querySelectorAll('.modalCardItemPC .SecondItem')]
    .find((node) => node.getBoundingClientRect().width > 0);
  const panel = column?.closest('.MuiDialog-paper') ||
    document.querySelector('#simple-popover .MuiPaper-root');
  const rect = panel?.getBoundingClientRect();
  const left = column && window.innerWidth >= 991
    ? column.getBoundingClientRect().left
    : rect ? rect.left + 20 : window.innerWidth / 2 - 180;
  return {
    left: Math.max(16, Math.min(left, window.innerWidth - 376)),
    top: Math.max(16, (rect?.top ?? 72) + 20),
  };
}

export default function RecommendationToast() {
  const [notice, setNotice] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    let resizeFrame;
    const dismiss = () => {
      clearTimeout(timer.current);
      setNotice(null);
    };
    const show = () => {
      clearTimeout(timer.current);
      setNotice((previous) => ({ version: (previous?.version ?? 0) + 1, position: toastPosition() }));
      timer.current = setTimeout(dismiss, RECOMMENDATION_FEEDBACK_DURATION_MS);
    };
    const reposition = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        setNotice((previous) => previous
          ? { ...previous, position: toastPosition() }
          : previous);
      });
    };
    window.addEventListener(RECOMMENDATION_ADDED_EVENT, show);
    window.addEventListener('resize', reposition);
    window.addEventListener('pointerdown', dismiss);
    return () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener(RECOMMENDATION_ADDED_EVENT, show);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('pointerdown', dismiss);
    };
  }, []);

  if (!notice) return null;
  return createPortal(
    <div
      className="RecommendationAddedToast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={notice.position}
      key={notice.version}
    >
      <picture>
        <source media="(max-width: 667px)" srcSet="/recommendations/check-added-mobile.svg" />
        <img src="/recommendations/check-added.svg" alt="" />
      </picture>
      <span>Готово! Товар добавлен в корзину</span>
    </div>,
    document.body
  );
}
