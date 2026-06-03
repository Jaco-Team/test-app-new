import { useEffect, useState } from 'react';

function getIsScrolled(threshold: number) {
  if (typeof window === 'undefined') {
    return false;
  }

  return (window.scrollY || 0) > threshold;
}

export default function useIsScrolled(threshold = 0) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const nextIsScrolled = getIsScrolled(threshold);
      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled
      );
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
