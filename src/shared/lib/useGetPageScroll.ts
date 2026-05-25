import { useEffect, useState } from 'react';

export default function useGetPageScroll() {
  const [scrollYValue, setScrollYValue] = useState(0);
  const onScroll = () => setScrollYValue(window.scrollY || 0);
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return { isScrolled: scrollYValue > 0, scrollY: scrollYValue };
}
