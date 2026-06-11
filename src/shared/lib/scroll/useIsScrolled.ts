import { useEffect, useRef, useState } from 'react';

function resolveScrollThresholds(threshold: number) {
  if (threshold === 0) {
    return { on: 8, off: 2 };
  }

  return { on: threshold, off: Math.max(threshold - 4, 0) };
}

function getIsScrolled(scrollY: number, current: boolean, threshold: number) {
  const { on, off } = resolveScrollThresholds(threshold);

  if (current) {
    return scrollY > off;
  }

  return scrollY > on;
}

export default function useIsScrolled(threshold = 0) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const scrollY = window.scrollY || 0;
      const nextIsScrolled = getIsScrolled(
        scrollY,
        isScrolledRef.current,
        threshold
      );

      if (nextIsScrolled === isScrolledRef.current) {
        return;
      }

      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };

    const onScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return isScrolled;
}
