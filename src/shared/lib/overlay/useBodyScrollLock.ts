import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';
let previousScrollbarCompensation = '';

function getScrollbarWidth(): number {
  const measuredWidth =
    window.innerWidth - document.documentElement.clientWidth;

  if (measuredWidth > 0) {
    return measuredWidth;
  }

  return document.documentElement.scrollHeight > window.innerHeight ? 15 : 0;
}

function getPixelValue(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') {
      return;
    }

    const body = document.body;
    const root = document.documentElement;

    if (lockCount === 0) {
      previousOverflow = body.style.overflow;
      previousPaddingRight = body.style.paddingRight;
      previousScrollbarCompensation = root.style.getPropertyValue(
        '--ui-scrollbar-compensation'
      );

      const scrollbarWidth = getScrollbarWidth();
      const currentPaddingRight = getPixelValue(
        window.getComputedStyle(body).paddingRight
      );
      body.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
      }

      root.style.setProperty(
        '--ui-scrollbar-compensation',
        `${scrollbarWidth}px`
      );
      root.dataset.uiScrollLocked = 'true';
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount === 0) {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPaddingRight;

        if (previousScrollbarCompensation) {
          root.style.setProperty(
            '--ui-scrollbar-compensation',
            previousScrollbarCompensation
          );
        } else {
          root.style.removeProperty('--ui-scrollbar-compensation');
        }

        delete root.dataset.uiScrollLocked;
      }
    };
  }, [active]);
}
