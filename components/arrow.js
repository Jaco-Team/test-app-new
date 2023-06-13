import { useEffect, useState, useRef } from 'react';

import { useFooterStore } from '@/components/store';

import { ArrowUp } from '@/ui/Icons.js';

export default function Arrow() {
  //console.log('Arrow render');

  const arrowRef = useRef();

  const [footerRef] = useFooterStore((state) => [state.footerRef]);

  const [showArrow, setShowArrow] = useState(false);
  const [stopArrow, setStopArrow] = useState(false);

  const handlerArrow = () => {
    setShowArrow(window.pageYOffset > 50);
    
    if (showArrow) {

      const arrow = arrowRef.current;
      const footer = footerRef.current;

      if (arrow.getBoundingClientRect().top + document.body.scrollTop + arrow.offsetHeight >= footer.getBoundingClientRect().top + document.body.scrollTop) setStopArrow(true);

      if (document.body.scrollTop + window.innerHeight < footer.getBoundingClientRect().top + document.body.scrollTop) setStopArrow(false);
    }
  };

  const scrollUp = () => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handlerArrow);
    return () => window.removeEventListener('scroll', handlerArrow);
  }, [showArrow]);

  return (
    <div style={{ position: 'relative' }}>
      <div className={showArrow ? 'ArrowPC' : 'ArrowPCHidden'} 
        style={{ top: stopArrow ? null : '85.086%', bottom: stopArrow ? '2.1660649819495vw' : null, position: stopArrow ? 'absolute' : 'fixed' }}
        onClick={scrollUp}
        ref={arrowRef}
      >
        <ArrowUp />
      </div>
    </div>
  );
}
