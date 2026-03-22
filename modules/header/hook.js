import { useEffect } from 'react';

function useScroll() {
  useEffect(() => {
    let frame;

    const storeScroll = () => {
      document.documentElement.dataset.scroll = window.scrollY;
    };

    const onScroll = () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(storeScroll);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return 0;
}

export default useScroll;
