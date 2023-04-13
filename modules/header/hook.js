import { useEffect } from 'react';

function useScroll() {

  const debounce = (fn) => {
    let frame;

    return (...params) => {
      if (frame) { 
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        fn(...params);
      });
    } 
  };

  const storeScroll = () => {
    document.documentElement.dataset.scroll = window.scrollY;
  }

  useEffect(() => {
    window.addEventListener('scroll', debounce(storeScroll), { passive: true });

    return () => {
      window.removeEventListener('scroll', debounce(storeScroll), { passive: true });
    };
  });

  return 0;
}

export default useScroll;