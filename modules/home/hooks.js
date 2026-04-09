import { useEffect, useRef, useState } from 'react';

function useCheckCat(CatsItems) {
  const [activeID, setActiveID] = useState({id: 0, parent_id: 0});
  const lastPOSRef = useRef(0);
  const activeIDRef = useRef(activeID);

  useEffect(() => {
    activeIDRef.current = activeID;
  }, [activeID]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const scrollFunc = () => {
      const thisPOS = document.documentElement.scrollTop;

      if (!Array.isArray(CatsItems) || CatsItems.length === 0) {
        return;
      }

      if (Math.abs(thisPOS - lastPOSRef.current) <= 200) {
        return;
      }

      const arrMax = [];

      CatsItems.forEach((item) => {
        let elem = document.getElementById('cat' + item.id);

        if (elem) {
          const top = elem.getBoundingClientRect().top + document.body.scrollTop - 250;

          if (top < 0) {
            arrMax.push({ name: item.name, Y: top, parent_id: item.parent_id, id: item.id });
          }

          return;
        }

        (item.cats || []).forEach((it) => {
          elem = document.getElementById('cat' + it.id);

          if (!elem) {
            return;
          }

          const top = elem.getBoundingClientRect().top + document.body.scrollTop - 250;

          if (top < 0) {
            arrMax.push({ name: it.name, Y: top, parent_id: it.parent_id, id: it.id });
          }
        });
      });

      if (arrMax.length > 0) {
        const max = arrMax[arrMax.length - 1];
        const prev = activeIDRef.current;

        if (
          max &&
          (
            parseInt(prev.id) !== parseInt(max.id) ||
            parseInt(prev.parent_id) !== parseInt(max.parent_id)
          )
        ) {
          setActiveID({ id: max.id, parent_id: max.parent_id });
        }
      }

      lastPOSRef.current = thisPOS;
    };

    window.addEventListener('scroll', scrollFunc, { passive: true });
    scrollFunc();

    return () => {
      window.removeEventListener('scroll', scrollFunc);
    };
  }, [CatsItems]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const timer = window.setTimeout(() => {
      Array.from(document.querySelectorAll('.Cat')).forEach((element) => element.classList.remove('active'));

      if (activeID.parent_id) {
        document.querySelector('#link_' + activeID.parent_id)?.classList.add('active');
      }

      if (activeID.id) {
        document.querySelector('#link_' + activeID.id)?.classList.add('active');
      }
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeID]);

  return activeID;
}

export default useCheckCat;    
